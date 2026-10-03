import api from "./api";

export const getFreelancerPortfolio = async (freelancerId) => {
  const response = await api.get(`/portfolio/${freelancerId}`);
  return response.data;
};

export const createPortfolioItem = async (formData) => {
  const response = await api.post("/portfolio", formData);

  return response.data;
};

export const updatePortfolioItem = async (id, formData) => {
  const response = await api.put(`/portfolio/${id}`, formData);

  return response.data;
};

export const deletePortfolioItem = async (id) => {
  const response = await api.delete(`/portfolio/${id}`);
  return response.data;
};
