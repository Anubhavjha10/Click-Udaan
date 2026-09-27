import { getAdminAuth } from "../_lib/firebaseAdmin";
import {
  canSendAdminOTP,
  generateAdmin6DigitOTP,
  saveAdminOTP,
  maskEmail,
} from "../_lib/adminOtpStore";
import { sendAdminOtpEmail } from "../_lib/mailer";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  let currentStage = "request_validation";

  try {
    console.log("[ADMIN_OTP] request received");

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      console.warn("[ADMIN_OTP_ERROR] stage=authorization_check message=Missing or invalid authorization header");
      return res.status(401).json({ success: false, error: "Unauthorized. Missing authentication token." });
    }

    console.log("[ADMIN_OTP] authorization header present");

    const idToken = authHeader.slice(7).trim();
    if (!idToken) {
      return res.status(401).json({ success: false, error: "Unauthorized. Token is empty." });
    }

    currentStage = "firebase_admin_init";
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      console.error(
        `[ADMIN_OTP_ERROR]\nstage=${currentStage}\nname=ConfigurationError\nmessage=Firebase Admin SDK is not configured on the server\ncode=AUTH_INIT_FAILED\nresponseCode=500\ncommand=getAdminAuth`
      );
      return res.status(500).json({
        success: false,
        error: "Server authentication error: Firebase Admin credentials are not configured.",
      });
    }

    // 1. Verify the Firebase ID token
    currentStage = "firebase_token_verification";
    console.log("[ADMIN_OTP] Firebase token verification started");
    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (tokenErr: any) {
      console.error(
        `[ADMIN_OTP_ERROR]\nstage=${currentStage}\nname=${tokenErr?.name || "TokenVerificationError"}\nmessage=${tokenErr?.message || "Invalid Firebase ID token"}\ncode=${tokenErr?.code || "INVALID_ID_TOKEN"}\nresponseCode=401\ncommand=verifyIdToken`
      );
      return res.status(401).json({
        success: false,
        error: "Session expired or invalid. Please sign in again.",
      });
    }

    console.log("[ADMIN_OTP] Firebase token verification successful");

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!uid) {
      console.error(`[ADMIN_OTP_ERROR]\nstage=token_payload\nname=ValidationError\nmessage=UID missing in decoded token\ncode=MISSING_UID\nresponseCode=400\ncommand=verifyIdToken`);
      return res.status(400).json({ success: false, error: "Authentication token missing user UID." });
    }
    console.log("[ADMIN_OTP] UID available");

    if (!email) {
      console.error(`[ADMIN_OTP_ERROR]\nstage=token_payload\nname=ValidationError\nmessage=Email missing in decoded token\ncode=MISSING_EMAIL\nresponseCode=400\ncommand=verifyIdToken`);
      return res.status(400).json({
        success: false,
        error: "Authenticated Firebase user does not have an email address.",
      });
    }
    console.log("[ADMIN_OTP] email available");

    // 2. Check rate limit / resend cooldown (60 seconds)
    currentStage = "cooldown_check";
    const rateCheck = await canSendAdminOTP(uid);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${rateCheck.remainingSeconds} seconds before requesting a new OTP.`,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // 3. Generate cryptographically secure 6-digit OTP and store hashed
    currentStage = "otp_generation";
    console.log("[ADMIN_OTP] OTP generation started");
    const otp = generateAdmin6DigitOTP();

    currentStage = "otp_storage";
    console.log("[ADMIN_OTP] OTP storage started");
    await saveAdminOTP(uid, email, otp);
    console.log("[ADMIN_OTP] OTP storage successful");

    // 4. Send OTP to the authenticated Firebase user's email ONLY
    currentStage = "smtp_send";
    console.log("[ADMIN_OTP] SMTP send started");
    const emailResult = await sendAdminOtpEmail(email, otp);
    if (!emailResult.success) {
      console.error(
        `[ADMIN_OTP_ERROR]\nstage=${currentStage}\nname=SmtpError\nmessage=${emailResult.error || "Failed to send email via SMTP"}\ncode=SMTP_SEND_FAILED\nresponseCode=500\ncommand=sendAdminOtpEmail`
      );
      return res.status(500).json({
        success: false,
        error: "Unable to send verification code. Please verify server SMTP configuration.",
      });
    }

    console.log("[ADMIN_OTP] SMTP send successful");

    return res.status(200).json({
      success: true,
      maskedEmail: maskEmail(email),
      message: "A 6-digit verification code has been sent to your email.",
    });
  } catch (err: any) {
    console.error(
      `[ADMIN_OTP_ERROR]\nstage=${currentStage}\nname=${err?.name || "UnhandledError"}\nmessage=${err?.message || String(err)}\ncode=${err?.code || "INTERNAL_SERVER_ERROR"}\nresponseCode=500\ncommand=handler`
    );
    return res.status(500).json({
      success: false,
      error: "Unable to send verification code. Please try again.",
    });
  }
}
