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
        updatedAt: 1711,
        read: false
    },
    {
        id: "chat2",
        users: ["Alice", "Calice", "Dalice"],
        lastMessage: "I too am in this conversation",
        updatedAt: 1722,
        read: false

    },
    {
        id: "chat3",
        users: ["Alice", "ScrollingTest"],
        lastMessage: "Used to test scrolling functionality",
        updatedAt: 1723,
        read: false
    },
    {
        id: "chat4",
        users: ["Alice", "ScrollingTest"],
        lastMessage: "Used to test scrolling functionality",
        updatedAt: 1724,
        read: false
    },
    {
        id: "chat5",
        users: ["Alice", "ScrollingTest"],
        lastMessage: "Used to test scrolling functionality",
        updatedAt: 1725,
        read: false
    },
    {
        id: "chat6",
        users: ["Alice", "ScrollingTest"],
        lastMessage: "Used to test scrolling functionality",
        updatedAt: 1726,
        read: false
    },
    {
        id: "chat7",
        users: ["Alice", "ScrollingTest"],
        lastMessage: "Used to test scrolling functionality",
        updatedAt: 1727,
        read: false
    },
    {
        id: "chat8",
        users: ["Alice", "ScrollingTestInChatView"],
        lastMessage: "Used to test scrolling functionality inside ChatView with lotsa messages and junk, also testing wrapping on ChatList items with this stupidly long run-on sentence that should end soon.",
        updatedAt: 1728,
        read: false
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