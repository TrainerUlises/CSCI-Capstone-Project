import './Neighbors.css'
import { React, useState, useEffect } from "react";
import { db, auth } from "../firebase"; // adjust path
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";

export default function Neighbors() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchNeighbors = async () => {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) return;

                // assume zipCode is stored on user doc OR auth custom claim
                const userDocRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userDocRef);

                if (!userSnap.exists()) return;

                const currentZip = userSnap.data().zipCode;
                //if (!currentZip) return;

                // get users with same zipCode
                const q = query(
                    collection(db, "users"),
                    where("zipCode", "==", currentZip)
                );

                const snapshot = await getDocs(q);

                const usersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log("Neighbors:", usersList);

                setUsers(usersList);

            } catch (err) {
                console.error("Error fetching neighbors:", err);
            }
        };

        fetchNeighbors();
    }, []);

    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()));

    return (<>
        <main className="neighbors">
            <div className="neighbors__container">
                <h1 className="neighbors__list-header">Your Neighbors</h1>
                <h2 className="neighbors__list-subheader">{users.length} neighbors near you</h2>
                <div className="neighbors__search-bar-container">
                    🔍
                    <input
                        className="neighbors__search-bar"
                        type="text"
                        placeholder="Search by name or address"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="neighbors__map-container">
                    {filteredUsers.map((user) => {
                        const initials = user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0]?.toUpperCase())
                            .join("");

                        return (
                            //This basically just the ProfileView card with its respective css imported and streamlined a bit into the neighbors css file
                            <div className="neighbors__card" key={user.id}>
                                <div className="avatar">
                                    {initials}
                                </div>

                                <div className="neighbors__info">
                                    <h2 className="neighbors__name">{user.name}</h2>

                                    <div className="neighbors__info-line">
                                        📧 {user.email}
                                    </div>

                                    <div className="neighbors__info-line">
                                            {user.bio}
                                    </div>

                                    <button type="button" className="neighbors__button" onClick={function() { navigate( `/profile/${user.id}` ); }}
                                    >View Profile</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    </>)
}