import "./ChatView.css";
import { useState } from "react";

//Mock data for loading messages from specific chat
const mockMessages = {
    chat1: [
        {
            id: "m1",
            senderID: "Alice",
            text: "Bye Balice",
            createdAt: 1710
        },
        {
            id: "m2",
            senderID: "Balice",
            text: "See you tomorrow",
            createdAt: 1711
        }
    ],
    chat2: [
        {
            id: "m3",
            senderID: "Alice",
            text: "Did you get the file?",
            createdAt: 1720
        },
        {
            id: "m4",
            senderID: "Calice",
            text: "Yeah, I did, nothing to worry about Alice",
            createdAt: 1721
        },
        {
            id: "m5",
            senderID: "Dalice",
            text: "I too am in this conversation",
            createdAt: 1722
        }
    ],
    chat8: [
        {
            id: "m6",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1728
        },
        {
            id: "m7",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1729
        },
        {
            id: "m8",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1729
        },
        {
            id: "m9",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1730
        },
        {
            id: "m10",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1731
        },
        {
            id: "m11",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1732
        },
        {
            id: "m12",
            senderID: "SpammingGuy",
            text: "I am spamming this message to test the scroll function!",
            createdAt: 1733
        },
        {
            id: "m13",
            senderID: "Alice",
            text: "Dude, shut up.",
            createdAt: 1734
        },
    ]
};

export default function ChatView({ selectedChatID, currentUser }) {
    const chatMessages = mockMessages[selectedChatID] || [];
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
                        <div>{message.senderID == currentUser ? "You" : message.senderID}</div>
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