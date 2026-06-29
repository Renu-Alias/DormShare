import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostelBlock, setHostelBlock] = useState("A Block");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ name, collegeEmail, password, hostelBlock });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="text-base font-semibold tracking-tight text-text">DormShare</Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-text">Create an account</h1>
          <p className="mt-2 text-sm text-secondary">Join your campus marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted bg-white outline-none focus:border-text transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">College Email</label>
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
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted bg-white outline-none focus:border-text transition-colors"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="hostel" className="block text-sm font-medium text-text mb-1.5">Hostel Block</label>
            <select
              id="hostel"
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text bg-white outline-none focus:border-text transition-colors"
            >
              <option>A Block</option>
              <option>B Block</option>
              <option>C Block</option>
              <option>D Block</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-text hover:opacity-70 transition-opacity">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
