import { validateSessionToken } from "../_lib/otpStore";
import { findStudentRecordsByEmail } from "../_lib/db";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid authentication token." });
    }

    const token = authHeader.split(" ")[1];
    const session = validateSessionToken(token);

    if (!session.valid || !session.email) {
      return res.status(401).json({ error: "Session expired or invalid. Please verify your email again." });
    }

    // Fetch records for this student's email only
    const records = await findStudentRecordsByEmail(session.email);

    return res.status(200).json({
      success: true,
      email: session.email,
      records: records || [],
    });
  } catch (err: any) {
    console.error("[STUDENT_RECORDS] error:", err.message || err);
    const isConfigError = err.message && err.message.includes("Firebase Admin credentials");
    return res.status(500).json({
      error: isConfigError
        ? "Server Firestore configuration error: Firebase Admin credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing or invalid."
        : "Failed to fetch student records.",
    });
  }
}
