import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket;

// ==========================================
// CONNECT SOCKET
// ==========================================

export function connectSocket() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return null;
  }

  // If a socket already exists and is connected,
  // reuse it.
  if (socket?.connected) {
    return socket;
  }

  // If an old socket exists but isn't connected,
  // remove it before creating a new one.
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },

    autoConnect: true,

    transports: ["websocket", "polling"],
  });

  return socket;
}

// ==========================================
// GET CURRENT SOCKET
// ==========================================

export function getSocket() {
  return socket;
}

// ==========================================
// JOIN PROJECT ROOM
// ==========================================

export function joinProjectRoom(projectId) {
  if (!socket || !projectId) {
    return;
  }

  socket.emit("joinProject", projectId);
}

// ==========================================
// LEAVE PROJECT ROOM
// ==========================================

export function leaveProjectRoom(projectId) {
  if (!socket || !projectId) {
    return;
  }

  socket.emit("leaveProject", projectId);
}

// ==========================================
// DISCONNECT SOCKET
// ==========================================

export function disconnectSocket() {
  if (!socket) {
    return;
  }

  socket.disconnect();

  socket = undefined;
}
