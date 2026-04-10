import './Neighbors.css'
import { React, useState } from "react";

export default function Neighbors() {

    //Swap with firestore data later
    const mockUsers = [
        { id: 1, name: "Alex Rivera", address: "123 3rd Avenue", bio: "Professional botanist that's always down to chat!" },
        { id: 2, name: "John Smith", address: "1724 Baker Street", bio: "I'm a local musician who loves playing down at the park fountain, come by sometime." },
        { id: 3, name: "Emily Hawkins", address: "4252 Jefferson Boulevard", bio: "University student majoring in Economics, I want to help wherever I can." },
        { id: 4, name: "Bill Jameson", address: "6524 Kensington Lane", bio: "Architect and urban planning nerd, would love to discuss city design." },
        { id: 5, name: "Petra Chambers", address: "2232 21st Street", bio: "Personal chef and hobby artist, if you ever need any pointers on cooking or painting, you know where to go!"}
    ];

    //Search bar functionality
    const [search, setSearch] = useState("");
    const filteredUsers = mockUsers.filter(user => user.name.toLowerCase().includes(search.toLowerCase())
        || user.address.toLowerCase().includes(search.toLowerCase()));

    return (<>
        <main className="neighbors">
            <div className="neighbors__container">
                <h1 className="neighbors__list-header">Your Neighbors</h1>
                <h2 className="neighbors__list-subheader">{mockUsers.length} neighbors near you</h2>
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
                            //This basically just the ProfileView card with its respective css imported and streamlined a bit into the neighbors css file,
                            // once we get all the firestore stuff working might go back and turn the top profile card from there into an exportable component instead
                            <div className="neighbors__card" key={user.id}>
                                <div className="avatar">
                                    {initials}
                                </div>

                                <div className="neighbors__info">
                                    <h2 className="neighbors__name">{user.name}</h2>

                                    <div className="neighbors__info-line">
                                        📍{user.address}
                                    </div>

                                    <div className="neighbors__info-line">
                                            {user.bio}
                                    </div>

                                    <button type="button" className="neighbors__button">View Profile</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    </>)
}