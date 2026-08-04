import api from "./api";

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const getMyProjects = async () => {
  const response = await api.get("/projects/my-projects");
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};
