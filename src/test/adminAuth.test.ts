import { describe, it, expect } from "vitest";
import {
  generateAdmin6DigitOTP,
  maskEmail,
  createAdminSessionToken,
  validateAdminSessionToken,
} from "../../api/_lib/adminOtpStore";

describe("Admin OTP Generation & Masking", () => {
  it("generates a cryptographically secure 6-digit OTP string", () => {
    for (let i = 0; i < 50; i++) {
      const otp = generateAdmin6DigitOTP();
      expect(otp).toMatch(/^\d{6}$/);
      const num = parseInt(otp, 10);
      expect(num).toBeGreaterThanOrEqual(100000);
      expect(num).toBeLessThan(1000000);
    }
  });

  it("masks admin emails properly without exposing full identity", () => {
    expect(maskEmail("clickudaan@gmail.com")).toBe("c***n@gmail.com");
    expect(maskEmail("admin@company.com")).toBe("a***n@company.com");
    expect(maskEmail("ab@domain.com")).toBe("a***@domain.com");
    expect(maskEmail("")).toBe("registered email");
  });
});

describe("Admin Session Token Lifecycle", () => {
  const uid = "LfzdNp4XB5WMcKl8VIqRvPTC4Y43";
  const email = "clickudaan@gmail.com";

  it("creates and validates a signed HMAC session token", () => {
    const token = createAdminSessionToken(uid, email);
    expect(token).toBeTruthy();
    expect(token).toContain(".");

    const validation = validateAdminSessionToken(token, uid);
    expect(validation.valid).toBe(true);
    expect(validation.email).toBe(email);
  });

  it("rejects token if UID does not match", () => {
    const token = createAdminSessionToken(uid, email);
    const validation = validateAdminSessionToken(token, "different-uid-123");
    expect(validation.valid).toBe(false);
  });

  it("rejects tampered tokens", () => {
    const token = createAdminSessionToken(uid, email);
    const tampered = token.slice(0, -4) + "abcd";
    const validation = validateAdminSessionToken(tampered, uid);
    expect(validation.valid).toBe(false);
  });

  it("rejects invalid or empty tokens", () => {
    expect(validateAdminSessionToken("", uid).valid).toBe(false);
    expect(validateAdminSessionToken("invalid-token", uid).valid).toBe(false);
    expect(validateAdminSessionToken("abc.def.ghi", uid).valid).toBe(false);
  });
});
