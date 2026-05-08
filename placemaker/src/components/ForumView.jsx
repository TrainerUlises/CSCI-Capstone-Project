import "./ForumView.css";
import { useState } from "react";


export default function ForumView({ selectedForum, currentUser, selectedForumID, forumDesc }) {
    const [newPost, setNewPost] = useState("");

    const handleSend = () => {
        const trimmedMessage = newPost.trim();

        if (!trimmedMessage) {
            return;
        }

        //Firestore write here
        console.log(currentUser, "totally just sent: (", trimmedMessage, ") to firestore from", selectedForumID);

        setNewPost("");
    }

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