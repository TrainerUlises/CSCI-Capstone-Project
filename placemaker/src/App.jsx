// new imports needed for database
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext"; // 🔐 AuthContext import

import Login from './routes/Login'
import Signup from './routes/Signup'
import Landing from './routes/Landing'

function App() {

  // get global authenticated user
  const { user } = useAuth();

  // Log user whenever auth state changes
  useEffect(() => {
    console.log("Global User:", user);
  }, [user]);

  // DUMMY CODE (Firestore test)
  async function testFirestoreWrite() {
    try {
      const docRef = await addDoc(collection(db, "test"), {
        message: "Hello from Placemaker 👋",
        createdAt: serverTimestamp(),
      });

      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }

  return (
    <>
      <button onClick={testFirestoreWrite}>
        Test Firestore Write
      </button>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App