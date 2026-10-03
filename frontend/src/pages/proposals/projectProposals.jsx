import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUser,
  FaComments,
} from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";

import {
  getProjectProposals,
  acceptProposal,
  rejectProposal,
} from "../../services/proposalService";

function ProjectProposals() {
  const { projectId } = useParams();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, [projectId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);

      const data = await getProjectProposals(projectId);

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

  const handleAccept = async (proposalId) => {
    try {
      setActionLoading(proposalId);

      await acceptProposal(proposalId);

      toast.success("Proposal accepted successfully.");

      await fetchProposals();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to accept proposal."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      setActionLoading(proposalId);

      await rejectProposal(proposalId);

      toast.success("Proposal rejected.");

      await fetchProposals();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to reject proposal."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <Link
        to={`/projects/${projectId}`}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-[#C7D2CC]
          transition
          hover:text-[#D4AF37]
        "
      >
        <FaArrowLeft />
        Back to Project
      </Link>

      <PageHeader
        title="Project Proposals"
        subtitle="Review freelancers who applied to your project."
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
          <h2 className="text-2xl font-semibold text-white">
            No Proposals Yet
          </h2>

          <p className="mt-3 text-[#9AA8A1]">
            Freelancers who apply to this project will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => {
            const isLoading =
              actionLoading === proposal._id;

            return (
              <div
                key={proposal._id}
                className="
                  rounded-2xl
                  border
                  border-[#22362B]
                  bg-[#102018]
                  p-6
                "
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Freelancer */}

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-[#16281F]
                          text-[#D4AF37]
                        "
                      >
                        <FaUser />
                      </div>

                      <div>
                        <h2 className="font-semibold text-white">
                          <Link
                            to={`/freelancers/${proposal.freelancer?._id}`}
                            className="transition hover:text-[#D4AF37]"
                          >
                            {proposal.freelancer?.name || "Freelancer"}
                          </Link>
                        </h2>

                        <p className="text-sm text-[#76837B]">
                          {proposal.freelancer?.email}
                        </p>
                      </div>
                    </div>

                    {/* Cover Letter */}

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-[#C7D2CC]">
                        Cover Letter
                      </h3>

                      <p className="mt-2 leading-7 text-[#9AA8A1]">
                        {proposal.coverLetter}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}

                  <div className="w-full lg:w-64">
                    <p className="text-sm text-[#76837B]">
                      Freelancer Bid
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#D4AF37]">
                      ₹ {proposal.bidAmount}
                    </p>

                    <div className="mt-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            proposal.status === "accepted"
                              ? "bg-green-900/30 text-green-400"
                              : proposal.status === "rejected"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-yellow-900/30 text-yellow-400"
                          }
                        `}
                      >
                        {proposal.status}
                      </span>
                    </div>

                    {/* Actions */}

                    {proposal.status === "pending" && (
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() =>
                            handleAccept(proposal._id)
                          }
                          disabled={isLoading}
                          className="
                            inline-flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-green-600
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-green-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          <FaCheck />

                          {isLoading
                            ? "Processing..."
                            : "Accept"}
                        </button>

                        <button
                          onClick={() =>
                            handleReject(proposal._id)
                          }
                          disabled={isLoading}
                          className="
                            inline-flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-500/40
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-red-400
                            transition
                            hover:bg-red-500/10
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          <FaTimes />

                          Reject
                        </button>
                      </div>
                    )}

                    {proposal.status === "accepted" && (
                      <Link
                        to={`/projects/${projectId}/messages`}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-medium text-[#07140E] transition hover:bg-[#E6C766]"
                      >
                        <FaComments />
                        Message Freelancer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectProposals;