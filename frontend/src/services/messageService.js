import api from "./api";

// ==========================================
// SEND MESSAGE
// ==========================================

export const sendMessage = async ({ projectId, receiverId, content }) => {
  const response = await api.post("/messages", {
    projectId,
    receiverId,
    content,
  });

  return response.data.data;
};

// ==========================================
// GET PROJECT MESSAGES
// ==========================================

export const getProjectMessages = async (projectId) => {
  const response = await api.get(`/messages/${projectId}`);

  return response.data.data;
};

// ==========================================
// GET MY CONVERSATIONS
// ==========================================

export const getMyConversations = async () => {
  const response = await api.get("/messages");

  return response.data.data;
};
