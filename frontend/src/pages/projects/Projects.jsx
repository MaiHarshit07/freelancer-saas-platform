import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import Button from "../../components/ui/Button";
import ProjectCard from "../../components/projects/ProjectCard";

import {
  getMyProjects,
  deleteProject,
} from "../../services/projectService";

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      await deleteProject(projectId);
      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project._id !== projectId
        )
      );
      toast.success("Project deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        subtitle="Manage your client projects and proposals."
        action={
          <Button onClick={() => navigate("/projects/create")}>
            + New Project
          </Button>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-[#52705D]">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE8DE] bg-[#FFFFFF] py-20 text-center">
          <h2 className="text-2xl font-semibold text-[#14532D]">
            No projects yet
          </h2>
          <p className="mt-3 text-[#52705D]">
            Start by creating your first project.
          </p>
          <Button
            onClick={() => navigate("/projects/create")}
            className="mt-6"
          >
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;