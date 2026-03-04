import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Landing()
{
  const { user, logout } = useAuth();

  return (
    <div>
      <Navbar />

      <br />

      <div>
        {/* will display who's logged on */}
        <p>Welcome: {user?.email}</p>

        <br />

        <button onClick={logout}>
          Logout
        </button>

        <br /><br />

        <Link to="/signup">Sign Up Today!</Link>
      </div>
    </div>
  );
}