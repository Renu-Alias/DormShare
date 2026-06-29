import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(collegeEmail, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="text-base font-semibold tracking-tight text-text">DormShare</Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-text">Welcome back</h1>
          <p className="mt-2 text-sm text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted bg-white outline-none focus:border-text transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted bg-white outline-none focus:border-text transition-colors"
              required
            />
            <div className="mt-1.5 text-right">
              <Link to="/forgot-password" className="text-xs text-muted hover:text-text transition-colors">Forgot password?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-text hover:opacity-70 transition-opacity">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
