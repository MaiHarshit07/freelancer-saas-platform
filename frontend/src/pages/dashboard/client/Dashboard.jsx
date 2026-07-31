import { useEffect, useState } from "react";
import { FaFolderOpen, FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";

import StatCard from "../../../components/dashboard/StatCard";
import RecentProjectCard from "../../../components/dashboard/RecentProjectCard";
import { getClientDashboard } from "../../../services/dashboardService";
import { getMyProjects } from "../../../services/projectService";
import PageHeader from "../../../components/dashboard/PageHeader";
import Button from "../../../components/ui/Button";
function ClientDashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await getClientDashboard();
        setStats(dashboardData);

        const projectData = await getMyProjects();
        setProjects(projectData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      {/* Heading */}

      <div className="mb-8">
       <PageHeader
  title="Dashboard"
  subtitle="Manage your projects and freelancers."
  action={
    <Button>
      + New Project
    </Button>
  }
/>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects ?? 0}
          icon={<FaFolderOpen size={22} />}
        />

        <StatCard
          title="Open Projects"
          value={stats?.openProjects ?? 0}
          icon={<FaClock size={22} />}
        />

        <StatCard title="Freelancers" value="0" icon={<FaUsers size={22} />} />

        <StatCard
          title="Completed"
          value={stats?.completedProjects ?? 0}
          icon={<FaCheckCircle size={22} />}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-5 text-2xl font-bold text-white">Recent Projects</h2>

        <div className="space-y-4">
          {projects.length > 0 ? (
            projects
              .slice(0, 5)
              .map((project) => (
                <RecentProjectCard
                  key={project._id}
                  title={project.title}
                  budget={project.budget}
                  status={project.status}
                />
              ))
          ) : (
            <p className="text-[#C7D2CC]">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
