import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import ProjectForm from "../../components/projects/ProjectForm";

import {
  getProjectById,
  updateProject,
} from "../../services/projectService";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(id);

      setProject(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      setSaving(true);

      await updateProject(id, updatedProject);

      toast.success("Project updated successfully.");

      navigate("/projects");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-[#76837B]">
          Loading Project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-red-500">
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Project"
        subtitle="Update your project information."
      />

      <ProjectForm
        initialValues={project}
        onSubmit={handleUpdateProject}
        buttonText={saving ? "Saving..." : "Save Changes"}
        disabled={saving}
      />
    </div>
  );
}

export default EditProject;