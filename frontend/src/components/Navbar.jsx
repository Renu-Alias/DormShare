import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/create", label: "Create" },
  ];

  const linkClass = (to) =>
    `relative px-3 py-1 text-sm transition-colors ${
      isActive(to)
        ? "text-accent font-medium after:absolute after:bottom-[-4px] after:left-3 after:right-3 after:h-[2px] after:bg-accent after:rounded-full"
        : "text-secondary hover:text-text"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 h-16">

        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img src="/logo.png" alt="DormShare" className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105" />
          <span className="text-xl font-bold tracking-tight text-text">DormShare</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass(to)}>
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2.5 pr-3 pl-1 py-1 rounded-full border border-border bg-white">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm text-secondary">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-muted hover:text-text transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-secondary hover:text-text transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-5 py-2 rounded-full bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 -mr-2 rounded-lg text-secondary hover:text-text hover:bg-surface transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-8 py-4 space-y-2">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  isActive(to)
                    ? "bg-accent-light text-accent font-medium"
                    : "text-secondary hover:text-text hover:bg-surface"
                }`}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="flex items-center gap-2.5 px-4 py-2 text-sm text-secondary border-t border-border pt-3 mt-2">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-surface rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 border-t border-border pt-3 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm rounded-full border border-border text-secondary hover:bg-surface transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
