import api from "./api";

export const getClientDashboard = async () => {
  const response = await api.get("/projects/dashboard/client");
  return response.data.dashboard;
};

export const getFreelancerDashboard = async () => {
  const response = await api.get("/proposals/freelancer-dashboard");
  return response.data;
};
