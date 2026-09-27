import crypto from "crypto";
import { getAdminFirestore } from "./firebaseAdmin";

interface AdminOTPRecord {
  purpose?: string;
  identifier?: string;
  hashedOtp: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  used?: boolean;
  createdAt?: number;
  lastSentAt: number;
  uid: string;
  email: string;
}

// In-memory fallback if Firestore is slow, unreachable, or in serverless warm instances
const memoryCache = new Map<string, AdminOTPRecord>();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours
const FIRESTORE_OP_TIMEOUT_MS = 4000; // 4s max to avoid Lambda timeouts

function getAdminDocKey(uid: string): string {
  return crypto.createHash("sha256").update("ADMIN:" + uid).digest("hex");
}

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
    console.warn("[ADMIN_OTP] Firestore operation failed:", err?.message || err);
    return null;
  });
}

export function generateAdmin6DigitOTP(): string {
  // Cryptographically secure 6-digit number [100000, 999999] - Never Math.random()
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp: string, salt: string): string {
  return crypto.createHash("sha256").update(otp + salt).digest("hex");
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "registered email";
  const [user, domain] = email.split("@");
  if (user.length <= 2) {
    return `${user[0]}***@${domain}`;
  }
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

export async function canSendAdminOTP(
  uid: string
): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  const docKey = getAdminDocKey(uid);

  try {
    const db = getAdminFirestore();
    let lastSentAt: number | undefined;

    if (db) {
      // Check otpRecords first
      const snap = await withTimeout(db.collection("otpRecords").doc(docKey).get(), FIRESTORE_OP_TIMEOUT_MS);
      if (snap && snap.exists) {
        lastSentAt = snap.data()?.lastSentAt;
      }
    }

    if (!lastSentAt) {
      const mem = memoryCache.get(docKey) || memoryCache.get(uid);
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
    console.error("[ADMIN_OTP] Error checking cooldown:", err);
  }
  return { allowed: true };
}

export async function saveAdminOTP(
  uid: string,
  email: string,
  otp: string
): Promise<void> {
  const docKey = getAdminDocKey(uid);
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedOtp = hashOtp(otp, salt);
  const now = Date.now();

  const record: AdminOTPRecord = {
    purpose: "ADMIN_LOGIN",
    identifier: uid,
    hashedOtp,
    salt,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    used: false,
    createdAt: now,
    lastSentAt: now,
    uid,
    email: email.trim().toLowerCase(),
  };

  // Always write to memoryCache for immediate availability
  memoryCache.set(docKey, record);
  memoryCache.set(uid, record);

  try {
    const db = getAdminFirestore();
    if (db) {
      await withTimeout(
        db.collection("otpRecords").doc(docKey).set(record),
        FIRESTORE_OP_TIMEOUT_MS
      );
    }
  } catch (err) {
    console.error("[ADMIN_OTP] Error saving OTP to Firestore:", err);
  }
}

export async function verifyAdminOTP(
  uid: string,
  inputOtp: string
): Promise<{ success: boolean; error?: string }> {
  const docKey = getAdminDocKey(uid);

  try {
    const db = getAdminFirestore();
    let record: AdminOTPRecord | undefined;

    if (db) {
      const snap = await withTimeout(db.collection("otpRecords").doc(docKey).get(), FIRESTORE_OP_TIMEOUT_MS);
      if (snap && snap.exists) {
        record = snap.data() as AdminOTPRecord;
      }
    }

    if (!record) {
      record = memoryCache.get(docKey) || memoryCache.get(uid);
    }

    if (!record) {
      return { success: false, error: "No OTP was requested for this account or it has expired." };
    }

    const now = Date.now();

    // Check expiration
    if (now > record.expiresAt) {
      memoryCache.delete(docKey);
      memoryCache.delete(uid);
      if (db) {
        withTimeout(db.collection("otpRecords").doc(docKey).delete(), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
      }
      return { success: false, error: "OTP has expired. Please request a new code." };
    }

    // Check if already used
    if (record.used) {
      return { success: false, error: "This OTP has already been used. Please request a new OTP." };
    }

    // Check maximum attempts
    if (record.attempts >= MAX_ATTEMPTS) {
      memoryCache.delete(docKey);
      memoryCache.delete(uid);
      if (db) {
        withTimeout(db.collection("otpRecords").doc(docKey).delete(), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
      }
      return { success: false, error: "Too many attempts. Please request a new OTP." };
    }

    // Verify hashed OTP
    const inputHash = hashOtp(inputOtp.trim(), record.salt);
    if (inputHash !== record.hashedOtp) {
      const newAttempts = (record.attempts || 0) + 1;
      record.attempts = newAttempts;
      memoryCache.set(docKey, record);
      memoryCache.set(uid, record);

      if (db) {
        if (newAttempts >= MAX_ATTEMPTS) {
          withTimeout(db.collection("otpRecords").doc(docKey).delete(), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
        } else {
          withTimeout(db.collection("otpRecords").doc(docKey).update({ attempts: newAttempts }), FIRESTORE_OP_TIMEOUT_MS).catch(() => {});
        }
      }

      if (newAttempts >= MAX_ATTEMPTS) {
        return { success: false, error: "Too many attempts. Please request a new OTP." };
      }

      return { success: false, error: "Invalid OTP." };
    }

    // Success! Consume OTP (one-time use)
    record.used = true;
    memoryCache.set(docKey, record);
    memoryCache.set(uid, record);
    if (db) {
      await withTimeout(
        db.collection("otpRecords").doc(docKey).update({ used: true }),
        FIRESTORE_OP_TIMEOUT_MS
      );
    }
    memoryCache.delete(docKey);
    memoryCache.delete(uid);

    return { success: true };
  } catch (err: any) {
    console.error("[ADMIN_OTP] Error during verification:", err);
    return { success: false, error: "Internal error during verification." };
  }
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.FIREBASE_PRIVATE_KEY ||
    "clickudaan-secure-admin-session-salt-2026"
  );
}

export function createAdminSessionToken(uid: string, email: string): string {
  const payload = {
    uid,
    email: email.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_MS,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadStr)
    .digest("hex");
  return `${payloadStr}.${signature}`;
}

export function validateAdminSessionToken(
  token: string,
  expectedUid: string
): { valid: boolean; email?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payloadStr, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
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
    if (payload.uid !== expectedUid) {
      return { valid: false };
    }
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}
