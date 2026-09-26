import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Shield,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    isOtpVerified,
    maskedEmail: contextMaskedEmail,
    login,
    sendAdminOtp,
    verifyAdminOtp,
    logout,
  } = useAuth();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [localMaskedEmail, setLocalMaskedEmail] = useState<string>("");

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // If already authenticated and verified, redirect to /admin
  useEffect(() => {
    if (user && isAdmin && isOtpVerified) {
      navigate("/admin");
    } else if (user && isAdmin && !isOtpVerified) {
      setStep("otp");
    }
  }, [user, isAdmin, isOtpVerified, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.requiresOtp) {
        setStep("otp");
        if (result.maskedEmail) {
          setLocalMaskedEmail(result.maskedEmail);
        }
        setCooldown(60);
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      let msg = err.message || "Invalid email or password.";
      if (err.code === "auth/user-not-found") {
        msg = "No user found with this email in Firebase Authentication.";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "Invalid password. Please check your credentials.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Access temporarily disabled due to multiple failed attempts. Try again later.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyAdminOtp(otp.trim());
      if (res.success) {
        setSuccessNotice("Verification successful! Accessing Admin CMS...");
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        setError(res.error || "Invalid verification code.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      const res = await sendAdminOtp();
      if (res.success) {
        setSuccessNotice("A new 6-digit OTP code has been sent to your email.");
        setCooldown(60);
        if (res.maskedEmail) {
          setLocalMaskedEmail(res.maskedEmail);
        }
      } else {
        if (res.remainingSeconds) {
          setCooldown(res.remainingSeconds);
        }
        setError(res.error || "Unable to send verification code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    setError(null);
    setSuccessNotice(null);
    setOtp("");
    setStep("credentials");
    await logout();
  };

  const displayMasked = localMaskedEmail || contextMaskedEmail || "your registered admin email";

  return (
    <div className="admin-login-page">
      {/* Background Accent Grid */}
      <div className="admin-login-backdrop" />

      {/* Return to website */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs relative z-10 px-1">
        <Link
          to="/"
          className="text-slate-400 hover:text-white transition flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft size={14} /> Back to Live Site
        </Link>
        <span className="text-slate-400 font-mono text-[11px]">ClickUdaan CMS</span>
      </div>

      {/* Login Card */}
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-brand-icon">
            {step === "otp" ? <KeyRound size={22} className="text-[#FBBF24]" /> : "CU"}
          </div>
          <h1 className="admin-login-title">
            Click<span className="text-[#FBBF24]">उड़ान</span>
          </h1>
          <p className="admin-login-subtitle">
            {step === "otp"
              ? "Two-Factor Verification Required"
              : "Admin Portal • Grow Your Brand. Fly Higher"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{successNotice}</span>
          </div>
        )}

        {step === "credentials" ? (
          /* STEP 1: Email + Password */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="admin-label">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clickudaan.com"
                  className="admin-input"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="admin-input"
                  style={{ paddingLeft: "38px", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ width: "100%", marginTop: "12px", padding: "12px 20px" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" /> Verifying Credentials...
                </span>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Email OTP Verification */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center pb-2">
              <h2 className="text-sm font-bold text-slate-800">Verify your email</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit OTP sent to{" "}
                <span className="font-semibold text-slate-700">{displayMasked}</span>
              </p>
            </div>

            <div>
              <label className="admin-label text-center block">6-Digit Verification Code</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="admin-input text-center text-xl font-mono tracking-widest font-bold"
                  style={{ letterSpacing: "8px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.trim().length !== 6}
              className="btn-primary w-full"
              style={{ width: "100%", marginTop: "8px", padding: "12px 20px" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin" /> Verifying Code...
                </span>
              ) : (
                "Verify OTP & Enter CMS"
              )}
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-slate-500 hover:text-slate-800 transition font-medium"
              >
                ← Back to Password
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className={`font-semibold transition ${
                  cooldown > 0
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-[#0E4DA4] hover:underline cursor-pointer"
                }`}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="admin-security-badge">
          <Shield size={14} className="text-slate-400" />
          <span>Restricted Portal • Staff Only</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
