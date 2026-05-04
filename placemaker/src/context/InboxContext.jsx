import { createContext, useContext, useMemo, useState } from "react";

//Mock data for testing unread count and loading into ChatList through Inbox
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

const InboxContext = createContext();

export function useInbox() {
    return useContext(InboxContext);
}

export function InboxProvider({ children }) {
    const [chats, setChats] = useState(mockChats);

    const unreadCount = useMemo(() => {
        return chats.filter(chat => !chat.read).length;
    }, [chats]);

    return (
        <InboxContext.Provider value={{ chats, setChats, unreadCount }}>
            {children}
        </InboxContext.Provider>
    );
}