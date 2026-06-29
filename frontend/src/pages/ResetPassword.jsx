import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="text-base font-semibold tracking-tight text-text">DormShare</Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-text">Reset password</h1>
          <p className="mt-2 text-sm text-secondary">Choose a new password for your account.</p>
        </div>

        {done ? (
          <div className="text-center">
            <svg className="w-10 h-10 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-sm text-secondary">Password reset successful!</p>
            <Link to="/login" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">Sign in with new password</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted bg-white outline-none focus:border-text transition-colors"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-text mb-1.5">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted bg-white outline-none focus:border-text transition-colors"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
