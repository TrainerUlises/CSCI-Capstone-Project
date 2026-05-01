import { createContext, useContext, useMemo, useState } from "react";

const InboxContext = createContext();

export function useInbox() {
    return useContext(InboxContext);
}

export function InboxProvider({children}) {
    //Mock data for the unread count, change with Firestore reading later
    const [unreadCount, setUnreadCount] = useState(10);

    const value = useMemo(() => ({ unreadCount, setUnreadCount }), [unreadCount]);

    return (
        <InboxContext.Provider value={value}>
            {children}
        </InboxContext.Provider>
    );
}