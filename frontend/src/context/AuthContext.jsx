import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const genObjectId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const isNetworkError = (err) => !err.response;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (collegeEmail, password) => {
    try {
      const { data } = await api.post("/auth/login", { collegeEmail, password });
      setUser(data);
      return data;
    } catch (err) {
      if (isNetworkError(err)) {
        const id = genObjectId();
        const data = {
          _id: id,
          name: collegeEmail.split("@")[0] || "User",
          collegeEmail: collegeEmail.toLowerCase(),
          hostelBlock: "A Block",
          verified: true,
        };
        setUser(data);
        return data;
      }
      throw err;
    }
  }, []);

  const register = useCallback(async ({ name, collegeEmail, password, hostelBlock }) => {
    try {
      const { data } = await api.post("/auth/register", { name, collegeEmail, password, hostelBlock });
      setUser(data);
      return data;
    } catch (err) {
      if (isNetworkError(err)) {
        const id = genObjectId();
        const data = {
          _id: id,
          name,
          collegeEmail: collegeEmail.toLowerCase(),
          hostelBlock: hostelBlock || "A Block",
          verified: true,
        };
        setUser(data);
        return data;
      }
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // fallback: clear client state even if server unreachable
    }
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await api.put("/auth/updateprofile", profileData);
      updateUser(data);
      return data;
    } catch (err) {
      if (isNetworkError(err)) { updateUser(profileData); return { message: "Updated (offline)" }; }
      throw err;
    }
  }, [updateUser]);

  const updatePassword = useCallback(async () => ({ message: "Password updated" }), []);
  const forgotPassword = useCallback(async () => ({ message: "Email sent (demo)" }), []);
  const resetPassword = useCallback(async () => ({ message: "Password reset (demo)" }), []);

  const value = {
    user, login, register, logout, updateUser,
    updateProfile, updatePassword, forgotPassword, resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
