import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [hostelBlock, setHostelBlock] = useState(user?.hostelBlock || "A Block");
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    try {
      const { data } = await api.put("/auth/updateprofile", { name, hostelBlock, roomNumber });
      updateUser(data);
      setSaved(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-text">Edit Profile</h1>
          <p className="mt-2 text-sm text-secondary">Update your account details.</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</div>
        )}

        {saved && (
          <div className="mb-6 text-sm text-accent bg-accent-light border border-accent/20 rounded-lg px-4 py-2.5">Profile updated!</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Email</label>
            <input
              type="email"
              value={user?.collegeEmail || ""}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-muted bg-surface outline-none cursor-not-allowed"
              disabled
            />
            <p className="mt-1 text-xs text-muted">Email cannot be changed.</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text bg-white outline-none focus:border-text transition-colors"
              required
              minLength={2}
            />
          </div>

          <div>
            <label htmlFor="block" className="block text-sm font-medium text-text mb-1.5">Hostel Block</label>
            <select
              id="block"
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

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-text mb-1.5">Room Number</label>
            <input
              id="room"
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 203"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-text bg-white outline-none focus:border-text transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default EditProfile;
