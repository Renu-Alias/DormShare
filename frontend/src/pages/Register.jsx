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
    <>
      <div className="flex justify-center mt-16">

        <div className="w-96 shadow-lg rounded-lg p-8">

          <h2 className="text-3xl font-bold text-center mb-6">
            Register
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="email"
              placeholder="College Email"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded"
              required
              minLength={6}
            />

            <select
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option>A Block</option>
              <option>B Block</option>
              <option>C Block</option>
              <option>D Block</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>

        </div>

      </div>
    </>
  );
}

export default Register;
