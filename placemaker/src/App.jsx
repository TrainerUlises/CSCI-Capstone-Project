// new imports needed for database
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
/*import { useEffect } from "react";*/

import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import './App.css'
import Signup from './routes/Signup'



function App() {
  //DUMMY CODE
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
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    </>
  )
}

export default App
