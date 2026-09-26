import { canSendOTP, generate6DigitOTP, saveOTP } from "../_lib/otpStore";
import { sendOtpEmail } from "../_lib/mailer";
import { findStudentRecordsByEmail } from "../_lib/db";

export default async function handler(req: any, res: any) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    let body: any = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { email } = body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const normalized = email.trim().toLowerCase();

    // Check rate limit / resend cooldown
    const rateCheck = canSendOTP(normalized);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Please wait ${rateCheck.remainingSeconds} seconds before requesting a new OTP.`,
      });
    }

    // Check if student exists
    const records = await findStudentRecordsByEmail(normalized);

    // If records exist for this email, generate and send OTP
    if (records && records.length > 0) {
      const otp = generate6DigitOTP();
      saveOTP(normalized, otp);

      const emailResult = await sendOtpEmail(normalized, otp);
      if (!emailResult.success) {
        console.error("[AUTH] Failed to send email via SMTP:", emailResult.error);
        return res.status(500).json({
          error: emailResult.error
            ? `Failed to send OTP via SMTP: ${emailResult.error}`
            : "Failed to send OTP email via SMTP. Please verify server SMTP configuration.",
        });
      }
    } else {
      // Intentionally do not send, but return identical message to avoid account enumeration
      console.log(`[AUTH] Send OTP requested for non-existent student email: ${normalized}`);
    }

    return res.status(200).json({
      success: true,
      message: "If an eligible account exists for this email, an OTP has been sent.",
    });
  } catch (err: any) {
    console.error("[AUTH] send-otp error:", err.message || err);
    const isConfigError = err.message && err.message.includes("Firebase Admin credentials");
    return res.status(500).json({
      error: isConfigError
        ? "Server Firestore configuration error: Firebase Admin credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing or invalid."
        : "Internal server error while sending OTP.",
    });
  }
}
