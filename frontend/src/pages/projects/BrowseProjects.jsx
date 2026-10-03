import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import FreelancerProjectCard from "../../components/projects/FreelancerProjectCard";

import { getProjects } from "../../services/projectService";

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();

      const openProjects = data.filter(
        (project) => project.status === "open"
      );

      setProjects(openProjects);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return projects;
    }

    return projects.filter((project) => {
      const titleMatch = project.title
        ?.toLowerCase()
        .includes(search);

      const descriptionMatch = project.description
        ?.toLowerCase()
        .includes(search);

      const skillsMatch = project.skills?.some((skill) =>
        skill.toLowerCase().includes(search)
      );

      return (
        titleMatch ||
        descriptionMatch ||
        skillsMatch
      );
    });
  }, [projects, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}

      <PageHeader
        title="Browse Projects"
        subtitle="Find projects that match your skills."
      />

      {/* Search */}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-[#22362B]
          bg-[#102018]
          px-5
          py-4
        "
      >
        <FaSearch className="text-[#76837B]" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search projects, skills..."
          className="
            w-full
            bg-transparent
            text-white
            outline-none
            placeholder:text-[#76837B]
          "
        />
      </div>

      {/* Content */}

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[#9AA8A1]">
            Loading Projects...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[#22362B]
            bg-[#102018]
            py-20
            text-center
          "
        >
          <h2 className="text-2xl font-semibold text-white">
            No Projects Found
          </h2>

          <p className="mt-3 text-[#9AA8A1]">
            Try searching for another project or skill.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#76837B]">
              Showing{" "}
              <span className="font-medium text-[#C7D2CC]">
                {filteredProjects.length}
              </span>{" "}
              open projects
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <FreelancerProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

