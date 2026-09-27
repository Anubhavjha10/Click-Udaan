import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Award,
  Mail,
  ShieldCheck,
  Search,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Building,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { downloadCertificatePDF } from "./lib/pdfGenerator";

interface PublicCertificate {
  studentName: string;
  name?: string;
  course: string;
  duration: string;
  issueDate: string;
  issuedBy: string;
  organization?: string;
  certificateId: string;
  id?: string;
  verificationNumber: string;
  internshipStatus?: string;
  certificateImageUrl?: string;
  college?: string;
  coursepartner?: string;
}

const CertificateVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Tab: 'number' | 'email'
  const initialTab = searchParams.get("tab") === "email" ? "email" : "number";
  const [activeTab, setActiveTab] = useState<"number" | "email">(initialTab);

  // Certificate ID verification states
  const [certInput, setCertInput] = useState<string>(searchParams.get("id") || searchParams.get("query") || "");
  const [certResult, setCertResult] = useState<PublicCertificate | null>(null);
  const [certError, setCertError] = useState<string>("");
  const [certLoading, setCertLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Email OTP verification states
  const [emailInput, setEmailInput] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Auto-search if ?id= is present in URL
  useEffect(() => {
    const idFromQuery = searchParams.get("id") || searchParams.get("query");
    if (idFromQuery) {
      setCertInput(idFromQuery);
      performCertSearch(idFromQuery);
    }
  }, [searchParams]);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const performCertSearch = async (val: string) => {
    const term = val.trim();
    if (!term) return;
    setCertLoading(true);
    setCertError("");
    setCertResult(null);

    try {
      const res = await fetch(`/api/certificates/verify?query=${encodeURIComponent(term)}`);
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Server error (${res.status}). Please try again later.` };
      }

      if (res.ok && data.found && data.certificate) {
        setCertResult(data.certificate);
      } else {
        setCertError(data.error || "Certificate not found. Please check your verification number.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setCertError("Unable to verify at this time. Please check your internet connection.");
    } finally {
      setCertLoading(false);
    }
  };

  const handleCertSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performCertSearch(certInput);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setOtpLoading(true);
    setEmailError("");
    setEmailMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Server error (${res.status}). Please try again later.` };
      }

      if (res.ok && data.success !== false) {
        setOtpSent(true);
        setEmailMessage(data.message || "If an eligible account exists for this email, an OTP has been sent.");
        setCountdown(60); // 60 seconds cooldown
      } else {
        setEmailError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setEmailError("Connection error while requesting OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;

    setOtpLoading(true);
    setEmailError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim(),
          otp: otpInput.trim(),
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Server error (${res.status}). Please try again later.` };
      }

      if (res.ok && data.token) {
        // Store verified credentials in session storage
        sessionStorage.setItem("clickudaan_student_token", data.token);
        sessionStorage.setItem("clickudaan_student_email", data.email || emailInput.trim().toLowerCase());
        navigate("/student");
      } else {
        setEmailError(data.error || "Invalid OTP. Please check the code and try again.");
      }
    } catch (err) {
      setEmailError("Connection error while verifying OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certResult) return;
    const certImage = certResult.certificateImageUrl;
    if (!certImage) {
      alert("Certificate image is currently being processed.");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadCertificatePDF(
        certImage,
        certResult.studentName || certResult.name || "Student",
        certResult.certificateId || certResult.verificationNumber || "CU-CERT"
      );
    } catch (err) {
      console.error("PDF download error:", err);
      window.open(certImage, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        {/* Header Icon & Title */}
        <div className="verify-brand-icon">
          <Award size={32} />
        </div>

        <h1 className="verify-title">
          Certificate Verification
        </h1>
        <p className="verify-subtitle">
          Authenticate official credentials issued by ClickUdaan or access your personalized Student Portal.
        </p>

        {/* Tabs: Certificate Number vs Email OTP (Segmented Control) */}
        <div className="verify-segmented-tabs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("number");
              setCertError("");
            }}
            className={`verify-tab-button ${activeTab === "number" ? "active" : ""}`}
          >
            <ShieldCheck size={16} /> By Certificate ID
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("email");
              setEmailError("");
            }}
            className={`verify-tab-button ${activeTab === "email" ? "active" : ""}`}
          >
            <Mail size={16} /> Using Email OTP
          </button>
        </div>

        {/* TAB 1: Certificate ID Search */}
        {activeTab === "number" && (
          <div>
            <form onSubmit={handleCertSearch} className="verify-search-form">
              <input
                type="text"
                placeholder="Enter Certificate ID or Verification No (e.g. CU-2026-001)"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="verify-search-input"
                autoComplete="off"
                required
              />
              <button type="submit" disabled={certLoading} className="verify-submit-button">
                {certLoading ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw size={14} className="animate-spin" /> Verifying
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Search size={15} /> Verify Credential
                  </span>
                )}
              </button>
            </form>

            {certError && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2 text-left">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span className="font-medium">{certError}</span>
              </div>
            )}

            {/* Verified Result Card */}
            {certResult && (
              <div className="verify-result-card">
                <div className="verify-result-header">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle size={18} />
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-emerald-800 m-0">
                        Certificate Verified
                      </h2>
                      <p className="text-[11px] text-slate-500 m-0">Official Authenticated Credential</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                    {certResult.internshipStatus || "Valid"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Student Name</span>
                    <span className="verify-detail-value">{certResult.studentName || certResult.name}</span>
                  </div>
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Course / Program</span>
                    <span className="verify-detail-value">{certResult.course}</span>
                  </div>
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Duration</span>
                    <span className="verify-detail-value">{certResult.duration}</span>
                  </div>
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Issue Date</span>
                    <span className="verify-detail-value">{certResult.issueDate}</span>
                  </div>
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Issued By</span>
                    <span className="verify-detail-value">{certResult.issuedBy || certResult.organization || "ClickUdaan"}</span>
                  </div>
                  <div className="verify-detail-row">
                    <span className="verify-detail-label">Certificate ID</span>
                    <span className="font-mono font-bold text-[#172554]">
                      {certResult.certificateId || certResult.verificationNumber || certResult.id}
                    </span>
                  </div>
                </div>

                {/* Certificate Preview Image if available */}
                {certResult.certificateImageUrl && (
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <div className="verify-cert-image-container relative group">
                      <img
                        src={certResult.certificateImageUrl}
                        alt="Verified Certificate"
                      />
                      <a
                        href={certResult.certificateImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5"
                      >
                        <Eye size={16} /> View Original Full Image
                      </a>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="verify-submit-button w-full"
                        style={{ width: "100%", padding: "12px 20px" }}
                      >
                        <Download size={16} />
                        {isDownloading ? "Generating PDF..." : "Download Official Certificate PDF"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Email OTP Login to Student Portal */}
        {activeTab === "email" && (
          <div className="max-w-md mx-auto">
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="text-left">
                  <label className="admin-label">
                    Registered Student Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your registered email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="admin-input"
                    style={{ padding: "12px 14px", fontSize: "0.875rem" }}
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    An OTP will be dispatched from <strong className="text-slate-700">clickudaan@gmail.com</strong> to verify your portal access.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="verify-submit-button w-full"
                  style={{ width: "100%", padding: "12px 20px" }}
                >
                  {otpLoading ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw size={16} className="animate-spin" /> Sending OTP...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Send Verification OTP <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs text-left font-medium">
                  {emailMessage}
                </div>

                <div className="text-left">
                  <label className="admin-label">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    className="verify-otp-input"
                    autoFocus
                    required
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Valid for 10 minutes</span>
                    {countdown > 0 ? (
                      <span className="text-slate-400">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-[#172554] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpInput("");
                      setEmailError("");
                    }}
                    className="btn-secondary"
                    style={{ padding: "12px 16px" }}
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={otpLoading || otpInput.length < 6}
                    className="verify-submit-button"
                    style={{ flex: 1, padding: "12px 20px" }}
                  >
                    {otpLoading ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw size={16} className="animate-spin" /> Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Verify & Open Portal <ArrowRight size={16} />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {emailError && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2 text-left font-medium">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span>{emailError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;
