import api from "./api";

export const createProposal = async (proposalData) => {
  const response = await api.post("/proposals", proposalData);
  return response.data;
};

export const getMyProposals = async () => {
  const response = await api.get("/proposals/my-proposals");
  return response.data.data;
};

export const getProjectProposals = async (projectId) => {
  const response = await api.get(`/proposals/project/${projectId}`);
  return response.data.data;
};

export const acceptProposal = async (proposalId) => {
  const response = await api.put(`/proposals/${proposalId}/accept`);
  return response.data;
};

export const rejectProposal = async (proposalId) => {
  const response = await api.put(`/proposals/${proposalId}/reject`);
  return response.data;
};

export const getFreelancerDashboard = async () => {
  const response = await api.get("/proposals/dashboard/freelancer");
  return response.data;
};
