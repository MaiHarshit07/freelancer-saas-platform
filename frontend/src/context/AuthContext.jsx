import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser } from "../services/authService";
import {
  connectSocket,
  disconnectSocket,
} from "../services/socketService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    sessionStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(Boolean(token));

  // ==========================================
  // RESTORE USER SESSION
  // ==========================================

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((data) => {
        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
        setToken(null);
        disconnectSocket();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // ==========================================
  // LOGIN
  // ==========================================

  async function login(formData) {
    try {
      setLoading(true);

      const data = await loginUser(formData);

      // Save authentication data only
      // inside this browser tab/window.
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      // Connect Socket.IO using the new token.
      connectSocket();

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    try {
      const data = await getProfile();
      const nextUser = data.user;

      sessionStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      return null;
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    // Disconnect realtime connection first.
    disconnectSocket();

    // Clear only this tab/window's session.
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}