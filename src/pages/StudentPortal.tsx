import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Award,
  FileText,
  Download,
  Eye,
  CheckCircle,
  Calendar,
  Clock,
  Briefcase,
  LogOut,
  Building,
  AlertTriangle,
  X,
} from "lucide-react";
import { downloadCertificatePDF, downloadOfferLetterPDF } from "../lib/pdfGenerator";
import { StudentCertificate } from "../types/database";

const StudentPortal: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [records, setRecords] = useState<StudentCertificate[]>([]);
  const [previewFile, setPreviewFile] = useState<{
    type: "image" | "pdf";
    url: string;
    title: string;
  } | null>(null);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [downloadingOfferId, setDownloadingOfferId] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("clickudaan_student_token");
    const email = sessionStorage.getItem("clickudaan_student_email");

    if (!token || !email) {
      navigate("/verify?tab=email&notice=unauthorized");
      return;
    }

    setStudentEmail(email);

    const fetchRecords = async () => {
      try {
        const res = await fetch("/api/student/records", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Session expired. Please verify your email again.");
        }

        const data = await res.json();
        setRecords(data.records || []);
      } catch (err: any) {
        setError(err.message || "Failed to load student records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("clickudaan_student_token");
    sessionStorage.removeItem("clickudaan_student_email");
    navigate("/verify");
  };

  const handleDownloadCert = async (rec: StudentCertificate) => {
    if (!rec.certificateImageUrl) return;
    setDownloadingCertId(rec.id);
    try {
      await downloadCertificatePDF(
        rec.certificateImageUrl,
        rec.studentName,
        rec.certificateId || rec.verificationNumber
      );
    } catch (err) {
      console.error("Certificate download error:", err);
      alert("Failed to generate PDF. Opening image directly.");
      window.open(rec.certificateImageUrl, "_blank");
    } finally {
      setDownloadingCertId(null);
    }
  };

  const handleDownloadOffer = async (rec: StudentCertificate) => {
    if (!rec.offerLetterUrl) return;
    setDownloadingOfferId(rec.id);
    try {
      await downloadOfferLetterPDF(rec.offerLetterUrl, rec.studentName);
    } catch (err) {
      console.error("Offer letter download error:", err);
      window.open(rec.offerLetterUrl, "_blank");
    } finally {
      setDownloadingOfferId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0e4da4] border-t-[#f4c21d] rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Accessing Student Portal...</h2>
          <p className="text-sm text-slate-500 mt-1">Verifying authenticated session credentials</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Session Notice</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <Link
            to="/verify"
            className="inline-block w-full py-3 px-4 bg-[#0e4da4] hover:bg-[#093c85] text-white font-semibold rounded-xl transition shadow-md"
          >
            Back to Verification
          </Link>
        </div>
      </div>
    );
  }

  const primaryStudentName = records.length > 0 ? records[0].studentName : "Student";

  return (
    <div className="min-h-screen bg-[#f7f8fc] pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e4da4] via-[#093c85] to-[#072d63] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-[#f4c21d] mb-3">
              <CheckCircle size={14} /> Verified Student Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, <span className="text-[#f4c21d]">{primaryStudentName}</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base mt-2 flex items-center gap-2">
              <span>{studentEmail}</span>
              <span className="w-1.5 h-1.5 bg-[#f4c21d] rounded-full inline-block" />
              <span>{records.length} {records.length === 1 ? "Program Enrolled" : "Programs Enrolled"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/verify"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition backdrop-blur-sm border border-white/15"
            >
              Verify Another
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-sm"
            >
              <LogOut size={16} /> Exit Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Program Records Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              There are currently no active or completed records registered under {studentEmail}.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {records.map((rec, index) => {
              const isCompleted = rec.internshipStatus === "Completed";
              const hasCertificate = Boolean(rec.certificateImageUrl);

              return (
                <div
                  key={rec.id || index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-3 py-1 bg-[#0e4da4]/10 text-[#0e4da4] text-xs font-bold rounded-full uppercase tracking-wider">
                          {rec.programType || "Internship"}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          Status: {rec.internshipStatus || "Active"}
                        </span>
                        {isCompleted && (
                          <span className="px-3 py-1 bg-[#f4c21d]/20 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mt-2">{rec.course}</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Certificate ID: <span className="font-mono font-semibold text-slate-700">{rec.certificateId || rec.verificationNumber}</span>
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-500">Issued By</div>
                      <div className="font-semibold text-slate-800 text-sm flex items-center md:justify-end gap-1.5 mt-0.5">
                        <Building size={14} className="text-[#0e4da4]" />
                        {rec.issuedBy || rec.organization || "ClickUdaan"}
                      </div>
                      {rec.coursepartner && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          Partner: {rec.coursepartner}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8">
                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                          <Clock size={14} className="text-[#0e4da4]" /> Duration
                        </div>
                        <div className="text-sm font-bold text-slate-800">{rec.duration || "N/A"}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                          <Calendar size={14} className="text-[#0e4da4]" /> Issue Date
                        </div>
                        <div className="text-sm font-bold text-slate-800">{rec.issueDate || "N/A"}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                          <Briefcase size={14} className="text-[#0e4da4]" /> Start Date
                        </div>
                        <div className="text-sm font-bold text-slate-800">{rec.startDate || "N/A"}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                          <Briefcase size={14} className="text-[#0e4da4]" /> End Date
                        </div>
                        <div className="text-sm font-bold text-slate-800">{rec.endDate || "N/A"}</div>
                      </div>
                    </div>

                    {/* Documents Showcase: Certificate & Offer Letter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Certificate Section */}
                      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl p-5 border border-blue-100/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <Award className="text-[#0e4da4]" size={18} /> Official Certificate
                            </span>
                            {hasCertificate && isCompleted ? (
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                                Ready
                              </span>
                            ) : (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                                Pending Completion
                              </span>
                            )}
                          </div>

                          {hasCertificate && isCompleted ? (
                            <div className="relative group rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-900 aspect-[16/10] max-h-48 flex items-center justify-center">
                              <img
                                src={rec.certificateImageUrl}
                                alt="Certificate Preview"
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    setPreviewFile({
                                      type: "image",
                                      url: rec.certificateImageUrl!,
                                      title: `Certificate - ${rec.studentName}`,
                                    })
                                  }
                                  className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                                >
                                  <Eye size={14} /> Full View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-400 text-xs mb-4">
                              Certificate will be issued once the internship/course requirements are fully completed.
                            </div>
                          )}
                        </div>

                        {hasCertificate && isCompleted && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() =>
                                setPreviewFile({
                                  type: "image",
                                  url: rec.certificateImageUrl!,
                                  title: `Certificate - ${rec.studentName}`,
                                })
                              }
                              className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              onClick={() => handleDownloadCert(rec)}
                              disabled={downloadingCertId === rec.id}
                              className="flex-1 py-2 px-3 bg-[#0e4da4] hover:bg-[#093c85] text-white font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              <Download size={14} />
                              {downloadingCertId === rec.id ? "Generating PDF..." : "Download PDF"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Offer Letter Section */}
                      <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl p-5 border border-amber-100/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <FileText className="text-amber-600" size={18} /> Official Offer Letter
                            </span>
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                              Available
                            </span>
                          </div>

                          <div className="rounded-lg border border-slate-200 p-6 bg-white flex flex-col items-center justify-center text-center mb-4">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-2">
                              <FileText size={24} />
                            </div>
                            <div className="text-xs font-bold text-slate-800">
                              {rec.offerLetterFileName || "Offer_Letter.pdf"}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Official ClickUdaan Verification Document
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() =>
                              setPreviewFile({
                                type: "pdf",
                                url: rec.offerLetterUrl,
                                title: `Offer Letter - ${rec.studentName}`,
                              })
                            }
                            className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <Eye size={14} /> View PDF
                          </button>
                          <button
                            onClick={() => handleDownloadOffer(rec)}
                            disabled={downloadingOfferId === rec.id}
                            className="flex-1 py-2 px-3 bg-[#f4c21d] hover:bg-[#e2b115] text-slate-950 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                          >
                            <Download size={14} />
                            {downloadingOfferId === rec.id ? "Downloading..." : "Download PDF"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Preview Modal for Image or PDF */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold truncate">{previewFile.title}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
              {previewFile.type === "image" ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
                />
              ) : (
                <iframe
                  src={previewFile.url}
                  title={previewFile.title}
                  className="w-full h-[75vh] rounded-lg border-0 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
