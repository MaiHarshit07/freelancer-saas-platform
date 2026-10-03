import api from "./api";

export async function loginUser(data) {
  const response = await api.post("/auth/login", data);

  return response.data;
}

export async function getProfile() {
  const response = await api.get("/auth/profile");

  return response.data;
}

export async function registerUser(data) {
  const response = await api.post("/auth/register", data);

  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put("/auth/profile", data);

  return response.data;
}

export async function changePassword(data) {
  const response = await api.put("/auth/change-password", data);

  return response.data;
}

export async function deleteAccount() {
  const response = await api.delete("/auth/account");

  return response.data;
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/users/profile-image", formData);

  return response.data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/users/resume", formData);

  return response.data;
}

export async function deleteResume() {
  const response = await api.delete("/users/resume");

  return response.data;
}
