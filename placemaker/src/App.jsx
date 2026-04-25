// new imports needed for database
import ProtectedRoute from "./components/ProtectedRoute";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './routes/Home'
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext"; // AuthContext import

import Login from './routes/Login'
import Signup from './routes/Signup'
import Post from './components/Post' // leave just to test post component
import Profile from './routes/ProfileView'
import FeedView from './routes/FeedView'
import Navbar from "./components/Navbar";
import Neighbors from "./routes/Neighbors"
import Landing from './routes/Landing'

import ProfileSettings from './routes/ProfileSettings'

import ExploreView from "./routes/ExploreView"; // new import

import Inbox from "./routes/Inbox";


function App() {
  //DUMMY FIREBASE TEST CODE
  /*
function App() {

  // Get global authenticated user from AuthContext
  const { user } = useAuth();

  // Log user whenever authentication state changes
  useEffect(() => {
    console.log("Global User:", user);
  }, [user]);

  // TEST Firestore test function
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
  
  const { user } = useAuth();
  return (
    <>
    {/*<button onClick={testFirestoreWrite}>
        Test Firestore Write
      </button>*/}
    <Navbar />
    <Routes>
      <Route 
        path="/" element={user ? <Navigate to="/feed" replace /> : <Landing />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/*<Route path="/post" element={<Post/>} />*/}
      <Route path="/neighbors" element={<Neighbors />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
      <Route path="/inbox" element={<Inbox />} />
      {/*<Route path="/feed" element={<FeedView/>} />*/}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        } 
        />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedView />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/explore"
        element={
          <ProtectedRoute>
            <ExploreView/>
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;
