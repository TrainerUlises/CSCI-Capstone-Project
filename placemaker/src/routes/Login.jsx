import "./Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {

    // form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // handle login
    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            //Authenticating user
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            console.log("✅ AUTH SUCCESS");
            console.log("UID:", user.uid);
            console.log("Email:", user.email);

            // Verifying Firestore document exists
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                console.log("✅ FIRESTORE USER FOUND");
                console.log("User Data:", userDocSnap.data());
            } else {
                console.log("⚠️ No Firestore user document found.");
            }

            // No redirect yet we will create dashboard later
            // navigate("/");

        } catch (err) {
            console.error(" LOGIN FAILED:", err.message);
            setError("Invalid email or password.");
        }
    }

    return (
        <div>
            <main className="login">
                <div className="login__container">
                    <h1 className="login__heading">Log In</h1>

                    <section className="login__card">
                        <form className="form" onSubmit={handleLogin}>

                            <div className="form__group">
                                <input 
                                    className="form__input"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <input 
                                    className="form__input"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "red", fontSize: "14px" }}>
                                    {error}
                                </p>
                            )}

                            <div className="form__actions">
                                <button 
                                    type="submit"
                                    className="form__button"
                                >
                                    Log In
                                </button>
                            </div>

                            <div style={{ textAlign: "center", marginTop: "16px"}}>
                                <span style={{ fontSize: "14px"}}>
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="form__link">
                                        Sign up here today!
                                    </Link>
                                </span>
                            </div>

                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
