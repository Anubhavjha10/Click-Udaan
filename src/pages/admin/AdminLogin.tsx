import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, RefreshCw, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated and authorized, redirect to /admin
  React.useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
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
            CU
          </div>
          <h1 className="admin-login-title">
            Click<span className="text-[#FBBF24]">उड़ान</span>
          </h1>
          <p className="admin-login-subtitle">
            Admin Portal • Grow Your Brand. Fly Higher
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">
              Admin Email
            </label>
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
            <label className="admin-label">
              Password
            </label>
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
              <span className="flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin" /> Verifying Credentials...
              </span>
            ) : (
              "Sign In to Admin"
            )}
          </button>
        </form>

        <div className="admin-security-badge">
          <Shield size={14} className="text-slate-400" />
          <span>Restricted Portal • Staff Only</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
