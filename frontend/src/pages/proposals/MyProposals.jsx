import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import { getMyProposals } from "../../services/proposalService";

function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const data = await getMyProposals();

      setProposals(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load proposals."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-900/30 text-green-400";

      case "rejected":
        return "bg-red-900/30 text-red-400";

      case "pending":
        return "bg-yellow-900/30 text-yellow-400";

      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FaCheckCircle />;

      case "rejected":
        return <FaTimesCircle />;

      case "pending":
        return <FaClock />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">

      <PageHeader
        title="My Proposals"
        subtitle="Track all the projects you have applied to."
      />

      {loading ? (
        <div className="py-20 text-center">
          <p className="text-[#9AA8A1]">
            Loading proposals...
          </p>
        </div>
      ) : proposals.length === 0 ? (
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16281F] text-[#D4AF37]">
            <FaBriefcase size={24} />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-white">
            No Proposals Yet
          </h2>

          <p className="mt-3 text-[#9AA8A1]">
            Browse available projects and submit your first proposal.
          </p>

          <Link
            to="/browse-projects"
            className="
              mt-6
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
            Browse Projects

            <FaArrowRight />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">

          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="
                rounded-2xl
                border
                border-[#22362B]
                bg-[#102018]
                p-6
                transition
                hover:border-[#D4AF37]
              "
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Project Info */}

                <div className="flex-1">

                  <div className="flex items-start gap-4">

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#16281F]
                        text-[#D4AF37]
                      "
                    >
                      <FaBriefcase />
                    </div>

                    <div>

                      <h2 className="text-xl font-semibold text-white">
                        {proposal.project?.title ||
                          "Project"}
                      </h2>

                      <p className="mt-1 text-sm text-[#76837B]">
                        Project Budget: ₹{" "}
                        {proposal.project?.budget || 0}
                      </p>

                    </div>

                  </div>

                  {/* Cover Letter */}

                  <div className="mt-5">

                    <p className="text-sm font-medium text-[#C7D2CC]">
                      Your Cover Letter
                    </p>

                    <p className="mt-2 line-clamp-2 leading-7 text-[#9AA8A1]">
                      {proposal.coverLetter}
                    </p>

                  </div>

                </div>

                {/* Proposal Info */}

                <div className="w-full lg:w-56">

                  <p className="text-sm text-[#76837B]">
                    Your Bid
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#D4AF37]">
                    ₹ {proposal.bidAmount}
                  </p>

                  <div className="mt-3">

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${getStatusStyle(
                          proposal.status
                        )}
                      `}
                    >
                      {getStatusIcon(proposal.status)}

                      {proposal.status}
                    </span>

                  </div>

                  <Link
                    to={`/projects/${proposal.project?._id}`}
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      text-[#C7D2CC]
                      transition
                      hover:text-[#D4AF37]
                    "
                  >
                    View Project

                    <FaArrowRight />
                  </Link>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyProposals;