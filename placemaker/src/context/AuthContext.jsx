import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Create a global authentication context
const AuthContext = createContext();

// Custom hook so components can easily access auth data
export function useAuth() {
    return useContext(AuthContext);
}

// Provider component that wraps the app
export function AuthProvider({ children }) {

    // Holds the currently authenticated user
    const [user, setUser] = useState(null);

    // Prevents rendering until Firebase checks auth state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // this will run whenever login state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);   // Store user (or null if logged out)
            setLoading(false);      // Auth check complete
        });

        // Cleanup listener when component unmounts
        return () => unsubscribe();
    }, []);

    //newly logout function
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error){
            console.error("Issue logging out: ", error);
        }
    };

    // Value shared across placemaker
    const value = {
        user,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* this will render app */}
            {!loading && children}
        </AuthContext.Provider>
    );
}
