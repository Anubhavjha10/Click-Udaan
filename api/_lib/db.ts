import { getAdminFirestore } from "./firebaseAdmin";

export interface StudentCertificateRecord {
  id: string;
  studentName: string;
  email: string;
  phone?: string;
  course: string;
  programType?: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  issueDate: string;
  issuedBy?: string;
  organization?: string;
  certificateId: string;
  verificationNumber: string;
  internshipStatus?: string;
  certificateImageUrl?: string;
  offerLetterUrl?: string;
  college?: string;
  coursepartner?: string;
  active?: boolean;
}

/**
 * Query student records by verified email from Firestore.
 * Firestore is the ONLY source of truth. Zero hardcoded fallbacks.
 */
export async function findStudentRecordsByEmail(
  email: string
): Promise<StudentCertificateRecord[]> {
  const normalized = email.trim().toLowerCase();
  const db = getAdminFirestore();

  if (!db) {
    throw new Error(
      "Server Firestore configuration error: Firebase Admin credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are required on the server."
    );
  }

  try {
    const snapshot = await db
      .collection("certificates")
      .where("email", "==", normalized)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const records: StudentCertificateRecord[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.active !== false) {
        records.push({
          id: doc.id,
          studentName: data.studentName || data.name || "",
          email: data.email || "",
          phone: data.phone,
          course: data.course || "",
          programType: data.programType || "Internship",
          duration: data.duration || "",
          startDate: data.startDate,
          endDate: data.endDate,
          issueDate: data.issueDate || "",
          issuedBy: data.issuedBy || data.organization || "ClickUdaan",
          certificateId: data.certificateId || doc.id,
          verificationNumber: data.verificationNumber || data.certificateId || doc.id,
          internshipStatus: data.internshipStatus || "Active",
          certificateImageUrl: data.certificateImageUrl,
          offerLetterUrl: data.offerLetterUrl,
          college: data.college,
          coursepartner: data.coursepartner,
          active: data.active,
        });
      }
    });

    return records;
  } catch (err: any) {
    console.error("Firestore Admin query error in findStudentRecordsByEmail:", err);
    throw new Error(err.message || "Failed to query student records from Firestore.");
  }
}

/**
 * Verify a certificate by Certificate ID or Verification Number.
 * Firestore is the ONLY source of truth. Zero hardcoded fallbacks.
 */
export async function findCertificateByIdOrNumber(
  query: string
): Promise<StudentCertificateRecord | null> {
  const q = query.trim();
  const db = getAdminFirestore();

  if (!db) {
    throw new Error(
      "Server Firestore configuration error: Firebase Admin credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are required on the server."
    );
  }

  try {
    // 1. Try direct document get by ID
    const docRef = db.collection("certificates").doc(q);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      if (data && data.active !== false) {
        return {
          id: docSnap.id,
          studentName: data.studentName || data.name || "",
          email: data.email || "",
          course: data.course || "",
          duration: data.duration || "",
          issueDate: data.issueDate || "",
          issuedBy: data.issuedBy || data.organization || "ClickUdaan",
          certificateId: data.certificateId || docSnap.id,
          verificationNumber: data.verificationNumber || data.certificateId || docSnap.id,
          internshipStatus: data.internshipStatus || "Completed",
          certificateImageUrl: data.certificateImageUrl,
          college: data.college,
          coursepartner: data.coursepartner,
          active: data.active,
        };
      }
    }

    // 2. Query by certificateId
    const byCertId = await db
      .collection("certificates")
      .where("certificateId", "==", q)
      .limit(1)
      .get();

    if (!byCertId.empty) {
      const doc = byCertId.docs[0];
      const data = doc.data();
      if (data && data.active !== false) {
        return {
          id: doc.id,
          studentName: data.studentName || data.name || "",
          email: data.email || "",
          course: data.course || "",
          duration: data.duration || "",
          issueDate: data.issueDate || "",
          issuedBy: data.issuedBy || data.organization || "ClickUdaan",
          certificateId: data.certificateId || doc.id,
          verificationNumber: data.verificationNumber || data.certificateId || doc.id,
          internshipStatus: data.internshipStatus || "Completed",
          certificateImageUrl: data.certificateImageUrl,
          college: data.college,
          coursepartner: data.coursepartner,
          active: data.active,
        };
      }
    }

    // 3. Query by verificationNumber
    const byVerifNo = await db
      .collection("certificates")
      .where("verificationNumber", "==", q)
      .limit(1)
      .get();

    if (!byVerifNo.empty) {
      const doc = byVerifNo.docs[0];
      const data = doc.data();
      if (data && data.active !== false) {
        return {
          id: doc.id,
          studentName: data.studentName || data.name || "",
          email: data.email || "",
          course: data.course || "",
          duration: data.duration || "",
          issueDate: data.issueDate || "",
          issuedBy: data.issuedBy || data.organization || "ClickUdaan",
          certificateId: data.certificateId || doc.id,
          verificationNumber: data.verificationNumber || data.certificateId || doc.id,
          internshipStatus: data.internshipStatus || "Completed",
          certificateImageUrl: data.certificateImageUrl,
          college: data.college,
          coursepartner: data.coursepartner,
          active: data.active,
        };
      }
    }

    // Not found in Firestore
    return null;
  } catch (err: any) {
    console.error("Firestore Admin query error in findCertificateByIdOrNumber:", err);
    throw new Error(err.message || "Failed to query certificate from Firestore.");
  }
}
