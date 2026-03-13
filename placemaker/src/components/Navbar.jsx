import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./components.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path; 

  return (
    <header className="navbar">
      {/*Logo only */}
      <div className="navbar__brand">
        <Link to={user ? "/feed" : "/"} className="navbar__logoBox">
        <img src={logo} alt="placemaker logo" />
        </Link>
      </div>
      {/* Right: Pill nav */}
      <nav className="navbar__pill">
        {!user && (
          <Link
            to="/login"
            className={`navbar__pill-signin ${isActive("/login") ? "active" : ""}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Log In
          </Link>
        )}
        {user && (
          <>
        <Link to="/feed" className={`navbar__pill-item ${isActive("/feed") ? "active" : ""}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Feed
        </Link>
 
        <Link to="/neighbors" className={`navbar__pill-item ${isActive("/neighbors") ? "active" : ""}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Neighbors
        </Link>
 
        <Link to="/profile" className={`navbar__pill-item ${isActive("/profile") ? "active" : ""}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </Link>
        </>
        )}
      </nav>
    </header>
  );
}