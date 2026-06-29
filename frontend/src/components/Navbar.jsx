import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-accent" : "text-slate-600 hover:text-slate-900"}`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          DormShare
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={linkClass}>Home</Link>
          <Link to="/marketplace" className={linkClass}>Marketplace</Link>
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
          <Link to="/create" className={linkClass}>Create</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-500 hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 rounded-md border border-border text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-1.5 rounded-md border border-border text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-md bg-accent text-white hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
