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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
            DormShare
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">Create an account</h1>
          <p className="mt-1 text-sm text-slate-500">Join your campus marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              College Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="hostel" className="block text-sm font-medium text-slate-700 mb-1">
              Hostel Block
            </label>
            <select
              id="hostel"
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow"
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
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
