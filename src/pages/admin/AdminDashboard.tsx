import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Users,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
  ExternalLink,
  GraduationCap,
  Settings,
  FileText,
} from "lucide-react";
import { useCertificates } from "../../hooks/useCertificates";
import { useAdminTeam } from "../../hooks/useTeam";

const AdminDashboard: React.FC = () => {
  const { certificates, loading: certsLoading } = useCertificates();
  const { members, loading: teamLoading } = useAdminTeam();

  // Purely computed metrics from Firestore
  const totalStudents = certificates.length;
  const totalCertificatesIssued = certificates.filter((c) => Boolean(c.certificateImageUrl)).length;
  const completedInternships = certificates.filter(
    (c) => c.internshipStatus === "Completed"
  ).length;
  const activeInternships = certificates.filter(
    (c) => c.internshipStatus === "Active" || !c.internshipStatus
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ClickUdaan Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grow Your Brand. Fly Higher • Manage certificates, students, team, and settings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/certificates/new"
            className="btn-primary"
          >
            <Plus size={16} /> Add Certificate
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Students
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {certsLoading ? "-" : totalStudents}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Stored in Firestore</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0E4DA4] flex items-center justify-center">
            <GraduationCap size={22} />
          </div>
        </div>

        {/* Active Internships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Internships
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {certsLoading ? "-" : activeInternships}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">In progress</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        {/* Completed Internships */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {certsLoading ? "-" : completedInternships}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Finished programs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Certificates Issued */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Certificates Issued
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0E4DA4] mt-1">
              {certsLoading ? "-" : totalCertificatesIssued}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Uploaded & downloadable</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Certificates & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Certificates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recent Certificates &amp; Students
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest student records stored in Cloud Firestore
                </p>
              </div>
              <Link
                to="/admin/certificates"
                className="text-xs font-bold text-[#0E4DA4] hover:underline flex items-center gap-1"
              >
                View Table <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 pl-5">Student</th>
                    <th className="p-3.5">Program</th>
                    <th className="p-3.5">Certificate ID</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certsLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Loading records from Firestore...
                      </td>
                    </tr>
                  ) : certificates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center">
                        <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-xs font-bold text-slate-700">No certificates yet</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                          You haven&apos;t added any students or certificates to Firestore.
                        </p>
                        <Link
                          to="/admin/certificates/new"
                          className="btn-primary"
                          style={{ padding: "8px 16px", fontSize: "0.75rem" }}
                        >
                          <Plus size={14} /> Add First Certificate
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    certificates.slice(0, 5).map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-slate-900">{cert.studentName}</div>
                          <div className="text-slate-400 text-[11px]">{cert.email}</div>
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">
                          {cert.course}
                        </td>
                        <td className="p-3.5 font-mono text-[11px] font-semibold text-slate-700">
                          {cert.certificateId || cert.id}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              cert.internshipStatus === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {cert.internshipStatus || "Active"}
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <Link
                            to={`/admin/certificates/${cert.id}`}
                            className="font-bold text-[#0E4DA4] hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {certificates.length > 5 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                to="/admin/certificates"
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                View all {certificates.length} records →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column (1 span): Quick Actions & Website CMS */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Quick Actions
            </h2>

            <div className="space-y-2">
              <Link
                to="/admin/certificates/new"
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0E4DA4] hover:bg-slate-50/60 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0E4DA4] flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0E4DA4] transition">
                      Add Certificate
                    </h3>
                    <p className="text-[11px] text-slate-400">Upload offer letter and issue certificate</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#0E4DA4]" />
              </Link>

              <Link
                to="/admin/students"
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0E4DA4] hover:bg-slate-50/60 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0E4DA4] transition">
                      Manage Students
                    </h3>
                    <p className="text-[11px] text-slate-400">View enrolled students list</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#0E4DA4]" />
              </Link>

              <Link
                to="/admin/team"
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0E4DA4] hover:bg-slate-50/60 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0E4DA4] transition">
                      Our Team CMS
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {teamLoading ? "-" : members.length} active team members
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#0E4DA4]" />
              </Link>

              <Link
                to="/admin/settings"
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0E4DA4] hover:bg-slate-50/60 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0E4DA4] transition">
                      Global Settings
                    </h3>
                    <p className="text-[11px] text-slate-400">Update contact numbers and emails</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#0E4DA4]" />
              </Link>
            </div>
          </div>

          {/* Quick Link to Public Verify */}
          <div className="bg-[#0B132B] text-white p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Public Portal
            </span>
            <h3 className="text-xs font-bold text-white">Public Certificate Verification</h3>
            <p className="text-[11px] text-slate-400">
              Test the public verification page and student OTP verification flow.
            </p>
            <Link
              to="/verify"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F4C21D] hover:underline pt-1"
            >
              Open /verify <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
