import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import ProjectForm from "../../components/projects/ProjectForm";

import { createProject } from "../../services/projectService";

function CreateProject() {
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    budget: "",
    skills: [],
  };

  const handleCreateProject = async (projectData) => {
    try {
      setCreating(true);

      await createProject(projectData);

      toast.success("Project created successfully.");

      navigate("/projects");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Project"
        subtitle="Post a new project for freelancers."
      />

      <ProjectForm
        initialValues={initialValues}
        onSubmit={handleCreateProject}
        buttonText={creating ? "Creating..." : "Create Project"}
        disabled={creating}
      />
    </div>
  );
}

export default CreateProject;