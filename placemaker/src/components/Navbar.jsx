import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import "./components.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logoBox">
          <img src={logo} alt="placemaker logo" />
        </div>
        <Link to="/" className="navbar__title">
          placemaker
        </Link>
      </div>
      {!isLanding && user && (
        <nav className="navbar__links">
          <Link to="feed">Feed</Link>
          <Link to="profile">Profile</Link>
        </nav>
      )}
    </header>
  );
}
