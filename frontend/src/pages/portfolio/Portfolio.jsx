import { useEffect, useMemo, useState } from "react";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaPlus,
  FaPencilAlt,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import {
  createPortfolioItem,
  deletePortfolioItem,
  getFreelancerPortfolio,
  updatePortfolioItem,
} from "../../services/portfolioService";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  projectLink: "",
  githubUrl: "",
  imageFile: null,
  imagePreview: "",
};

function Portfolio() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [formError, setFormError] = useState("");

  const isOwner = Boolean(user?._id);

  const portfolioCount = useMemo(() => items.length, [items]);

  const loadPortfolio = async () => {
    if (!user?._id) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getFreelancerPortfolio(user._id);
      setItems(result.data || []);
    } catch (error) {
      setFormError(error?.response?.data?.message || "Failed to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [user?._id]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : "",
      projectLink: item.projectLink || "",
      githubUrl: item.githubUrl || "",
      imageFile: null,
      imagePreview: item.image?.url || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be 5MB or smaller.");
      return;
    }

    setFormError("");
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    if (!editingId && !form.imageFile) {
      setFormError("Project image is required.");
      return;
    }

    try {
      setSubmitLoading(true);
      setFormError("");

      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("technologies", form.technologies);
      payload.append("projectLink", form.projectLink.trim());
      payload.append("githubUrl", form.githubUrl.trim());

      if (form.imageFile) {
        payload.append("file", form.imageFile);
      }

      if (editingId) {
        await updatePortfolioItem(editingId, payload);
      } else {
        await createPortfolioItem(payload);
      }

      await loadPortfolio();
      closeModal();
    } catch (error) {
      setFormError(error?.response?.data?.message || "Failed to save project.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this portfolio item?");

    if (!confirmed) return;

    try {
      setDeleteLoadingId(id);
      await deletePortfolioItem(id);
      await loadPortfolio();
    } catch (error) {
      setFormError(error?.response?.data?.message || "Failed to delete project.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#22362B] bg-[#0F1D18] p-6 shadow-lg shadow-[#07140E]/30 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8CA096]">
            Portfolio
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">My Work</h1>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
          >
            <FaPlus size={14} />
            Add Project
          </button>
        )}
      </div>

      {formError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {formError}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#22362B] bg-[#0F1D18] text-[#C7D2CC]">
          <div className="flex items-center gap-3">
            <FaSpinner className="animate-spin" size={18} />
            Loading portfolio...
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#22362B] bg-[#0F1D18] px-6 text-center">
          <h2 className="text-xl font-semibold text-white">No projects yet</h2>
          <p className="mt-2 max-w-md text-sm text-[#8CA096]">
            Add a project to showcase your work, skills, and live links.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-[#22362B] bg-[#0F1D18] shadow-lg shadow-[#07140E]/30"
            >
              <div className="h-52 overflow-hidden bg-[#091912]">
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl font-bold text-[#D4AF37]">
                    {item.title?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#C7D2CC]">
                    {item.description}
                  </p>
                </div>

                {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((technology) => (
                      <span
                        key={`${item._id}-${technology}`}
                        className="rounded-full border border-[#22362B] bg-[#102018] px-2.5 py-1 text-[11px] font-medium text-[#D4AF37]"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2 text-sm text-[#C7D2CC]">
                  {item.projectLink && (
                    <a
                      href={item.projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline"
                    >
                      <FaExternalLinkAlt size={12} />
                      Live Project
                    </a>
                  )}

                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline"
                    >
                      <FaGithub size={12} />
                      GitHub
                    </a>
                  )}
                </div>

                {isOwner && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.projectLink && (
                      <a
                        href={item.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[#22362B] px-3 py-2 text-xs font-medium text-[#C7D2CC] transition hover:border-[#D4AF37] hover:text-white"
                      >
                        View
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#22362B] px-3 py-2 text-xs font-medium text-[#C7D2CC] transition hover:border-[#D4AF37] hover:text-white"
                    >
                      <FaPencilAlt size={12} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={deleteLoadingId === item._id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaTrash size={12} />
                      {deleteLoadingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07140E]/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#22362B] bg-[#0F1D18] p-5 shadow-2xl shadow-[#07140E]/50 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? "Edit Project" : "Add Project"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-xl text-[#8CA096] transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  placeholder="Brief description of the project and your contribution"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">
                  Technologies / Skills
                </label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, technologies: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Project image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-dashed border-[#22362B] bg-[#07140E] px-4 py-3 text-[#C7D2CC] outline-none"
                />
                {form.imagePreview && (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="mt-3 h-40 w-full rounded-xl object-cover"
                  />
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">Live URL</label>
                  <input
                    type="url"
                    value={form.projectLink}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, projectLink: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#C7D2CC]">GitHub URL</label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, githubUrl: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#22362B] bg-[#07140E] px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]"
                    placeholder="https://github.com/your-project"
                  />
                </div>
              </div>

              {formError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#22362B] px-4 py-2.5 font-medium text-[#C7D2CC] transition hover:border-[#D4AF37] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="rounded-xl bg-[#D4AF37] px-5 py-2.5 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitLoading ? "Saving..." : editingId ? "Save Changes" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
