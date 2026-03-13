import "./Login.css"; // reusing styling

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 

import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import AddressAutocomplete from "../components/AddressAutocomplete";

export default function Signup() {
   const navigate = useNavigate();

    const [name, setName] = useState("");
    const [address1, setAddress1] = useState("");
    const [email, setEmail] = useState("");
    const [address2, setAddress2] = useState("");
    const [password, setPassword] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [dob, setDOB] = useState("");
    const [error, setError] = useState("");
    const [locationData, setLocationData] = useState({
        formattedAddress: "",
        placeId: "",
        lat: null,
        lng: null,
        zipCode: "",
        neighborhood: "",
        locality: "",
        adminAreaLevel1: "",
    });

    function handleAddressSelected(location) {
        console.log("Selected address:", location);
        setAddress1(location.formattedAddress || "");
        setZipCode(location.zipCode || "");
        setLocationData({
            formattedAddress: location.formattedAddress || "",
            placeId: location.placeId || "",
            lat: location.lat ?? null,
            lng: location.lng ?? null,
            zipCode: location.zipCode || "",
            neighborhood: location.neighborhood || "",
            locality: location.locality || "",
            adminAreaLevel1: location.adminAreaLevel1 || "",
        });
    }

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
                name: name,
                email: user.email,
                addressLine1: address1,
                addressLine2: address2,
                dateOfBirth: dob,
                zipCode: zipCode,
                location: {
                    formattedAddress: locationData.formattedAddress,
                    placeId: locationData.placeId,
                    lat: locationData.lat,
                    lng: locationData.lng,
                    zipCode: locationData.zipCode,
                    neighborhood: locationData.neighborhood,
                    locality: locationData.locality,
                    adminAreaLevel1: locationData.adminAreaLevel1,
                },
                createdAt: serverTimestamp(),
            });


            console.log("User successfully created");


            // Redirect to feed if signup is successful
            navigate("/feed");


        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }


    return (
        <div>
            <main className="login">
                <div className="login__container">
                    <h1 className="login__heading">Sign Up Here</h1>


                    <section className="login__card">
                        <form className="form" onSubmit={handleSignup}>


                            <div className="form__row">
                                <div className="form__group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        className="form__input"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>


                                <div className="form__group">
                                    <label htmlFor="address1">Address Line 1</label>
                                    {/*<input
                                        id="address1"
                                        className="form__input"
                                        type="text"
                                        value={address1}
                                        onChange={(e) => setAddress1(e.target.value)}
                                        required
                                    />*/}
                                    <AddressAutocomplete onAddressSelected={handleAddressSelected} />
                                </div>
                            </div>


                            <div className="form__row">
                                <div className="form__group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        className="form__input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>


                                <div className="form__group">
                                    <label htmlFor="address2">Address Line 2 (Optional)</label>
                                    <input
                                        id="address2"
                                        className="form__input"
                                        type="text"
                                        value={address2}
                                        onChange={(e) => setAddress2(e.target.value)}
                                    />
                                </div>
                            </div>


                            <div className="form__row">
                                <div className="form__group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        className="form__input"
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>


                                <div className="form__group">
                                    <label htmlFor="zipCode">ZIP Code</label>
                                    <input
                                        id="zipCode"
                                        className="form__input"
                                        type="text"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>




                            {error && (
                                <p style={{ color: "red", fontSize: "14px" }}>
                                    {error}
                                </p>
                            )}


                            <div className="form__row">
                                <div className="form__group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input
                                        id="dob"
                                        className="form__dateInput"
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDOB(e.target.value)}
                                        required
                                    />
                                </div>


                                <div className="form__actions">
                                    <button
                                        type="submit"
                                        className="form__button--small"
                                    >
                                        Create Account Today!
                                    </button>
                                </div>
                            </div>
                            <div style={{ textAlign: "center", marginTop: "16px"}}>
                                <span style={{ fontSize: "14px"}}>
                                    Already have an account?{" "}
                                    <Link to="/login" className="form__link">
                                        Log in here!
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
