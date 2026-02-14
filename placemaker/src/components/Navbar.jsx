import { Link } from "react-router-dom";
import "./components.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logoBox" aria-hidden="true">
          
        </div>

        <Link to="/" className="navbar__title">
          placemaker
        </Link>
      </div>
    </header>
  );
}
