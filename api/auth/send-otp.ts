import { canSendOTP, generate6DigitOTP, saveOTP } from "../_lib/otpStore";
import { sendOtpEmail } from "../_lib/mailer";
import { findStudentRecordsByEmail } from "../_lib/db";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  let currentStage = "request_validation";

  try {
    console.log("[STUDENT_OTP] request received");

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
      console.warn(
        `[STUDENT_OTP_ERROR]\nstage=email_validation\nname=ValidationError\nmessage=Invalid or missing email address\ncode=INVALID_EMAIL\nresponseCode=400\ncommand=validateEmail`
      );
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    const normalized = email.trim().toLowerCase();
    console.log("[STUDENT_OTP] email validated");

    // Check rate limit / resend cooldown
    currentStage = "cooldown_check";
    const rateCheck = await canSendOTP(normalized);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${rateCheck.remainingSeconds} seconds before requesting a new OTP.`,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // Check if student exists
    currentStage = "student_lookup";
    let records: any[] = [];
    try {
      records = await findStudentRecordsByEmail(normalized);
    } catch (lookupErr: any) {
      console.error(
        `[STUDENT_OTP_ERROR]\nstage=${currentStage}\nname=${lookupErr?.name || "LookupError"}\nmessage=${lookupErr?.message || "Failed student lookup"}\ncode=LOOKUP_FAILED\nresponseCode=500\ncommand=findStudentRecordsByEmail`
      );
      const isConfigError = lookupErr?.message && lookupErr.message.includes("Firebase Admin credentials");
      return res.status(500).json({
        success: false,
        error: isConfigError
          ? "Server Firestore configuration error: Firebase Admin credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing or invalid."
          : "Unable to process verification request. Please try again later.",
      });
    }

    console.log("[STUDENT_OTP] student lookup completed");

    // If records exist for this email, generate and send OTP
    if (records && records.length > 0) {
      currentStage = "otp_generation";
      console.log("[STUDENT_OTP] OTP generation started");
      const otp = generate6DigitOTP();

      currentStage = "otp_storage";
      console.log("[STUDENT_OTP] OTP storage started");
      await saveOTP(normalized, otp);
      console.log("[STUDENT_OTP] OTP storage successful");

      currentStage = "smtp_send";
      console.log("[STUDENT_OTP] SMTP send started");
      const emailResult = await sendOtpEmail(normalized, otp);
      if (!emailResult.success) {
        console.error(
          `[STUDENT_OTP_ERROR]\nstage=${currentStage}\nname=SmtpError\nmessage=${emailResult.error || "Failed to send email via SMTP"}\ncode=SMTP_SEND_FAILED\nresponseCode=500\ncommand=sendOtpEmail`
        );
        return res.status(500).json({
          success: false,
          error: "Failed to send OTP email via SMTP. Please verify server SMTP configuration.",
        });
      }

      console.log("[STUDENT_OTP] SMTP send successful");
    } else {
      // Intentionally do not send, but return identical message to avoid account enumeration
      console.log(`[STUDENT_OTP] student lookup completed: no records found for normalized email`);
    }

    return res.status(200).json({
      success: true,
      message: "If an eligible account exists for this email, an OTP has been sent.",
    });
  } catch (err: any) {
    console.error(
      `[STUDENT_OTP_ERROR]\nstage=${currentStage}\nname=${err?.name || "UnhandledError"}\nmessage=${err?.message || String(err)}\ncode=${err?.code || "INTERNAL_SERVER_ERROR"}\nresponseCode=500\ncommand=handler`
    );
    return res.status(500).json({
      success: false,
      error: "Internal server error while sending OTP.",
    });
  }
}
