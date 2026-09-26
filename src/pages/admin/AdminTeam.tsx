import React, { useState } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  AlertTriangle,
  X,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useAdminTeam } from "../../hooks/useTeam";
import { TeamMember } from "../../types/database";
import { uploadToCloudinary, validateCertificateImage } from "../../lib/cloudinary";

const AdminTeam: React.FC = () => {
  const { members, loading, saveMember, deleteMember, refresh } = useAdminTeam();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [active, setActive] = useState(true);
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TeamMember | null>(null);

  const openAddModal = () => {
    setEditingMember(null);
    setName("");
    setDesignation("");
    setDescription("");
    setImageUrl("");
    setImagePublicId("");
    setDisplayOrder(members.length + 1);
    setActive(true);
    setLinkedin("");
    setInstagram("");
    setFacebook("");
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (m: TeamMember) => {
    setEditingMember(m);
    setName(m.name || "");
    setDesignation(m.designation || "");
    setDescription(m.description || "");
    setImageUrl(m.imageUrl || "");
    setImagePublicId(m.imagePublicId || "");
    setDisplayOrder(m.displayOrder ?? 1);
    setActive(m.active ?? true);
    setLinkedin(m.linkedin || "");
    setInstagram(m.instagram || "");
    setFacebook(m.facebook || "");
    setError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateCertificateImage(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image file");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, "clickudaan/team");
      setImageUrl(res.secure_url);
      setImagePublicId(res.public_id);
    } catch (err: any) {
      setError(err.message || "Failed to upload photo to Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      setError("Name and Designation are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveMember({
        id: editingMember?.id,
        name: name.trim(),
        designation: designation.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        imagePublicId,
        displayOrder: Number(displayOrder),
        active,
        linkedin: linkedin.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
      });

      if (res.success) {
        setModalOpen(false);
      } else {
        setError(res.error || "Failed to save team member.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteMember(deleteCandidate.id);
      setDeleteCandidate(null);
    } catch (err: any) {
      alert("Failed to delete member: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Our Team CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public team profiles, designations, and display order in real time
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
          <button
            onClick={openAddModal}
            className="btn-primary"
          >
            <Plus size={16} /> Add Team Member
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400">
            <div className="w-7 h-7 border-2 border-[#0E4DA4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading team profiles from Firestore...
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full p-14 text-center bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Team Members Found</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Add your executive and advisory team members to showcase them on the public About page.
            </p>
            <button
              onClick={openAddModal}
              className="btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.75rem" }}
            >
              Add First Member
            </button>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden flex flex-col justify-between ${
                member.active ? "border-slate-200" : "border-slate-300 opacity-60 bg-slate-50/50"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-500 text-sm">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#0E4DA4] mt-0.5">
                        {member.designation}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      member.active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {member.description || "No bio description provided."}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Order: #{member.displayOrder}</span>
                  {member.linkedin && <span className="text-blue-600 font-semibold">LinkedIn ✓</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(member)}
                  className="px-3 py-1.5 text-xs font-bold text-[#0E4DA4] hover:bg-blue-50 rounded-lg transition flex items-center gap-1"
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  onClick={() => setDeleteCandidate(member)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition flex items-center gap-1"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
              <h2 className="text-base font-bold text-slate-900">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full Name"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Managing Director / Lead Strategist"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bio / Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of their responsibilities..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
                />
              </div>

              {/* Profile Photo Cloudinary Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profile Photo (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Users size={18} className="text-slate-400" />
                    )}
                  </div>
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5">
                    <Upload size={13} /> {uploading ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImagePublicId("");
                      }}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Public Status
                  </label>
                  <select
                    value={active ? "true" : "false"}
                    onChange={(e) => setActive(e.target.value === "true")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  LinkedIn URL (Optional)
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4DA4]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "0.75rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="btn-primary"
                  style={{ padding: "8px 18px", fontSize: "0.75rem" }}
                >
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3.5">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Delete {deleteCandidate.name}?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              This member will be permanently removed from Firestore and will no longer appear on the website.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
