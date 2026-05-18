import './Neighbors.css'
import './ProfileView.css'
import { React, useState, useEffect } from "react";
import { db, auth } from "../firebase"; // adjust path
import { collection, query, where, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Neighbors() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNeighbors = async () => {
            try {
                const currentUser = auth.currentUser;
                

                if (!currentUser) return;

                // assume zipCode is stored on user doc OR auth custom claim
                const userDocRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userDocRef);

                if (!userSnap.exists()) return;

                const userData = userSnap.data();

                if (userData.isBanned) {
                    alert("Your account has been restricted.");
                    await auth.signOut();
                    navigate("/login");
                    return;
                }
                
                const currentZip = userData.zipCode;
                setIsAdmin(userData.isAdmin === true);

                //const currentZip = userSnap.data().zipCode;
                //if (!currentZip) return;

                // get users with same zipCode
                const q = query(
                    collection(db, "users"),
                    where("zipCode", "==", currentZip)
                );

                const snapshot = await getDocs(q);

                const usersList = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(user => user.id !== currentUser.uid);

                setUsers(usersList);
                setZipCode(currentZip);

            } catch (err) {
                console.error("Error fetching neighbors:", err);
            }
        };

        fetchNeighbors();
    }, []);

    
    const filteredUsers = users.filter(user => 
        (user.name || "").toLowerCase().includes(search.toLowerCase()));

    const toggleBanStatus = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, "users", userId);
    
            await updateDoc(userRef, {
                isBanned: !currentStatus
            });
    
            // update UI immediately
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, isBanned: !currentStatus }
                        : user
                )
            );
    
        } catch (err) {
            console.error("Error updating ban status:", err);
        }
    };

    return (<>
        <main className="neighbors">
            <div className="neighbors__container">
            <h1 className="neighbors__list-header">Your Neighbors in 📍{zipCode}</h1>
                <h2 className="neighbors__list-subheader">
                    {users.length} neighbors near you
                </h2>

                <button
                    type="button"
                    className="neighbors__forum-button"
                    onClick={() => {
                        navigate("/forums");
                    }}
                >
                    Go to Community Forums
                </button>
                <div className="neighbors__search-bar-container">
                    🔍
                    <input
                        className="neighbors__search-bar"
                        type="text"
                        placeholder="Search by name"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="neighbors__map-container">
                    {filteredUsers.map((user) => {
                        const initials = user?.name
                        ? user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0]?.toUpperCase())
                            .join("")
                        : "";
                        return (
                            //This basically just the ProfileView card with its respective css imported and streamlined a bit into the neighbors css file
                            <div className="neighbors__card" key={user.id}>
                                <div className="avatar">
                                    {user.photoURL ? (
                                        <img
                                        src={user.photoURL}
                                        alt={user.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                        />
                                    ) : (
                                        initials
                                    )}
                                    </div>

                                <div className="neighbors__info">
                                    <h2 className="neighbors__name">{user.name}</h2>
                                    <div className="availabilityStatus">
                                        {user.isAvailable ? (
                                            <span className="available">Available</span>
                                        ) : (
                                            <span className="notAvailable">Not Available</span>
                                        )}
                                    </div>

                                    <div className="neighbors__info-line">
                                        📧 {user.email}
                                    </div>

                                    <div className="neighbors__info-line">
                                            {user.bio}
                                    </div>
                                {isAdmin && (
                                    <button
                                        className="neighbors__restrict-button"
                                        onClick={() => toggleBanStatus(user.id, user.isBanned)}
                                    >
                                        {user.isBanned ? "Unrestrict User" : "Restrict User"}
                                    </button>
                                )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    </>)
}