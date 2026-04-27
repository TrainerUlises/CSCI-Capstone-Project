import "./Inbox.css";
import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";

//Mock data, unsure how Firestore will do it but hopefully this is close
const currentUser = "Alice";

const mockChats = [
    {
        id: "chat1",
        users: ["Alice", "Balice"],
        lastMessage: "See you tomorrow",
        updatedAt: 1711
    },
    {
        id: "chat2",
        users: ["Alice", "Calice", "Dalice"],
        lastMessage: "I too am in this conversation",
        updatedAt: 1722
    }
];

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
    ]
};

export default function Inbox() {
    const [selectedChatID, setSelectedChatID] = useState(null);

    return (
        <main className="inbox">
            <div className="inbox__chat-list">
                <ChatList chats={mockChats} onSelectChat={setSelectedChatID} currentUser={currentUser} />
            </div>
            <div className="inbox__chat-view">
                <ChatView messages={mockMessages} selectedChatID={selectedChatID} currentUser={currentUser} />
            </div>
        </main>
    );
}