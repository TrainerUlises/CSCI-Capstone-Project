import "./Inbox.css";
import { useState } from "react";
import { useInbox } from "../context/InboxContext";
import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";

//Mock info for current user just to see if things work
const currentUser = "Alice";

export default function Inbox() {
    const [selectedChatID, setSelectedChatID] = useState(null); 
    const { chats } = useInbox();

    return (
        <main className="inbox">
            <div className="inbox__chat-list">
                <ChatList chats={chats} onSelectChat={setSelectedChatID} currentUser={currentUser} />
            </div>
            <div className="inbox__chat-view">
                <ChatView selectedChatID={selectedChatID} currentUser={currentUser} />
            </div>
        </main>
    );
}