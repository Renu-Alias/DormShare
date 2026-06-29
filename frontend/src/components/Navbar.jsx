import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <Link
          to="/"
          className="text-3xl font-bold text-blue-700"
        >
          DormShare
        </Link>

        <div className="flex gap-8 text-gray-700 font-medium">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/create">Create Listing</Link>
        </div>

        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-gray-700 font-medium hidden md:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="border border-blue-600 px-4 py-2 rounded-lg text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-blue-600 px-4 py-2 rounded-lg text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
