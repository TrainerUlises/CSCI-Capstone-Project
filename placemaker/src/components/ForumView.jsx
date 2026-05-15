import "./ForumView.css";
import { useState } from "react";
import { db } from "../firebase"; // new import for forums
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // new import for forums
import { auth } from "../firebase"; // test


export default function ForumView({ selectedForum, currentUser, selectedForumID, forumDesc }) {
    const [newPost, setNewPost] = useState("");

    const handleSend = async () => {
        const trimmedMessage = newPost.trim();
        if (!trimmedMessage) return; // base case
        //Firestore write here
        //console.log(currentUser, "totally just sent: (", trimmedMessage, ") to firestore from", selectedForumID);

        console.log("AUTH UID:", auth.currentUser?.uid);
        console.log("currentUser prop:", currentUser);

        try {
            await addDoc(
                collection(db, "forums", selectedForumID, "posts"),
                {
                    text: trimmedMessage,
                    senderID: currentUser,
                    createdAt: serverTimestamp(),
                }
            );
        setNewPost("");
    } catch (error) 
    {
        console.error("ERROR SENDING MESSAGE!!!", error);
    }
    };
    if (selectedForum.length == 0) {
        return <div className="forum-view__container">Select a forum to view.</div>;
    }

    return (
        <div className="forum-view__container">
            <div className="forum-view__desc">{forumDesc}</div>
            <div className="forum-view__post-list">
                {selectedForum.map((post) => (
                    <div key={post.id} className="forum-view__post">
                        <div>{post.senderID == currentUser ? `${post.senderID} (You)` : post.senderID}</div>
                        <div>{post.text}</div>
                    </div>
                ))}
            </div>
            <div className="forum-view__input-row">
                <input
                    type="text"
                    className="forum-view__input-field"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Type here"
                />
                <button className="forum-view__input-button" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
