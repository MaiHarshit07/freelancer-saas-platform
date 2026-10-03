import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import PageHeader from "../../../components/dashboard/PageHeader";
import StatCard from "../../../components/dashboard/StatCard";

import { getFreelancerDashboard } from "../../../services/dashboardService";

function FreelancerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getFreelancerDashboard();

      setStats(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-[#76837B]">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <PageHeader
        title="Freelancer Dashboard"
        subtitle="Track your proposals and freelance activity."
      />

      {/* Stats */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

  <StatCard
    title="Total Proposals"
    value={stats?.totalProposals || 0}
    icon={<FaBriefcase />}
    color="#D4AF37"
  />

  <StatCard
    title="Pending"
    value={stats?.pendingProposals || 0}
    icon={<FaClock />}
    color="#EAB308"
  />

  <StatCard
    title="Accepted"
    value={stats?.acceptedProposals || 0}
    icon={<FaCheckCircle />}
    color="#22C55E"
  />

  <StatCard
    title="Rejected"
    value={stats?.rejectedProposals || 0}
    icon={<FaTimesCircle />}
    color="#EF4444"
  />

</div>

      {/* Overview */}

      <div
        className="
          rounded-2xl
          border
          border-[#22362B]
          bg-[#102018]
          p-6
        "
      >
        <h2 className="text-xl font-semibold text-white">
          Proposal Overview
        </h2>

        <p className="mt-2 text-[#9AA8A1]">
          Keep applying to projects that match your skills.
          Your accepted proposals will appear in your active
          projects.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl bg-[#16281F] p-5">
            <p className="text-sm text-[#76837B]">
              Success Rate
            </p>

            <p className="mt-2 text-2xl font-bold text-[#D4AF37]">
              {stats?.totalProposals
                ? Math.round(
                    (stats.acceptedProposals /
                      stats.totalProposals) *
                      100
                  )
                : 0}
              %
            </p>
          </div>

          <div className="rounded-xl bg-[#16281F] p-5">
            <p className="text-sm text-[#76837B]">
              Active Applications
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {stats?.pendingProposals || 0}
            </p>
          </div>

          <div className="rounded-xl bg-[#16281F] p-5">
            <p className="text-sm text-[#76837B]">
              Accepted Work
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400">
              {stats?.acceptedProposals || 0}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default FreelancerDashboard;