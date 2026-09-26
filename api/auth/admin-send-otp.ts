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
    console.log("[ADMIN_2FA] request received: POST /api/auth/admin-send-otp");

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized. Missing authentication token." });
    }

    const idToken = authHeader.slice(7).trim();
    if (!idToken) {
      return res.status(401).json({ success: false, error: "Unauthorized. Token is empty." });
    }

    currentStage = "firebase_admin_init";
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      console.error("[ADMIN_2FA_ERROR]", {
        endpoint: "/api/auth/admin-send-otp",
        stage: currentStage,
        name: "ConfigurationError",
        message: "Firebase Admin SDK is not configured on the server (check FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY)",
        code: "AUTH_INIT_FAILED",
      });
      return res.status(500).json({
        success: false,
        error: "Server authentication error: Firebase Admin credentials are not configured.",
      });
    }

    // 1. Verify the Firebase ID token
    currentStage = "firebase_token_verification";
    console.log("[ADMIN_2FA] Firebase token verification started");
    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (tokenErr: any) {
      console.error("[ADMIN_2FA_ERROR]", {
        endpoint: "/api/auth/admin-send-otp",
        stage: currentStage,
        name: tokenErr?.name || "TokenVerificationError",
        message: tokenErr?.message || "Invalid or expired Firebase ID token",
        code: tokenErr?.code || "INVALID_ID_TOKEN",
      });
      return res.status(401).json({
        success: false,
        error: "Session expired or invalid. Please sign in again.",
      });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;
    console.log(`[ADMIN_2FA] Firebase token verification successful for user ${uid}`);

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Authenticated Firebase user does not have an email address.",
      });
    }

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
    currentStage = "otp_generation_and_storage";
    console.log("[ADMIN_2FA] OTP generation started");
    const otp = generateAdmin6DigitOTP();
    await saveAdminOTP(uid, email, otp);
    console.log("[ADMIN_2FA] OTP storage successful");

    // 4. Send OTP to the authenticated Firebase user's email ONLY
    currentStage = "smtp_send";
    console.log(`[ADMIN_2FA] SMTP send started for ${maskEmail(email)}`);
    const emailResult = await sendAdminOtpEmail(email, otp);
    if (!emailResult.success) {
      console.error("[ADMIN_2FA_ERROR]", {
        endpoint: "/api/auth/admin-send-otp",
        stage: currentStage,
        name: "SmtpError",
        message: emailResult.error || "Failed to send email via SMTP",
        code: "SMTP_SEND_FAILED",
      });
      return res.status(500).json({
        success: false,
        error: "Unable to send verification code. Please verify server SMTP configuration.",
      });
    }

    console.log("[ADMIN_2FA] SMTP send successful");

    return res.status(200).json({
      success: true,
      maskedEmail: maskEmail(email),
      message: "A 6-digit verification code has been sent to your email.",
    });
  } catch (err: any) {
    console.error("[ADMIN_2FA_ERROR]", {
      endpoint: "/api/auth/admin-send-otp",
      stage: currentStage,
      name: err?.name || "UnhandledError",
      message: err?.message || String(err),
      code: err?.code || "INTERNAL_SERVER_ERROR",
    });
    return res.status(500).json({
      success: false,
      error: "Unable to send verification code. Please try again.",
    });
  }
}
