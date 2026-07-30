import {
  FaBriefcase,
  FaPaperPlane,
  FaStar,
  FaMoneyBillWave,
} from "react-icons/fa";

import StatCard from "../../../components/dashboard/StatCard";

function FreelancerDashboard() {
  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          Freelancer Dashboard
        </h1>

        <p className="mt-2 text-[#C7D2CC]">
          Track your work and earnings.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Active Projects"
          value="4"
          icon={<FaBriefcase size={22} />}
        />

        <StatCard
          title="Proposals"
          value="17"
          icon={<FaPaperPlane size={22} />}
        />

        <StatCard
          title="Rating"
          value="4.9"
          icon={<FaStar size={22} />}
        />

        <StatCard
          title="Earnings"
          value="₹.52K"
          icon={<FaMoneyBillWave size={22} />}
        />

      </div>

    </div>
  );
}

export default FreelancerDashboard;