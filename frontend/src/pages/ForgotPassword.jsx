import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [collegeEmail, setCollegeEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgotpassword", { collegeEmail });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="text-base font-semibold tracking-tight text-text">DormShare</Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-text">Forgot password?</h1>
          <p className="mt-2 text-sm text-secondary">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center">
            <svg className="w-10 h-10 text-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-sm text-secondary">If that email is registered, you'll receive a password reset link shortly.</p>
            <Link to="/login" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">Back to sign in</Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-secondary">
          <Link to="/login" className="font-medium text-text hover:opacity-70 transition-opacity">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
