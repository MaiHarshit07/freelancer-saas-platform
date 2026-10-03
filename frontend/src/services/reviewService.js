import api from "./api";

export const getFreelancerReviews = async (freelancerId) => {
  const response = await api.get(`/reviews/freelancer/${freelancerId}`);

  return response.data;
};

export const getGivenReviews = async () => {
  const response = await api.get("/reviews/given");

  return response.data;
};

export const submitReview = async (payload) => {
  const response = await api.post("/reviews", payload);

  return response.data;
};
