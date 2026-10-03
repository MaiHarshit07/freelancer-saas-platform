import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaComments,
} from "react-icons/fa";
import toast from "react-hot-toast";

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
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);

      const data = await getProjectById(id);

      setProject(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load project."
      );
    } finally {
      setLoading(false);
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

  const hasAssignedFreelancer =
    Boolean(project.assignedFreelancer);

  return (
    <div className="space-y-8">

      {/* ================================
          TOP SECTION
      ================================= */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <Link
            to="/projects"
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-[#D4AF37]
              transition
              hover:underline
            "
          >
            <FaArrowLeft />

            Back to Projects
          </Link>

          <PageHeader
            title={project.title}
            subtitle="Project Overview"
          />
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-3">

          {/* Messaging */}

          {hasAssignedFreelancer && (
            <Link
              to={`/projects/${project._id}/messages`}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#D4AF37]
                px-5
                py-3
                font-medium
                text-[#D4AF37]
                transition
                hover:bg-[#D4AF37]
                hover:text-[#07140E]
              "
            >
              <FaComments />

              Messages
            </Link>
          )}

          {/* Edit */}

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

      </div>


      {/* ================================
          PROJECT LAYOUT
      ================================= */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ==============================
            LEFT SECTION
        =============================== */}

        <div className="space-y-6 lg:col-span-2">

          {/* Description */}

          <ProjectInfoCard title="Description">

            <p className="leading-8 text-[#C7D2CC]">
              {project.description}
            </p>

          </ProjectInfoCard>


          {/* Skills */}

          <ProjectInfoCard title="Skills">

            {project.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-3">

                {project.skills.map((skill) => (
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
            ) : (
              <p className="text-[#76837B]">
                No skills specified.
              </p>
            )}

          </ProjectInfoCard>


          {/* Attachments */}

          <ProjectInfoCard title="Attachments">

            {!project.attachments ||
            project.attachments.length === 0 ? (
              <p className="text-[#76837B]">
                No attachments uploaded.
              </p>
            ) : (
              <div className="space-y-3">

                {project.attachments.map((file) => (
                  <a
                    key={
                      file.publicId ||
                      file.url ||
                      file.originalName
                    }
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-[#22362B]
                      bg-[#16281F]
                      px-4
                      py-3
                      text-sm
                      text-[#D4AF37]
                      transition
                      hover:border-[#D4AF37]
                    "
                  >
                    <span>
                      {file.originalName ||
                        "View Attachment"}
                    </span>

                    <span className="text-xs text-[#76837B]">
                      Open
                    </span>
                  </a>
                ))}

              </div>
            )}

          </ProjectInfoCard>


          {/* Assigned Freelancer */}

          <ProjectInfoCard title="Assigned Freelancer">

            {project.assignedFreelancer ? (
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="font-medium text-white">
                    {project.assignedFreelancer.name ||
                      "Freelancer"}
                  </p>

                  {project.assignedFreelancer.email && (
                    <p className="mt-1 text-sm text-[#76837B]">
                      {project.assignedFreelancer.email}
                    </p>
                  )}

                </div>

                {/* Message shortcut */}

                <Link
                  to={`/projects/${project._id}/messages`}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#16281F]
                    px-4
                    py-2
                    text-sm
                    text-[#D4AF37]
                    transition
                    hover:bg-[#22362B]
                  "
                >
                  <FaComments />

                  Message
                </Link>

              </div>
            ) : (
              <div>

                <p className="text-[#76837B]">
                  No freelancer assigned yet.
                </p>

                <p className="mt-2 text-sm text-[#76837B]">
                  Messaging will become available after
                  a proposal is accepted.
                </p>

              </div>
            )}

          </ProjectInfoCard>

        </div>


        {/* ==============================
            RIGHT SECTION
        =============================== */}

        <ProjectMetaCard project={project} />

      </div>

    </div>
  );
}

export default ProjectDetails;