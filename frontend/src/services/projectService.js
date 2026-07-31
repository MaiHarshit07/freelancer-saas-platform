import api from "./api";

export const getMyProjects = async () => {
  const response = await api.get("/projects/my-projects");
  return response.data;
};
