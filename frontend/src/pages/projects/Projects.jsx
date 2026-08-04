import { useEffect, useState } from "react";

import PageHeader from "../../components/dashboard/PageHeader";
import ProjectCard from "../../components/projects/ProjectCard";

import {
  getMyProjects,
  deleteProject,
} from "../../services/projectService";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(projectId);
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        subtitle="Manage all your posted projects."
      />

      {loading ? (
        <div className="py-16 text-center">
          <p className="text-[#9AA8A1] text-lg">
            Loading Projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#22362B] bg-[#102018] py-20 text-center">
          <h2 className="text-2xl font-semibold text-white">
            No Projects Yet
          </h2>

          <p className="mt-3 text-[#9AA8A1]">
            Create your first project and start hiring freelancers.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
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