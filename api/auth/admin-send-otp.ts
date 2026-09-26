import { getAdminAuth, getAdminFirestore } from "../_lib/firebaseAdmin";
import {
  canSendAdminOTP,
  generateAdmin6DigitOTP,
  saveAdminOTP,
  maskEmail,
} from "../_lib/adminOtpStore";
import { sendAdminOtpEmail } from "../_lib/mailer";

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

    if (!email) {
      return res.status(400).json({
        error: "Authenticated Firebase user does not have an email address.",
      });
    }

    // 2. Verify admins/{uid} document exists and active == true
    const adminDoc = await adminDb.collection("admins").doc(uid).get();
    if (!adminDoc.exists || adminDoc.data()?.active !== true) {
      console.warn(`[ADMIN_AUTH] Unauthorized access attempt: UID ${uid} is not an active admin.`);
      return res.status(403).json({
        error: "Your account is not authorized to access the admin panel.",
      });
    }

    // 3. Check rate limit / resend cooldown (60 seconds)
    const rateCheck = await canSendAdminOTP(uid);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Please wait ${rateCheck.remainingSeconds} seconds before requesting a new OTP.`,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // 4. Generate cryptographically secure 6-digit OTP and store hashed
    const otp = generateAdmin6DigitOTP();
    await saveAdminOTP(uid, email, otp);

    // 5. Send OTP to the authenticated user's email ONLY
    const emailResult = await sendAdminOtpEmail(email, otp);
    if (!emailResult.success) {
      console.error("[ADMIN_AUTH] Failed to send admin OTP email:", emailResult.error);
      return res.status(500).json({
        error: "Unable to send verification code. Please try again.",
      });
    }

    console.log(`[ADMIN_AUTH] Sent admin OTP to ${maskEmail(email)} for UID ${uid}`);

    return res.status(200).json({
      success: true,
      maskedEmail: maskEmail(email),
      message: "A 6-digit verification code has been sent to your email.",
    });
  } catch (err: any) {
    console.error("[ADMIN_AUTH] admin-send-otp unexpected error:", err.message || err);
    return res.status(500).json({
      error: "Unable to send verification code. Please try again.",
    });
  }
}
