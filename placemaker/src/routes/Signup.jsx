import "./Login.css"; // reusing styling


import { useState } from "react";
import { useNavigate } from "react-router-dom";


import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


export default function Signup() {


   const navigate = useNavigate();


   // form state
   const [name, setName] = useState("");
   const [address1, setAddress1] = useState("");
   const [email, setEmail] = useState("");
   const [address2, setAddress2] = useState("");
   const [password, setPassword] = useState("");
   const [zipCode, setZipCode] = useState("");
   const [dob, setDOB] = useState("");
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
               name: name,
               email: user.email,
               addressLine1: address1,
               addressLine2: address2,
               dateOfBirth: dob,
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
                                       type="name"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                       required
                                   />
                               </div>


                               <div className="form__group">
                                   <label htmlFor="address1">Address Line 1</label>
                                   <input
                                       id="address1"
                                       className="form__input"
                                       type="text"
                                       value={address1}
                                       onChange={(e) => setAddress1(e.target.value)}
                                       required
                                   />
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


                       </form>
                   </section>
               </div>
           </main>
       </div>
   );
}
