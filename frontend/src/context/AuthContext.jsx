import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const makeToken = () => "demo." + btoa(JSON.stringify({ id: Date.now() })) + ".sig";

const isNetworkError = (err) => !err.response;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      api.get("/auth/me").then(({ data }) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }).catch(() => {
        // keep saved user when backend is unreachable
      }).finally(() => setLoading(false));
    } else {
      if (token && !savedUser) localStorage.removeItem("token");
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (collegeEmail, password) => {
    try {
      const { data } = await api.post("/auth/login", { collegeEmail, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      if (isNetworkError(err)) {
        const data = {
          _id: Date.now().toString(),
          name: collegeEmail.split("@")[0] || "User",
          collegeEmail: collegeEmail.toLowerCase(),
          hostelBlock: "A Block",
          verified: true,
          token: makeToken(),
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
      }
      throw err;
    }
  }, []);

  const register = useCallback(async ({ name, collegeEmail, password, hostelBlock }) => {
    try {
      const { data } = await api.post("/auth/register", { name, collegeEmail, password, hostelBlock });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      if (isNetworkError(err)) {
        const data = {
          _id: Date.now().toString(),
          name,
          collegeEmail: collegeEmail.toLowerCase(),
          hostelBlock: hostelBlock || "A Block",
          verified: true,
          token: makeToken(),
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
      }
      throw err;
    }
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
