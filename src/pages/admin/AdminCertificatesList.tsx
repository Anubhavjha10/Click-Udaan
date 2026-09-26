import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Download,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";
import { useCertificates } from "../../hooks/useCertificates";
import { StudentCertificate } from "../../types/database";
import { downloadCertificatePDF, downloadOfferLetterPDF } from "../../lib/pdfGenerator";

const AdminCertificatesList: React.FC = () => {
  const { certificates, loading, error, deleteCertificate, refresh } = useCertificates();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<StudentCertificate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    type: "image" | "pdf";
    url: string;
    title: string;
  } | null>(null);

  // Filtered records strictly derived from Firestore
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        c.studentName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.certificateId?.toLowerCase().includes(term) ||
        c.verificationNumber?.toLowerCase().includes(term) ||
        c.course?.toLowerCase().includes(term);

      if (!matchSearch) return false;

      if (statusFilter === "all") return true;
      if (statusFilter === "active")
        return c.internshipStatus === "Active" || c.status === "Active" || !c.internshipStatus;
      if (statusFilter === "completed")
        return c.internshipStatus === "Completed" || c.status === "Completed";
      if (statusFilter === "issued") return Boolean(c.certificateImageUrl);
      if (statusFilter === "pending") return !c.certificateImageUrl;

      return true;
    });
  }, [certificates, searchTerm, statusFilter]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    try {
      await deleteCertificate(deleteCandidate.id);
      setDeleteCandidate(null);
    } catch (err: any) {
      alert("Failed to delete certificate: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage official credentials, upload mandatory Offer Letters, and issue certificates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refresh}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition"
            title="Refresh from Firestore"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            to="/admin/certificates/new"
            className="btn-primary"
          >
            <Plus size={16} /> Add Certificate
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, email, course, certificate ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4] transition"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
          >
            <option value="all">All Certificates ({certificates.length})</option>
            <option value="completed">Status: Completed</option>
            <option value="active">Status: Active</option>
            <option value="issued">Certificate Issued</option>
            <option value="pending">Certificate Pending</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Student</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Course / Program</th>
                <th className="p-3.5">Certificate ID</th>
                <th className="p-3.5">Internship Status</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Offer Letter</th>
                <th className="p-3.5">Certificate</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <div className="w-7 h-7 border-2 border-[#0E4DA4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Querying records from Cloud Firestore...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center">
                    <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-800">No certificates yet</h3>
                    <p className="text-xs text-slate-500 mt-0.5 mb-4">
                      Get started by adding your first student and certificate record to Firestore.
                    </p>
                    <Link
                      to="/admin/certificates/new"
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: "0.75rem" }}
                    >
                      <Plus size={14} /> Add Certificate
                    </Link>
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    No records match your search &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => {
                  const isCompleted = cert.internshipStatus === "Completed";
                  const hasCert = Boolean(cert.certificateImageUrl);
                  const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(
                    cert.verificationNumber || cert.certificateId
                  )}`;

                  return (
                    <tr key={cert.id} className="hover:bg-slate-50/60 transition">
                      {/* Student Name */}
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-slate-900">{cert.studentName}</div>
                        {cert.phone && (
                          <div className="text-slate-400 text-[10px] mt-0.5">{cert.phone}</div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                        {cert.email}
                      </td>

                      {/* Course */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{cert.course}</div>
                        <div className="text-[11px] text-slate-500">
                          {cert.programType || "Internship"} • {cert.duration}
                        </div>
                      </td>

                      {/* Certificate ID */}
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">
                          {cert.certificateId || cert.verificationNumber}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(cert.verificationNumber || cert.certificateId, cert.id + "_num")
                            }
                            className="text-[10px] text-[#0E4DA4] hover:underline flex items-center gap-0.5 font-medium"
                          >
                            {copiedId === cert.id + "_num" ? (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <Check size={11} /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <Copy size={11} /> Copy ID
                              </span>
                            )}
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(verifyUrl, cert.id + "_url")}
                            className="text-[10px] text-[#0E4DA4] hover:underline flex items-center gap-0.5 font-medium"
                          >
                            {copiedId === cert.id + "_url" ? (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <Check size={11} /> Copied Link
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <ExternalLink size={11} /> Copy Link
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Internship Status */}
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {cert.internshipStatus || "Active"}
                        </span>
                      </td>

                      {/* Issue Date */}
                      <td className="p-3.5 text-slate-600">{cert.issueDate || "N/A"}</td>

                      {/* Offer Letter */}
                      <td className="p-3.5">
                        {cert.offerLetterUrl ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewFile({
                                  type: "pdf",
                                  url: cert.offerLetterUrl!,
                                  title: `Offer Letter - ${cert.studentName}`,
                                })
                              }
                              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg border border-emerald-200 transition"
                              title="Preview Offer Letter PDF"
                            >
                              <FileText size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                downloadOfferLetterPDF(cert.offerLetterUrl!, cert.studentName)
                              }
                              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition"
                              title="Download Offer Letter PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-rose-500 font-semibold text-[11px]">Missing</span>
                        )}
                      </td>

                      {/* Certificate Image */}
                      <td className="p-3.5">
                        {hasCert ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewFile({
                                  type: "image",
                                  url: cert.certificateImageUrl!,
                                  title: `Certificate - ${cert.studentName}`,
                                })
                              }
                              className="text-blue-700 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg border border-blue-200 transition"
                              title="View Certificate Image"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                downloadCertificatePDF(
                                  cert.certificateImageUrl!,
                                  cert.studentName,
                                  cert.certificateId || cert.verificationNumber
                                )
                              }
                              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition"
                              title="Download Certificate PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not Issued</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/certificates/${cert.id}`}
                            className="p-1.5 text-slate-600 hover:text-[#0E4DA4] hover:bg-slate-100 rounded-lg transition"
                            title="Edit Certificate"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(cert)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Certificate"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-3.5 bg-slate-50/75 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center px-5">
          <span>
            {filteredCertificates.length} of {certificates.length} total certificates
          </span>
          <span className="font-semibold text-slate-600">Cloud Firestore Synced</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3.5">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete this certificate?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              This action cannot be undone. The certificate record for{" "}
              <strong className="text-slate-900">{deleteCandidate.studentName}</strong> (
              {deleteCandidate.certificateId}) will be permanently deleted from Firestore.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={deleting}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-xs disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold truncate">{previewFile.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[350px]">
              {previewFile.type === "image" ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
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

export default AdminCertificatesList;
