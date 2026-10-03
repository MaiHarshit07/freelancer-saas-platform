import api from "./api";

export const getFreelancerProfile = async (freelancerId) => {
  const response = await api.get(`/users/${freelancerId}`);
  return response.data;
};
