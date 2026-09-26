import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { StudentCertificate } from "../types/database";

// Safe helper to extract milliseconds from Firestore Timestamp, Date, or string
function getSortTimestamp(cert: Partial<StudentCertificate>): number {
  const parseValue = (val: any): number => {
    if (!val) return 0;
    if (typeof val.toMillis === "function") return val.toMillis();
    if (typeof val.toDate === "function") return val.toDate().getTime();
    if (typeof val.seconds === "number") return val.seconds * 1000;
    if (val instanceof Date) return val.getTime();
    const parsed = Date.parse(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const created = parseValue(cert.createdAt);
  if (created > 0) return created;

  const updated = parseValue(cert.updatedAt);
  if (updated > 0) return updated;

  const issued = parseValue(cert.issueDate);
  if (issued > 0) return issued;

  return 0;
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<StudentCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates from Firestore "certificates" collection
  useEffect(() => {
    setLoading(true);
    setError(null);

    const certsRef = collection(db, "certificates");

    const unsubscribe = onSnapshot(
      certsRef,
      (snapshot) => {
        const list: StudentCertificate[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<StudentCertificate, "id">),
        }));

        // Sort descending by creation/update timestamp in memory
        // This guarantees no documents are excluded due to missing or pending createdAt fields
        list.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

        if (process.env.NODE_ENV !== "production") {
          console.log(
            `[CERTIFICATES_DEBUG] onSnapshot updated. Total count: ${snapshot.size}. Active: ${
              list.filter((c) => c.active !== false).length
            }. Doc IDs:`,
            list.map((c) => c.id)
          );
        }

        setCertificates(list);
        setLoading(false);
        setError(null);
      },
      (err: any) => {
        console.error("[CERTIFICATES_DEBUG] Error in certificates onSnapshot listener:", err);
        setError(err.message || "Failed to load certificates from database.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Manual refresh fallback
  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, "certificates"));
      const list: StudentCertificate[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<StudentCertificate, "id">),
      }));
      list.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));
      setCertificates(list);
    } catch (err: any) {
      console.error("[CERTIFICATES_DEBUG] Error fetching certificates from Firestore:", err);
      setError(err.message || "Failed to load certificates from database.");
    } finally {
      setLoading(false);
    }
  };

  const getCertificate = async (id: string): Promise<StudentCertificate | null> => {
    try {
      const docRef = doc(db, "certificates", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...(snap.data() as Omit<StudentCertificate, "id">) };
      }
      return null;
    } catch (err) {
      console.error("[CERTIFICATES_DEBUG] Error fetching single certificate:", err);
      return null;
    }
  };

  const saveCertificate = async (
    cert: Partial<StudentCertificate> & { id?: string; isEditing?: boolean }
  ): Promise<{ success: boolean; error?: string; id?: string }> => {
    try {
      // Validate mandatory fields
      if (!cert.studentName?.trim()) return { success: false, error: "Student Name is required." };
      if (!cert.email?.trim()) return { success: false, error: "Email is required." };
      if (!cert.course?.trim()) return { success: false, error: "Course/Program is required." };
      if (!cert.duration?.trim()) return { success: false, error: "Duration is required." };
      if (!cert.issueDate?.trim()) return { success: false, error: "Issue Date is required." };
      if (!cert.certificateId?.trim()) return { success: false, error: "Certificate ID is required." };
      if (!cert.verificationNumber?.trim()) return { success: false, error: "Verification Number is required." };

      // Mandatory Offer Letter PDF for every student record
      if (!cert.offerLetterUrl?.trim()) {
        return {
          success: false,
          error: "An Offer Letter PDF is strictly required for every student record.",
        };
      }

      // If marked as Completed, certificate image is required
      if (cert.internshipStatus === "Completed" && !cert.certificateImageUrl?.trim()) {
        return {
          success: false,
          error: "A Certificate Image is required when internship status is marked as Completed.",
        };
      }

      const id = (cert.id || cert.certificateId || "").trim() || `CU-${Date.now()}`;
      const docRef = doc(db, "certificates", id);

      // Check if document already exists to accurately manage createdAt
      const existingSnap = await getDoc(docRef);
      const isExisting = existingSnap.exists();

      const payload: any = {
        studentName: cert.studentName.trim(),
        email: cert.email.trim().toLowerCase(),
        phone: cert.phone?.trim() || "",
        course: cert.course.trim(),
        programType: cert.programType || "Internship",
        duration: cert.duration.trim(),
        startDate: cert.startDate || "",
        endDate: cert.endDate || "",
        issueDate: cert.issueDate.trim(),
        certificateId: cert.certificateId.trim(),
        verificationNumber: cert.verificationNumber.trim(),
        issuedBy: cert.issuedBy?.trim() || "ClickUdaan",
        internshipStatus: cert.internshipStatus || "Active",
        status: cert.internshipStatus || "Active", // For data contract consistency
        jobStatus: cert.jobStatus || "",
        certificateImageUrl: cert.certificateImageUrl || "",
        certificatePublicId: cert.certificatePublicId || "",
        offerLetterUrl: cert.offerLetterUrl.trim(),
        offerLetterPublicId: cert.offerLetterPublicId || "",
        offerLetterFileName: cert.offerLetterFileName || "Offer_Letter.pdf",
        offerLetterFileSize: cert.offerLetterFileSize || 0,
        active: cert.active ?? true,
        college: cert.college || "",
        coursepartner: cert.coursepartner || "",
        updatedAt: serverTimestamp(),
      };

      // Set createdAt if new certificate or if missing on existing document
      if (!isExisting || !existingSnap.data()?.createdAt) {
        payload.createdAt = serverTimestamp();
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(`[CERTIFICATES_DEBUG] Saving certificate "${id}":`, {
          isExisting,
          hasCreatedAt: Boolean(payload.createdAt),
          studentName: payload.studentName,
          certificateId: payload.certificateId,
          active: payload.active,
          internshipStatus: payload.internshipStatus,
        });
      }

      await setDoc(docRef, payload, { merge: true });
      return { success: true, id };
    } catch (err: any) {
      console.error("[CERTIFICATES_DEBUG] Error saving certificate to Firestore:", err);
      return { success: false, error: err.message || "Failed to save record" };
    }
  };

  const deleteCertificate = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await deleteDoc(doc(db, "certificates", id));
      return { success: true };
    } catch (err: any) {
      console.error("[CERTIFICATES_DEBUG] Error deleting certificate from Firestore:", err);
      return { success: false, error: err.message || "Failed to delete record" };
    }
  };

  return {
    certificates,
    loading,
    error,
    refresh: fetchCertificates,
    getCertificate,
    saveCertificate,
    deleteCertificate,
  };
}
