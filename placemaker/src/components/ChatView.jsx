import "./ChatView.css";
import { useState } from "react";

export default function ChatView({ messages, selectedChatID, currentUser }) {
    const chatMessages = messages[selectedChatID] || [];
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        const trimmedMessage = newMessage.trim();

        if (!trimmedMessage) {
            return;
        }

        //Firestore write here
        console.log("Totally just sent:", trimmedMessage, "to firestore from", selectedChatID);

        setNewMessage("");
    }

    if (selectedChatID == null) {
        return <div className="chat-view__container">Select a chat to view.</div>;
    }

    return (
        <div className="chat-view__container">
            <div className="chat-view__messages">
                {chatMessages.map(message =>
                    <div key={message.id} className={message.senderID == currentUser ? "chat-view__your-message" : "chat-view__other-message"}>
                        <div>{message.senderID}</div>
                        <div>{message.text}</div>
                    </div>
                    )}
            </div>
            <div className="chat-view__input-row">
                <input
                    type="text"
                    className="chat-view__input-field"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type here"
                />
                <button className="chat-view__input-button" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}