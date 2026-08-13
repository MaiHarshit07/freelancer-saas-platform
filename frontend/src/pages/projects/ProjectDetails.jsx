import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import PageHeader from "../../components/dashboard/PageHeader";
import ProjectInfoCard from "../../components/projects/ProjectInfoCard";
import ProjectMetaCard from "../../components/projects/ProjectMetaCard";

import { getProjectById } from "../../services/projectService";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(id);

      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-[#76837B] text-lg">
          Loading Project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-500 text-lg">
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top */}

      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/projects"
            className="mb-5 inline-flex items-center gap-2 text-[#D4AF37] hover:underline"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>

          <PageHeader
            title={project.title}
            subtitle="Project Overview"
          />
        </div>

        <Link
          to={`/projects/edit/${project._id}`}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[#D4AF37]
            px-5
            py-3
            font-medium
            text-[#07140E]
            transition
            hover:scale-105
          "
        >
          <FaEdit />
          Edit Project
        </Link>
      </div>

      {/* Layout */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}

        <div className="space-y-6 lg:col-span-2">
          <ProjectInfoCard title="Description">
            <p className="leading-8 text-[#C7D2CC]">
              {project.description}
            </p>
          </ProjectInfoCard>

          <ProjectInfoCard title="Skills">
            <div className="flex flex-wrap gap-3">
              {project.skills?.map((skill) => (
                <span
                  key={skill}
                  className="
                    rounded-full
                    bg-[#16281F]
                    px-4
                    py-2
                    text-sm
                    text-[#C7D2CC]
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </ProjectInfoCard>

          <ProjectInfoCard title="Attachments">
            {project.attachments?.length === 0 ? (
              <p className="text-[#76837B]">
                No attachments uploaded.
              </p>
            ) : (
              <div className="space-y-2">
                {project.attachments?.map((file) => (
                  <a
                    key={file.publicId}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[#D4AF37] hover:underline"
                  >
                    {file.originalName}
                  </a>
                ))}
              </div>
            )}
          </ProjectInfoCard>

          <ProjectInfoCard title="Assigned Freelancer">
            {project.assignedFreelancer ? (
              <p className="text-white">
                {project.assignedFreelancer.name}
              </p>
            ) : (
              <p className="text-[#76837B]">
                No freelancer assigned yet.
              </p>
            )}
          </ProjectInfoCard>
        </div>

        {/* Right */}

        <ProjectMetaCard project={project} />
      </div>
    </div>
  );
}

export default ProjectDetails;