import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./components.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logoBox">
          <img src={logo} alt="placemaker logo" />
        </div>
        <Link to="/feed" className="navbar__title">
          placemaker
        </Link>
      </div>
      {!isLanding && user && (
        <nav className="navbar__links">
          <Link to="/feed">Feed</Link>
          <Link to="/neighbors">Neighbors</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      )}
    </header>
  );
}
