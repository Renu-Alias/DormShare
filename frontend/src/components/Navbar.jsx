import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = "text-sm text-secondary hover:text-text transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 h-16">
        <Link to="/" className="text-base font-semibold tracking-tight text-text">
          DormShare
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className={linkClass}>Home</Link>
          <Link to="/marketplace" className={linkClass}>Marketplace</Link>
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
          <Link to="/create" className={linkClass}>Create</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-secondary hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-1.5 rounded-full border border-border text-secondary hover:bg-surface hover:text-text transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
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
