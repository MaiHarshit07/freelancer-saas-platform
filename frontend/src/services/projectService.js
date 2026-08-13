import api from "./api";

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data.project;
};

export const getMyProjects = async () => {
  const response = await api.get("/projects/my-projects");
  return response.data.data;
};

export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data.project;
};

export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);

  return response.data.project;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};
