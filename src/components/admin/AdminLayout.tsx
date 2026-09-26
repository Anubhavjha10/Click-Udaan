import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Award,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isOtpVerified, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route check: requires authenticated user, active Firestore admin doc, and completed 2FA OTP
  useEffect(() => {
    if (!loading && (!user || !isAdmin || !isOtpVerified)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isOtpVerified, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#0E4DA4] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <h2 className="text-sm font-bold text-slate-800">Verifying Admin Privileges...</h2>
          <p className="text-xs text-slate-400 mt-0.5">Checking Firestore authorization and 2FA status</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin || !isOtpVerified) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Certificates", path: "/admin/certificates", icon: Award },
    { label: "Students", path: "/admin/students", icon: GraduationCap },
    { label: "Our Team", path: "/admin/team", icon: Users },
    { label: "Global Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // Derive page title from route
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/admin") return "Dashboard Overview";
    if (p === "/admin/certificates/new") return "Add New Certificate";
    if (p.startsWith("/admin/certificates/") && p !== "/admin/certificates") return "Edit Certificate";
    if (p.startsWith("/admin/certificates")) return "Certificates Management";
    if (p.startsWith("/admin/students")) return "Student Directory";
    if (p.startsWith("/admin/team")) return "Our Team CMS";
    if (p.startsWith("/admin/settings")) return "Global Website Settings";
    return "Admin CMS";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row antialiased text-slate-900">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#0B132B] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0E4DA4] flex items-center justify-center font-black text-[#F4C21D] text-xs">
            CU
          </div>
          <span className="font-extrabold text-sm tracking-tight">
            Click<span className="text-[#F4C21D]">उड़ान</span> CMS
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg transition"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sticky Left Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B132B] text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen flex flex-col justify-between border-r border-slate-800 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E4DA4] flex items-center justify-center font-black text-[#F4C21D] text-sm shadow-sm">
                CU
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight leading-none block">
                  Click<span className="text-[#F4C21D]">उड़ान</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mt-0.5">
                  CMS Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExact = location.pathname === item.path;
              const isChild =
                item.path !== "/admin" && location.pathname.startsWith(item.path);
              const isActive = isExact || isChild;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#FBBF24] text-[#172554] shadow-sm font-bold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-[#172554]" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-[#172554]/70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer: User Details & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#080E20]">
          <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-0.5">
              <ShieldCheck size={12} className="text-emerald-400" /> Authorized Admin
            </div>
            <div className="text-xs font-medium text-slate-200 truncate" title={user.email || ""}>
              {user.email}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <span>Live Website</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-lg transition"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Link to="/admin" className="hover:text-slate-700">Admin</Link>
              <span>/</span>
              <span className="text-slate-600 font-semibold">{getPageTitle()}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
            </span>
          </div>
        </header>

        {/* Dynamic Outlet Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}
    </div>
  );
};
