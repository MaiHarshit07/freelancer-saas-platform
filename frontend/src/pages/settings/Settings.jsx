import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaFilePdf,
  FaKey,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrash,
  FaUser,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import {
  changePassword,
  deleteAccount,
  deleteResume,
  updateProfile,
  uploadProfileImage,
  uploadResume,
} from "../../services/authService";

const navItems = [
  { id: "profile", label: "Profile Settings", icon: FaUser },
  { id: "documents", label: "Documents", icon: FaFilePdf },
  { id: "security", label: "Security", icon: FaKey },
  { id: "danger", label: "Danger Zone", icon: FaShieldAlt },
];

function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    skills: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState({
    profile: false,
    image: false,
    resume: false,
    password: false,
    delete: false,
    deleteResume: false,
  });

  const isFreelancer = user?.role === "freelancer";

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      bio: user.bio || "",
      skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
    });
  }, [user]);

  const profileImageUrl = user?.profileImage?.url || "";
  const resumeUrl = user?.resume?.url || "";
  const resumeName = user?.resume?.originalName || "No resume uploaded";

  const currentTabLabel = useMemo(
    () => navItems.find((item) => item.id === activeTab)?.label || "Profile Settings",
    [activeTab],
  );

  const setStatusMessage = (type, message) => {
    setStatus({ type, message });
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      setStatusMessage("", "");

      const payload = {
        name: profileForm.name,
        bio: profileForm.bio,
        skills: profileForm.skills,
      };

      await updateProfile(payload);
      await refreshUser();
      setStatusMessage("success", "Profile updated successfully.");
    } catch (error) {
      setStatusMessage(
        "error",
        error?.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage("error", "Profile image must be 5MB or smaller.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, image: true }));
      setStatusMessage("", "");
      await uploadProfileImage(file);
      await refreshUser();
      setStatusMessage("success", "Profile image updated successfully.");
    } catch (error) {
      setStatusMessage(
        "error",
        error?.response?.data?.message || "Failed to upload profile image.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
      event.target.value = "";
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage("error", "Resume must be 5MB or smaller.");
      return;
    }

    if (file.type !== "application/pdf") {
      setStatusMessage("error", "Only PDF resumes are allowed.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, resume: true }));
      setStatusMessage("", "");
      await uploadResume(file);
      await refreshUser();
      setStatusMessage("success", "Resume uploaded successfully.");
    } catch (error) {
      setStatusMessage(
        "error",
        error?.response?.data?.message || "Failed to upload resume.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, resume: false }));
      event.target.value = "";
    }
  };

  const handleResumeDelete = async () => {
    try {
      setLoading((prev) => ({ ...prev, deleteResume: true }));
      setStatusMessage("", "");
      await deleteResume();
      await refreshUser();
      setStatusMessage("success", "Resume deleted successfully.");
    } catch (error) {
      setStatusMessage(
        "error",
        error?.response?.data?.message || "Failed to delete resume.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, deleteResume: false }));
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMessage("error", "New password and confirm password do not match.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, password: true }));
      setStatusMessage("", "");

      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStatusMessage("success", "Password changed successfully.");
    } catch (error) {
      setStatusMessage(
        "error",
        error?.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "This will permanently delete your account. This action cannot be undone. Continue?",
    );

    if (!isConfirmed) return;

    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      setStatusMessage("", "");
      await deleteAccount();
      logout();
      navigate("/login");
    } catch (error) {
      setStatusMessage(
        "error",
        error?.response?.data?.message || "Failed to delete account.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#22362B] bg-[#0F1D18] p-6 shadow-lg shadow-[#07140E]/30">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8CA096]">
          Account
        </p>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      {status.message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === "success" ? (
              <FaCheckCircle size={14} />
            ) : (
              <FaExclamationTriangle size={14} />
            )}
            <span>{status.message}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-3">
          <div className="hidden gap-2 lg:flex lg:flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-[#D4AF37] text-black"
                      : "text-[#C7D2CC] hover:bg-[#1A3023] hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:hidden">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#8CA096]">
              Section
            </label>
            <select
              value={activeTab}
              onChange={(event) => setActiveTab(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#22362B] bg-[#07140E] px-3 py-3 text-sm text-white outline-none"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <div className="rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5 md:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8CA096]">Section</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{currentTabLabel}</h2>
            </div>
          </div>

          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="flex flex-col gap-5 rounded-2xl border border-[#22362B] bg-[#0B1714] p-5 md:flex-row md:items-center">
                <div className="relative">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-[#D4AF37]"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1A3023] text-2xl font-bold text-[#D4AF37]">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#0F1D18] bg-[#D4AF37] text-black shadow-lg transition hover:scale-105">
                    <FaCamera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-[#8CA096]">Profile photo</p>
                  <p className="mt-1 text-base font-medium text-white">
                    {loading.image ? "Uploading..." : "Update your photo for your profile"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(event) =>
                      setProfileForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-[#22362B] bg-[#091912] px-4 py-3 text-[#8CA096] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Role</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-[#22362B] bg-[#091912] px-4 py-3 capitalize text-[#8CA096] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Skills</label>
                  <input
                    type="text"
                    value={profileForm.skills}
                    onChange={(event) =>
                      setProfileForm((prev) => ({ ...prev, skills: event.target.value }))
                    }
                    placeholder="React, Node.js, UI/UX"
                    className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Bio</label>
                <textarea
                  rows={5}
                  value={profileForm.bio}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, bio: event.target.value }))
                  }
                  placeholder="Tell clients or employers a little about yourself..."
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading.profile}
                  className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading.profile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#22362B] bg-[#0B1714] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#8CA096]">Resume status</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">
                      {resumeUrl ? "Uploaded and ready" : "Not uploaded yet"}
                    </h3>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      resumeUrl
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-[#1A3023] text-[#C7D2CC]"
                    }`}
                  >
                    {resumeUrl ? "Active" : "Missing"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#22362B] bg-[#0B1714] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3 text-[#C7D2CC]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                      <FaFilePdf size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{resumeName}</p>
                      <p className="text-sm text-[#8CA096]">PDF only • Max 5MB</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#22362B] px-3 py-2 text-sm font-medium text-[#C7D2CC] transition hover:border-[#D4AF37] hover:text-white"
                      >
                        <FaDownload size={14} />
                        View / Download
                      </a>
                    )}

                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]">
                      {resumeUrl ? "Replace resume" : "Upload resume"}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>

                    {resumeUrl && (
                      <button
                        type="button"
                        onClick={handleResumeDelete}
                        disabled={loading.deleteResume}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTrash size={12} />
                        {loading.deleteResume ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!isFreelancer && (
                <div className="rounded-2xl border border-[#22362B] bg-[#0B1714] p-5 text-sm text-[#C7D2CC]">
                  Resume management is available for freelancer accounts only.
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Current password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">New password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Confirm password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading.password}
                  className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading.password ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "danger" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#22362B] bg-[#0B1714] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#8CA096]">Session</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">Logout</h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#22362B] px-4 py-2 font-medium text-[#C7D2CC] transition hover:border-[#D4AF37] hover:text-white"
                  >
                    <FaSignOutAlt size={14} />
                    Logout
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-red-200">Danger Zone</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">Delete account</h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading.delete}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/15 px-4 py-2 font-medium text-red-100 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaTrash size={14} />
                    {loading.delete ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
