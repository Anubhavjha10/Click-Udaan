import { describe, it, expect, beforeEach } from "vitest";
import {
  generate6DigitOTP,
  saveOTP,
  verifyOTP,
  canSendOTP,
  createStudentSessionToken,
  validateSessionToken,
} from "../../api/_lib/otpStore";

describe("Student OTP Generation & Persistence", () => {
  it("generates a cryptographically secure 6-digit OTP string", () => {
    for (let i = 0; i < 50; i++) {
      const otp = generate6DigitOTP();
      expect(otp).toMatch(/^\d{6}$/);
      const num = parseInt(otp, 10);
      expect(num).toBeGreaterThanOrEqual(100000);
      expect(num).toBeLessThan(1000000);
    }
  });

  it("handles student OTP save and verify lifecycle", async () => {
    const email = "student.test@clickudaan.in";
    const otp = "123456";

    await saveOTP(email, otp);

    // Incorrect OTP
    const wrongRes = await verifyOTP(email, "654321");
    expect(wrongRes.success).toBe(false);
    expect(wrongRes.error).toContain("Invalid OTP");

    // Correct OTP
    const correctRes = await verifyOTP(email, otp);
    expect(correctRes.success).toBe(true);
    expect(correctRes.token).toBeTruthy();

    // Already consumed OTP cannot be reused
    const reuseRes = await verifyOTP(email, otp);
    expect(reuseRes.success).toBe(false);
  });

  it("enforces cooldown rate limiting on resend", async () => {
    const email = "cooldown.test@clickudaan.in";
    await saveOTP(email, "999888");

    const check = await canSendOTP(email);
    expect(check.allowed).toBe(false);
    expect(check.remainingSeconds).toBeGreaterThan(0);
    expect(check.remainingSeconds).toBeLessThanOrEqual(60);
  });
});

describe("Student Session Token Lifecycle", () => {
  const email = "student@clickudaan.in";

  it("creates and validates a signed HMAC student session token", () => {
    const token = createStudentSessionToken(email);
    expect(token).toBeTruthy();
    expect(token).toContain(".");

    const validation = validateSessionToken(token);
    expect(validation.valid).toBe(true);
    expect(validation.email).toBe(email);
  });

  it("rejects tampered student session tokens", () => {
    const token = createStudentSessionToken(email);
    const tampered = token.slice(0, -4) + "zzzz";
    const validation = validateSessionToken(tampered);
    expect(validation.valid).toBe(false);
  });

  it("rejects invalid or empty student tokens", () => {
    expect(validateSessionToken("").valid).toBe(false);
    expect(validateSessionToken("invalid-token").valid).toBe(false);
  });
});
