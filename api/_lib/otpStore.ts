import crypto from "crypto";
import { getAdminFirestore } from "./firebaseAdmin";

export interface PersistentOTPRecord {
  purpose: "STUDENT_LOGIN" | "ADMIN_LOGIN";
  identifier: string;
  otpHash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  used: boolean;
  createdAt: number;
  lastSentAt: number;
}

// In-memory fallback if Firestore is slow or unreachable in transient instances
const memoryCache = new Map<string, PersistentOTPRecord>();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const STUDENT_SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours
const FIRESTORE_OP_TIMEOUT_MS = 4000; // 4s timeout to avoid Vercel Lambda limits

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise,
  ]).catch((err) => {
    clearTimeout(timer);
    console.warn("[STUDENT_OTP] Firestore operation notice:", err?.message || err);
    return null;
  });
}

export function generate6DigitOTP(): string {
  // Cryptographically secure 6-digit number [100000, 999999] - Never Math.random()
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp: string, salt: string): string {
  return crypto.createHash("sha256").update(otp + salt).digest("hex");
}

function getStudentDocKey(email: string): string {
  return crypto.createHash("sha256").update("STUDENT:" + email.trim().toLowerCase()).digest("hex");
}

export async function canSendOTP(email: string): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  const normalized = email.trim().toLowerCase();
  const docKey = getStudentDocKey(normalized);

  try {
    const db = getAdminFirestore();
    let lastSentAt: number | undefined;

    if (db) {
      const snap = await withTimeout(db.collection("otpRecords").doc(docKey).get(), FIRESTORE_OP_TIMEOUT_MS);
      if (snap && snap.exists) {
        lastSentAt = snap.data()?.lastSentAt;
      }
    }

    if (!lastSentAt) {
      const mem = memoryCache.get(docKey);
      lastSentAt = mem?.lastSentAt;
    }

    if (lastSentAt) {
      const elapsed = Date.now() - lastSentAt;
      if (elapsed < RESEND_COOLDOWN_MS) {
        const remaining = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return { allowed: false, remainingSeconds: remaining };
      }
    }
  } catch (err) {
    console.error("[STUDENT_OTP] Error checking cooldown:", err);
  }

  return { allowed: true };
}

export async function saveOTP(email: string, otp: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const docKey = getStudentDocKey(normalized);
  const salt = crypto.randomBytes(16).toString("hex");
  const otpHash = hashOtp(otp, salt);
  const now = Date.now();

  const record: PersistentOTPRecord = {
    purpose: "STUDENT_LOGIN",
    identifier: normalized,
    otpHash,
    salt,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    used: false,
    createdAt: now,
    lastSentAt: now,
  };

  // Always write to local memoryCache for speed and fallback
  memoryCache.set(docKey, record);

  try {
    const db = getAdminFirestore();
    if (db) {
      await withTimeout(
        db.collection("otpRecords").doc(docKey).set(record),
        FIRESTORE_OP_TIMEOUT_MS
      );
    }
  } catch (err) {
    console.error("[STUDENT_OTP] Error saving OTP to Firestore:", err);
  }
}

export async function verifyOTP(
  email: string,
  inputOtp: string
): Promise<{ success: boolean; error?: string; token?: string }> {
  const normalized = email.trim().toLowerCase();
  const docKey = getStudentDocKey(normalized);

  try {
    const db = getAdminFirestore();
    let record: PersistentOTPRecord | undefined;

    if (db) {
      const snap = await withTimeout(db.collection("otpRecords").doc(docKey).get(), FIRESTORE_OP_TIMEOUT_MS);
      if (snap && snap.exists) {
        record = snap.data() as PersistentOTPRecord;
      }
    }

    if (!record) {
      record = memoryCache.get(docKey);
    }

    if (!record) {
      return { success: false, error: "No OTP was requested for this email or it has expired." };
    }

    const now = Date.now();

    // Check expiration
    if (now > record.expiresAt) {
      memoryCache.delete(docKey);
      if (db) {
        withTimeout(db.collection("otpRecords").doc(docKey).delete(), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
      }
      return { success: false, error: "This OTP has expired. Please request a new OTP." };
    }

    // Check if already used
    if (record.used) {
      return { success: false, error: "This OTP has already been used. Please request a new code." };
    }

    // Check maximum attempts
    if (record.attempts >= MAX_ATTEMPTS) {
      memoryCache.delete(docKey);
      if (db) {
        withTimeout(db.collection("otpRecords").doc(docKey).delete(), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
      }
      return { success: false, error: "Maximum verification attempts exceeded. Please request a new OTP." };
    }

    // Verify hashed OTP
    const inputHash = hashOtp(inputOtp.trim(), record.salt);
    if (inputHash !== record.otpHash) {
      const newAttempts = (record.attempts || 0) + 1;
      record.attempts = newAttempts;
      memoryCache.set(docKey, record);

      if (db) {
        if (newAttempts >= MAX_ATTEMPTS) {
          withTimeout(db.collection("otpRecords").doc(docKey).delete(), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
        } else {
          withTimeout(db.collection("otpRecords").doc(docKey).update({ attempts: newAttempts }), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
        }
      }

      const remaining = MAX_ATTEMPTS - newAttempts;
      return {
        success: false,
        error: `Invalid OTP. Please try again.${remaining > 0 ? ` (${remaining} attempts left)` : ""}`,
      };
    }

    // Success! Consume OTP (one-time use)
    record.used = true;
    memoryCache.set(docKey, record);
    if (db) {
      await withTimeout(
        db.collection("otpRecords").doc(docKey).update({ used: true }),
        FIRESTORE_OP_TIMEOUT_MS
      );
    }
    memoryCache.delete(docKey);

    // Generate secure HMAC-signed student session token (stateless & shared across all Vercel Lambdas)
    const token = createStudentSessionToken(normalized);
    return { success: true, token };
  } catch (err: any) {
    console.error("[STUDENT_OTP] Error during verification:", err);
    return { success: false, error: "Internal error during verification." };
  }
}

function getStudentSecret(): string {
  return (
    process.env.STUDENT_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.FIREBASE_PRIVATE_KEY ||
    "clickudaan-secure-student-session-salt-2026"
  );
}

export function createStudentSessionToken(email: string): string {
  const payload = {
    email: email.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + STUDENT_SESSION_EXPIRY_MS,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getStudentSecret())
    .update(payloadStr)
    .digest("hex");
  return `${payloadStr}.${signature}`;
}

export function validateSessionToken(token: string): { valid: boolean; email?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payloadStr, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", getStudentSecret())
    .update(payloadStr)
    .digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}
