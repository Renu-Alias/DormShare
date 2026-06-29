/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && !savedUser) {
      localStorage.removeItem("token");
    } else if (token && savedUser) {
      api.get("/auth/me").catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  const login = useCallback(async (collegeEmail, password) => {
    const { data } = await api.post("/auth/login", { collegeEmail, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const { data } = await api.put("/auth/updateprofile", profileData);
    updateUser(data);
    return data;
  }, [updateUser]);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    const { data } = await api.put("/auth/updatepassword", {
      currentPassword,
      newPassword,
    });
    return data;
  }, []);

  const forgotPassword = useCallback(async (collegeEmail) => {
    const { data } = await api.post("/auth/forgotpassword", { collegeEmail });
    return data;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
    return data;
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
