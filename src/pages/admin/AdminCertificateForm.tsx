import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Award,
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  Sparkles,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";
import { useCertificates } from "../../hooks/useCertificates";
import {
  validateOfferLetter,
  validateCertificateImage,
  uploadToCloudinary,
  formatFileSize,
} from "../../lib/cloudinary";
import { ProgramType, InternshipStatus } from "../../types/database";

const AdminCertificateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { getCertificate, saveCertificate } = useCertificates();

  // Student Information Fields
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");

  // Program Information Fields
  const [course, setCourse] = useState("");
  const [programType, setProgramType] = useState<ProgramType>("Internship");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("ClickUdaan");
  const [coursepartner, setCoursepartner] = useState("");
  const [internshipStatus, setInternshipStatus] = useState<InternshipStatus>("Active");

  // Certificate Identifiers
  const [certificateId, setCertificateId] = useState("");
  const [verificationNumber, setVerificationNumber] = useState("");

  // Cloudinary Certificate Image state
  const [certImageUrl, setCertImageUrl] = useState("");
  const [certPublicId, setCertPublicId] = useState("");
  const [certUploadProgress, setCertUploadProgress] = useState<number | null>(null);
  const [certUploading, setCertUploading] = useState(false);
  const [certFileError, setCertFileError] = useState<string | null>(null);

  // Cloudinary Offer Letter PDF state (MANDATORY < 1 MB)
  const [offerLetterUrl, setOfferLetterUrl] = useState("");
  const [offerLetterPublicId, setOfferLetterPublicId] = useState("");
  const [offerLetterFileName, setOfferLetterFileName] = useState("");
  const [offerLetterFileSize, setOfferLetterFileSize] = useState<number>(0);
  const [offerUploadProgress, setOfferUploadProgress] = useState<number | null>(null);
  const [offerUploading, setOfferUploading] = useState(false);
  const [offerFileError, setOfferFileError] = useState<string | null>(null);

  // General State
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && id) {
      const load = async () => {
        const cert = await getCertificate(id);
        if (cert) {
          setStudentName(cert.studentName || "");
          setEmail(cert.email || "");
          setPhone(cert.phone || "");
          setCollege(cert.college || "");

          setCourse(cert.course || "");
          setProgramType(cert.programType || "Internship");
          setDuration(cert.duration || "");
          setStartDate(cert.startDate || "");
          setEndDate(cert.endDate || "");
          setIssueDate(cert.issueDate || "");
          setIssuedBy(cert.issuedBy || "ClickUdaan");
          setCoursepartner(cert.coursepartner || "");
          setInternshipStatus(cert.internshipStatus || "Active");

          setCertificateId(cert.certificateId || "");
          setVerificationNumber(cert.verificationNumber || "");

          setCertImageUrl(cert.certificateImageUrl || "");
          setCertPublicId(cert.certificatePublicId || "");

          setOfferLetterUrl(cert.offerLetterUrl || "");
          setOfferLetterPublicId(cert.offerLetterPublicId || "");
          setOfferLetterFileName(cert.offerLetterFileName || "Offer_Letter.pdf");
          setOfferLetterFileSize(cert.offerLetterFileSize || 0);
        } else {
          setFormError("Certificate record not found in Firestore.");
        }
        setLoading(false);
      };
      load();
    } else {
      // Default auto-generated Certificate ID format
      handleAutoGenerateId();
      // Default issue date formatted
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      setIssueDate(now.toLocaleDateString("en-GB", options));
    }
  }, [id, isEditing]);

  const handleAutoGenerateId = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const generated = `CU-${year}-${rand}`;
    setCertificateId(generated);
    setVerificationNumber(generated);
  };

  // Certificate Image Upload
  const handleCertImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateCertificateImage(file);
    if (!validation.valid) {
      setCertFileError(validation.error || "Invalid image format.");
      return;
    }

    setCertUploading(true);
    setCertUploadProgress(0);

    try {
      const res = await uploadToCloudinary(file, "clickudaan/certificates", (percent) => {
        setCertUploadProgress(percent);
      });
      setCertImageUrl(res.secure_url);
      setCertPublicId(res.public_id);
    } catch (err: any) {
      console.error("Cloudinary certificate upload error:", err);
      setCertFileError(err.message || "Failed to upload certificate image.");
    } finally {
      setCertUploading(false);
    }
  };

  // Offer Letter PDF Upload (Strict <= 1 MB)
  const handleOfferLetterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfferFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateOfferLetter(file);
    if (!validation.valid) {
      setOfferFileError(validation.error || "Invalid Offer Letter PDF.");
      e.target.value = "";
      return;
    }

    setOfferUploading(true);
    setOfferUploadProgress(0);

    try {
      const res = await uploadToCloudinary(file, "clickudaan/offer-letters", (percent) => {
        setOfferUploadProgress(percent);
      });
      setOfferLetterUrl(res.secure_url);
      setOfferLetterPublicId(res.public_id);
      setOfferLetterFileName(file.name);
      setOfferLetterFileSize(file.size);
    } catch (err: any) {
      console.error("Cloudinary offer letter upload error:", err);
      setOfferFileError(err.message || "Failed to upload Offer Letter PDF.");
    } finally {
      setOfferUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessNotice(null);

    // Validate Required Fields
    if (!studentName.trim()) {
      setFormError("Student Name is required.");
      return;
    }
    if (!email.trim()) {
      setFormError("Student Email is required.");
      return;
    }
    if (!course.trim()) {
      setFormError("Course / Program Name is required.");
      return;
    }
    if (!duration.trim()) {
      setFormError("Duration is required.");
      return;
    }
    if (!issueDate.trim()) {
      setFormError("Issue Date is required.");
      return;
    }
    if (!certificateId.trim()) {
      setFormError("Certificate ID is required.");
      return;
    }
    if (!verificationNumber.trim()) {
      setFormError("Verification Number is required.");
      return;
    }

    // STRICT MANDATORY OFFER LETTER CHECK
    if (!offerLetterUrl.trim()) {
      setFormError("An Offer Letter PDF (< 1 MB) is strictly required for every student record.");
      return;
    }

    // MANDATORY CERTIFICATE IMAGE IF COMPLETED
    if (internshipStatus === "Completed" && !certImageUrl.trim()) {
      setFormError("A Certificate Image is required when internship status is marked as Completed.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveCertificate({
        id: id || certificateId.trim(),
        studentName: studentName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        course: course.trim(),
        programType,
        duration: duration.trim(),
        startDate,
        endDate,
        issueDate: issueDate.trim(),
        issuedBy: issuedBy.trim() || "ClickUdaan",
        coursepartner: coursepartner.trim(),
        internshipStatus,
        certificateId: certificateId.trim(),
        verificationNumber: verificationNumber.trim(),
        certificateImageUrl: certImageUrl,
        certificatePublicId: certPublicId,
        offerLetterUrl: offerLetterUrl.trim(),
        offerLetterPublicId: offerLetterPublicId,
        offerLetterFileName: offerLetterFileName || "Offer_Letter.pdf",
        offerLetterFileSize,
        active: true,
        isEditing,
      });

      if (res.success) {
        setSuccessNotice("Certificate record successfully saved to Firestore!");
        setTimeout(() => {
          navigate("/admin/certificates");
        }, 1200);
      } else {
        setFormError(res.error || "Failed to save record.");
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-[#0E4DA4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading certificate data from Firestore...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/certificates"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition"
            title="Back to list"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? "Edit Certificate Record" : "Add Student & Issue Certificate"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter student credentials, program details, upload mandatory Offer Letter PDF and Certificate image
            </p>
          </div>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2.5">
          <CheckCircle size={18} className="shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Student Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User size={18} className="text-[#0E4DA4]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Student Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Student Full Name"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@example.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Used for Student Portal email OTP verification
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / University (Optional)
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. University / College Name"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Program Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen size={18} className="text-[#0E4DA4]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Program &amp; Internship Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course / Program Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Full Stack Web Development"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Program Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value as ProgramType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              >
                <option value="Internship">Internship</option>
                <option value="Course">Course</option>
                <option value="Job">Job</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duration <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 Months / 4 Weeks"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issue Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. 15 March 2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issued By
              </label>
              <input
                type="text"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Partner / Organization (Optional)
              </label>
              <input
                type="text"
                value={coursepartner}
                onChange={(e) => setCoursepartner(e.target.value)}
                placeholder="e.g. Partner Organization"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>
          </div>

          {/* Internship Status Lifecycle */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Internship Lifecycle Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <label
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  internshipStatus === "Active"
                    ? "bg-amber-50/70 border-amber-400 text-amber-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="internshipStatus"
                  value="Active"
                  checked={internshipStatus === "Active"}
                  onChange={() => setInternshipStatus("Active")}
                  className="accent-amber-500"
                />
                <div>
                  <div className="text-xs">Active Internship</div>
                  <div className="text-[10px] text-slate-500 font-normal">Internship currently in progress</div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                  internshipStatus === "Completed"
                    ? "bg-emerald-50/70 border-emerald-400 text-emerald-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="internshipStatus"
                  value="Completed"
                  checked={internshipStatus === "Completed"}
                  onChange={() => setInternshipStatus("Completed")}
                  className="accent-emerald-600"
                />
                <div>
                  <div className="text-xs">Completed &amp; Certificate Issued</div>
                  <div className="text-[10px] text-slate-500 font-normal">Requires certificate image upload</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Certificate Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#0E4DA4]" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Certificate Identifiers
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAutoGenerateId}
              className="text-xs font-bold text-[#0E4DA4] hover:underline flex items-center gap-1"
            >
              <Sparkles size={14} /> Auto-Generate
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Certificate ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="e.g. CU-2026-001"
                className="w-full p-2.5 font-mono bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Verification Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={verificationNumber}
                onChange={(e) => setVerificationNumber(e.target.value)}
                placeholder="e.g. CU-2026-001"
                className="w-full p-2.5 font-mono bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Mandatory Offer Letter PDF (< 1 MB) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-amber-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-amber-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. Offer Letter PDF <span className="text-rose-600 font-extrabold">* (Strictly Mandatory)</span>
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              Max 1 MB • PDF Only
            </span>
          </div>

          <p className="text-xs text-slate-500">
            An official Offer Letter PDF is strictly mandatory for every student record before saving. Files above 1 MB are rejected.
          </p>

          {offerFileError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{offerFileError}</span>
            </div>
          )}

          {offerLetterUrl ? (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {offerLetterFileName || "Offer_Letter.pdf"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {offerLetterFileSize ? formatFileSize(offerLetterFileSize) : "Uploaded (< 1 MB)"} • Cloudinary Storage
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={offerLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                >
                  <Eye size={13} /> Preview
                </a>
                <label className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs">
                  <Upload size={13} /> Replace
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleOfferLetterChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-amber-300 rounded-xl p-8 text-center bg-amber-50/20 hover:bg-amber-50/40 transition">
              <FileText className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 mb-0.5">
                Upload Student Offer Letter PDF
              </div>
              <div className="text-[11px] text-slate-500 mb-4">
                Strict limit: 1 MB (1024 KB). Only PDF files accepted.
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition">
                <Upload size={15} /> Select Offer Letter PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleOfferLetterChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {offerUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Uploading Offer Letter to Cloudinary...</span>
                <span>{offerUploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 transition-all duration-200"
                  style={{ width: `${offerUploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Certificate Image (Cloudinary) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#0E4DA4]" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5. Certificate Image {internshipStatus === "Completed" && <span className="text-rose-500">*</span>}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">JPG, JPEG, PNG, WebP</span>
          </div>

          {certFileError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{certFileError}</span>
            </div>
          )}

          {certImageUrl ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[16/10] max-h-60 flex items-center justify-center">
                <img
                  src={certImageUrl}
                  alt="Certificate Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 truncate max-w-sm">
                  {certImageUrl}
                </span>
                <div className="flex gap-2">
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1">
                    <Upload size={13} /> Replace Image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleCertImageChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCertImageUrl("");
                      setCertPublicId("");
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Image"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 mb-0.5">
                Upload Certificate Image
              </div>
              <div className="text-[11px] text-slate-500 mb-4">
                Required when internship status is marked as &quot;Completed&quot;.
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E4DA4] hover:bg-[#093C85] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition">
                <Upload size={15} /> Select Certificate Image
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleCertImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {certUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Uploading Certificate Image to Cloudinary...</span>
                <span>{certUploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#0E4DA4] h-1.5 transition-all duration-200"
                  style={{ width: `${certUploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Link
            to="/admin/certificates"
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || offerUploading || certUploading}
            className="btn-primary"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={15} className="animate-spin" /> Saving to Firestore...
              </span>
            ) : isEditing ? (
              "Update Certificate"
            ) : (
              "Save & Issue Certificate"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCertificateForm;
