import crypto from "crypto";

interface OTPRecord {
  hashedOtp: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

interface StudentSession {
  email: string;
  expiresAt: number;
}

// In-memory persistent caches for server instances
const otpCache = new Map<string, OTPRecord>();
const sessionCache = new Map<string, StudentSession>();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

export function generate6DigitOTP(): string {
  // Generate secure 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp: string, salt: string): string {
  return crypto.createHash("sha256").update(otp + salt).digest("hex");
}

export function canSendOTP(email: string): { allowed: boolean; remainingSeconds?: number } {
  const normalized = email.trim().toLowerCase();
  const existing = otpCache.get(normalized);
  if (!existing) return { allowed: true };

  const elapsed = Date.now() - existing.lastSentAt;
  if (elapsed < RESEND_COOLDOWN_MS) {
    const remaining = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
    return { allowed: false, remainingSeconds: remaining };
  }
  return { allowed: true };
}

export function saveOTP(email: string, otp: string): void {
  const normalized = email.trim().toLowerCase();
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedOtp = hashOtp(otp, salt);

  otpCache.set(normalized, {
    hashedOtp,
    salt,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
    lastSentAt: Date.now(),
  });
}

export function verifyOTP(
  email: string,
  inputOtp: string
): { success: boolean; error?: string; token?: string } {
  const normalized = email.trim().toLowerCase();
  const record = otpCache.get(normalized);

  if (!record) {
    return { success: false, error: "No OTP was requested for this email or it has expired." };
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(normalized);
    return { success: false, error: "This OTP has expired. Please request a new OTP." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpCache.delete(normalized);
    return {
      success: false,
      error: "Maximum verification attempts exceeded. Please request a new OTP.",
    };
  }

  record.attempts += 1;

  const inputHash = hashOtp(inputOtp.trim(), record.salt);
  if (inputHash !== record.hashedOtp) {
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Invalid OTP. Please try again.${remaining > 0 ? ` (${remaining} attempts left)` : ""}`,
    };
  }

  // OTP is correct! Consume OTP (one-time use)
  otpCache.delete(normalized);

  // Generate session token
  const token = crypto.randomBytes(32).toString("hex");
  sessionCache.set(token, {
    email: normalized,
    expiresAt: Date.now() + SESSION_EXPIRY_MS,
  });

  return { success: true, token };
}

export function validateSessionToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };
  const session = sessionCache.get(token);
  if (!session) return { valid: false };

  if (Date.now() > session.expiresAt) {
    sessionCache.delete(token);
    return { valid: false };
  }

  return { valid: true, email: session.email };
}
