import Navbar from '../components/Navbar.jsx';
import "./Login.css"; // reusing styling

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {

    const navigate = useNavigate();

    // form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [error, setError] = useState("");

    // handle signup
    async function handleSignup(e) {
        e.preventDefault();
        setError("");

        try {
            // Creating Auth user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Creating Firestore user document
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                zipCode: zipCode,
                createdAt: serverTimestamp(),
            });

            console.log("User successfully created");

            // Redirect to login
            navigate("/");

        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    return (
        <div>
            <Navbar />

            <main className="login">
                <div className="login_container">
                    <h1 className="login_heading">Sign Up Here</h1>

                    <section className="login_card">
                        <form className="form" onSubmit={handleSignup}>

                            <div className="form_group">
                                <input 
                                    className="form_input"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form_group">
                                <input 
                                    className="form_input"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form_group">
                                <input 
                                    className="form_input"
                                    type="text"
                                    placeholder="ZIP Code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "red", fontSize: "14px" }}>
                                    {error}
                                </p>
                            )}

                            <div className="form_actions">
                                <button 
                                    type="submit" 
                                    className="form_button"
                                >
                                    Create Account Today!
                                </button>
                            </div>

                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
