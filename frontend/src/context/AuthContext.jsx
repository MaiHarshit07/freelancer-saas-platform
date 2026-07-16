import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(false);

  async function login(formData) {
    try {

      setLoading(true);

      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      setToken(data.token);

      setUser(data.user);

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

  function logout() {

    localStorage.removeItem("token");

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}