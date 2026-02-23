// new imports needed for database
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import Login from './routes/Login'
import Signup from './routes/SignUp'
import Landing from './routes/Landing'

import Post from './components/Post'



function App() {
  //DUMMY FIREBASE TEST CODE
  /*
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
  }*/

  return (
    <>
    {/*<button onClick={testFirestoreWrite}>
        Test Firestore Write
      </button>*/}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/post" element={<Post/>} />
    </Routes>
    </>
  )
}

export default App
