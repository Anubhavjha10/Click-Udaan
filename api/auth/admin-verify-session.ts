import { getAdminAuth, getAdminFirestore } from "../_lib/firebaseAdmin";
import { validateAdminSessionToken } from "../_lib/adminOtpStore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, error: "Missing authentication token." });
    }

    const idToken = authHeader.slice(7).trim();
    if (!idToken) {
      return res.status(401).json({ valid: false, error: "Empty authentication token." });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminFirestore();

    if (!adminAuth || !adminDb) {
      return res.status(500).json({ valid: false, error: "Server credentials unconfigured." });
    }

    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return res.status(401).json({ valid: false, error: "Invalid Firebase ID token." });
    }

    const uid = decodedToken.uid;

    const adminDoc = await adminDb.collection("admins").doc(uid).get();
    if (!adminDoc.exists || adminDoc.data()?.active !== true) {
      return res.status(403).json({ valid: false, error: "Not an authorized admin." });
    }

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

    const validation = validateAdminSessionToken(sessionToken, uid);
    if (!validation.valid) {
      return res.status(401).json({ valid: false, error: "Session token is invalid or expired." });
    }

    return res.status(200).json({ valid: true });
  } catch (err: any) {
    console.error("[ADMIN_AUTH] admin-verify-session error:", err.message || err);
    return res.status(500).json({ valid: false, error: "Internal validation error." });
  }
}
