export type ProgramType = "Internship" | "Course" | "Job" | "Other";
export type InternshipStatus = "Active" | "Completed" | "Pending";
export type CertificateStatus = "Issued" | "Pending" | "Not Issued";

export interface StudentCertificate {
  id: string; // Firestore document ID
  studentName: string;
  email: string;
  phone?: string;
  course: string;
  programType: ProgramType;
  duration: string;
  startDate?: string;
  endDate?: string;
  issueDate: string;
  certificateId: string;
  verificationNumber: string;
  issuedBy: string;
  internshipStatus: InternshipStatus;
  status?: string;
  jobStatus?: string;
  certificateImageUrl?: string;
  certificatePublicId?: string;
  offerLetterUrl: string;
  offerLetterPublicId?: string;
  offerLetterFileName?: string;
  offerLetterFileSize?: number;
  active: boolean;
  createdAt: any;
  updatedAt: any;
  college?: string;
  coursepartner?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string; // Role
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface GlobalSettings {
  phone: string;
  whatsapp: string;
  email: string;
  secondaryEmail?: string;
  address: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  tagline?: string;
  updatedAt?: any;
}

export interface AdminUser {
  uid: string;
  email: string;
  active: boolean;
  createdAt?: any;
}
