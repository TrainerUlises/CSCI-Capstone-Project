import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./components.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Logout function
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__brand">
        <Link to={user ? "/feed" : "/"} className="navbar__logoBox">
          <img src={logo} alt="placemaker logo" />
        </Link>
      </div>

      {/* Right Side Navigation */}
      <nav className="navbar__pill">
        {!user && (
          <Link
            to="/login"
            className={`navbar__pill-signin ${isActive("/login") ? "active" : ""}`}
          >
            Log In
          </Link>
        )}

        {user && (
          <>
            <Link
              to="/feed"
              className={`navbar__pill-item ${isActive("/feed") ? "active" : ""}`}
            >
              Feed
            </Link>

            <Link
              to="/explore"
              className={`navbar__pill-item ${isActive("/explore") ? "active" : ""}`}
            >
              Explore
            </Link>

            <Link
              to="/neighbors"
              className={`navbar__pill-item ${isActive("/neighbors") ? "active" : ""}`}
            >
              Neighbors
            </Link>

            <Link
              to="/profile"
              className={`navbar__pill-item ${isActive("/profile") ? "active" : ""}`}
            >
              Profile
            </Link>

            {/* Added a sign out Button */}
            <button
              onClick={handleLogout}
              className="navbar__pill-item navbar__logout"
            >
              Sign Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
