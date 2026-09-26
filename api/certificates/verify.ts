import { findCertificateByIdOrNumber } from "../_lib/db";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    let query = "";
    if (req.method === "GET") {
      if (req.query && (req.query.query || req.query.id || req.query.certificateId)) {
        query = req.query.query || req.query.id || req.query.certificateId;
      } else if (req.url) {
        try {
          const url = new URL(req.url, `http://${req.headers?.host || "localhost"}`);
          query = url.searchParams.get("query") || url.searchParams.get("id") || url.searchParams.get("certificateId") || "";
        } catch {
          query = "";
        }
      }
    } else {
      let body: any = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      query = body?.query || body?.id || body?.certificateId || body?.verificationNumber || "";
    }

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ error: "Certificate ID or Verification Number is required." });
    }

    const cert = await findCertificateByIdOrNumber(query.trim());

    if (!cert) {
      return res.status(404).json({
        found: false,
        error: "Certificate not found. Please check your verification number.",
      });
    }

    // Return only public safe fields (no private phone or unnecessary internal data)
    return res.status(200).json({
      found: true,
      certificate: {
        studentName: cert.studentName || cert.name,
        course: cert.course,
        duration: cert.duration,
        issueDate: cert.issueDate,
        issuedBy: cert.issuedBy || cert.organization || "ClickUdaan",
        certificateId: cert.certificateId || cert.id,
        verificationNumber: cert.verificationNumber || cert.id,
        internshipStatus: cert.internshipStatus || "Completed",
        certificateImageUrl: cert.certificateImageUrl || null,
        college: cert.college || null,
        coursepartner: cert.coursepartner || null,
      },
    });
  } catch (err: any) {
    console.error("[VERIFY_CERTIFICATE] Error checking certificate:", err.message || err);
    const isConfigError = err.message && err.message.includes("Firebase Admin credentials");
    return res.status(500).json({
      error: isConfigError
        ? "Server Firestore configuration error: Firebase Admin credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing or invalid."
        : "Internal error checking certificate.",
    });
  }
}
