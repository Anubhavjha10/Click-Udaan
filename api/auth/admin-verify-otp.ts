import { getAdminAuth } from "../_lib/firebaseAdmin";
import { verifyAdminOTP, createAdminSessionToken } from "../_lib/adminOtpStore";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  let currentStage = "request_validation";

  try {
    console.log("[ADMIN_2FA] request received: POST /api/auth/admin-verify-otp");

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
        endpoint: "/api/auth/admin-verify-otp",
        stage: currentStage,
        name: "ConfigurationError",
        message: "Firebase Admin SDK is not configured on the server",
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
        endpoint: "/api/auth/admin-verify-otp",
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

    // 2. Parse and validate OTP from request body
    currentStage = "body_parsing";
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { otp } = body || {};

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return res.status(400).json({ success: false, error: "Please enter a valid 6-digit OTP code." });
    }

    // 3. Verify OTP against server store
    currentStage = "otp_verification";
    console.log("[ADMIN_2FA] OTP verification started");
    const result = await verifyAdminOTP(uid, otp.trim());
    if (!result.success) {
      console.warn(`[ADMIN_2FA] OTP verification failed for user ${uid}: ${result.error}`);
      return res.status(400).json({
        success: false,
        error: result.error || "Invalid OTP.",
      });
    }

    // 4. Generate secure HMAC-signed admin session token
    currentStage = "session_token_generation";
    const sessionToken = createAdminSessionToken(uid, email || "");

    console.log(`[ADMIN_2FA] Admin 2FA verified successfully for user ${uid}`);

    return res.status(200).json({
      success: true,
      sessionToken,
      message: "Admin authentication successful. Access granted.",
    });
  } catch (err: any) {
    console.error("[ADMIN_2FA_ERROR]", {
      endpoint: "/api/auth/admin-verify-otp",
      stage: currentStage,
      name: err?.name || "UnhandledError",
      message: err?.message || String(err),
      code: err?.code || "INTERNAL_SERVER_ERROR",
    });
    return res.status(500).json({ success: false, error: "Internal server error while verifying OTP." });
  }
}
