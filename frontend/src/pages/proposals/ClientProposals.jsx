import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowRight, FaBriefcase } from "react-icons/fa";

import PageHeader from "../../components/dashboard/PageHeader";
import { getMyProjects } from "../../services/projectService";
import { getProjectProposals } from "../../services/proposalService";

function ClientProposals() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjectsWithProposals() {
      try {
        const clientProjects = await getMyProjects();
        const projectsWithProposals = await Promise.all(
          clientProjects.map(async (project) => ({
            ...project,
            proposalCount: (await getProjectProposals(project._id)).length,
          })),
        );

        setProjects(projectsWithProposals);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load proposals.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjectsWithProposals();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Proposals"
        subtitle="Review proposals submitted for your projects."
      />

      {loading ? (
        <div className="py-20 text-center text-[#9AA8A1]">
          Loading proposals...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#22362B] bg-[#102018] py-20 text-center">
          <FaBriefcase className="mx-auto text-3xl text-[#D4AF37]" />
          <h2 className="mt-4 text-2xl font-semibold text-white">
            No projects yet
          </h2>
          <Link
            to="/projects/create"
            className="mt-5 inline-flex text-[#D4AF37] hover:underline"
          >
            Create a project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="rounded-2xl border border-[#22362B] bg-[#102018] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm capitalize text-[#9AA8A1]">
                    {project.status}
                  </p>
                </div>
                <span className="rounded-full bg-[#16281F] px-3 py-1 text-sm text-[#D4AF37]">
                  {project.proposalCount} proposal
                  {project.proposalCount === 1 ? "" : "s"}
                </span>
              </div>

              <Link
                to={`/projects/${project._id}/proposals`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:underline"
              >
                Review proposals <FaArrowRight />
              </Link>

              {project.status === "in-progress" && (
                <Link
                  to={`/projects/${project._id}/messages`}
                  className="ml-5 inline-flex items-center gap-2 text-sm font-medium text-[#C7D2CC] hover:text-white hover:underline"
                >
                  Open messages <FaArrowRight />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientProposals;
