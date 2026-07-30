import { useAuth } from "../../context/AuthContext";

import ClientDashboard from "./client/Dashboard";
import FreelancerDashboard from "./freelancer/Dashboard";

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "client") {
    return <ClientDashboard />;
  }

  return <FreelancerDashboard />;
}

export default Dashboard;