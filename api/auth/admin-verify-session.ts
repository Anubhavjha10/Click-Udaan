import { getAdminAuth } from "../_lib/firebaseAdmin";
import { validateAdminSessionToken } from "../_lib/adminOtpStore";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ valid: false, error: "Method not allowed. Use POST." });
  }

  let currentStage = "request_validation";

  try {
    console.log("[ADMIN_2FA] request received: POST /api/auth/admin-verify-session");

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, error: "Missing authentication token." });
    }

    const idToken = authHeader.slice(7).trim();
    if (!idToken) {
      return res.status(401).json({ valid: false, error: "Empty authentication token." });
    }

    currentStage = "firebase_admin_init";
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      console.error("[ADMIN_2FA_ERROR]", {
        endpoint: "/api/auth/admin-verify-session",
        stage: currentStage,
        name: "ConfigurationError",
        message: "Firebase Admin SDK is not configured on the server",
        code: "AUTH_INIT_FAILED",
      });
      return res.status(500).json({ valid: false, error: "Server credentials unconfigured." });
    }

    currentStage = "firebase_token_verification";
    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (tokenErr: any) {
      console.error("[ADMIN_2FA_ERROR]", {
        endpoint: "/api/auth/admin-verify-session",
        stage: currentStage,
        name: tokenErr?.name || "TokenVerificationError",
        message: tokenErr?.message || "Invalid or expired Firebase ID token",
        code: tokenErr?.code || "INVALID_ID_TOKEN",
      });
      return res.status(401).json({ valid: false, error: "Invalid Firebase ID token." });
    }

    const uid = decodedToken.uid;

    currentStage = "body_parsing";
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const { sessionToken } = body || {};

    if (!sessionToken) {
      return res.status(401).json({ valid: false, error: "Missing session token." });
    }

    currentStage = "session_token_validation";
    const validation = validateAdminSessionToken(sessionToken, uid);
    if (!validation.valid) {
      return res.status(401).json({ valid: false, error: "Session token is invalid or expired." });
    }

    console.log(`[ADMIN_2FA] Session validated successfully for user ${uid}`);
    return res.status(200).json({ valid: true });
  } catch (err: any) {
    console.error("[ADMIN_2FA_ERROR]", {
      endpoint: "/api/auth/admin-verify-session",
      stage: currentStage,
      name: err?.name || "UnhandledError",
      message: err?.message || String(err),
      code: err?.code || "INTERNAL_SERVER_ERROR",
    });
    return res.status(500).json({ valid: false, error: "Internal validation error." });
  }
}
