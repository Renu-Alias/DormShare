import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);

const makeToken = () => "demo." + btoa(JSON.stringify({ id: Date.now() })) + ".sig";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(async (collegeEmail, password) => {
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
  }, []);

  const register = useCallback(async ({ name, collegeEmail, password, hostelBlock }) => {
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
    updateUser(profileData);
    return { message: "Profile updated" };
  }, [updateUser]);

  const updatePassword = useCallback(async () => {
    return { message: "Password updated" };
  }, []);

  const forgotPassword = useCallback(async () => {
    return { message: "Email sent (demo mode)" };
  }, []);

  const resetPassword = useCallback(async () => {
    return { message: "Password reset successful (demo mode)" };
  }, []);

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
