import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
//import "./Landing.css";

export default function Landing() {
  return (
    <div>
      <Navbar />
        <br></br>
          <div>
            <Link to="/login">
              Log In
            </Link>
            <br></br>
            <br></br>
            <Link to="/signup">
              Sign Up
            </Link>
          </div>
    </div>
  );
}