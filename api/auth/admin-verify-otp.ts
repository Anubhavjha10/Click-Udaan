import { getAdminAuth, getAdminFirestore } from "../_lib/firebaseAdmin";
import { verifyAdminOTP, createAdminSessionToken } from "../_lib/adminOtpStore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Missing authentication token." });
    }

    const idToken = authHeader.slice(7).trim();
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized. Token is empty." });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminFirestore();

    if (!adminAuth || !adminDb) {
      console.error("[ADMIN_AUTH] Firebase Admin SDK is not properly initialized on the server.");
      return res.status(500).json({
        error: "Server authentication error: Firebase Admin credentials are not configured.",
      });
    }

    // 1. Verify the Firebase ID token
    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (tokenErr: any) {
      console.error("[ADMIN_AUTH] ID token verification failed:", tokenErr.message || tokenErr);
      return res.status(401).json({
        error: "Session expired or invalid. Please sign in again.",
      });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // 2. Verify admins/{uid} document exists and active == true
    const adminDoc = await adminDb.collection("admins").doc(uid).get();
    if (!adminDoc.exists || adminDoc.data()?.active !== true) {
      return res.status(403).json({
        error: "Your account is not authorized to access the admin panel.",
      });
    }

    // 3. Parse and validate OTP from request body
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
      return res.status(400).json({ error: "Please enter a valid 6-digit OTP code." });
    }

    // 4. Verify OTP against server store
    const result = await verifyAdminOTP(uid, otp.trim());
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || "Invalid OTP.",
      });
    }

    // 5. Generate secure HMAC-signed admin session token
    const sessionToken = createAdminSessionToken(uid, email || adminDoc.data()?.email || "");

    console.log(`[ADMIN_AUTH] Admin 2FA verified successfully for UID ${uid}`);

    return res.status(200).json({
      success: true,
      sessionToken,
      message: "Admin authentication successful. Access granted.",
    });
  } catch (err: any) {
    console.error("[ADMIN_AUTH] admin-verify-otp error:", err.message || err);
    return res.status(500).json({ error: "Internal server error while verifying OTP." });
  }
}
