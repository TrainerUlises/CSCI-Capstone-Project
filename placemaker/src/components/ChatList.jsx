import "./ChatList.css";

export default function ChatList({ chats, onSelectChat, currentUser }) {
    const sortedChats = chats.toSorted((a, b) => b.updatedAt - a.updatedAt);
    return (
        <div>
            {sortedChats.map(chat => {
                const otherUsers = chat.users.filter(
                    user => user !== currentUser
                );

                return (
                    <div
                        className="chat-list__item"
                        key={chat.id}
                        //Console log test to see if onClick worked (it did yippee)
                        /*onClick={() => {*/
                        /*    console.log("Clicked chat:", chat.id);*/
                        /*    onSelectChat(chat.id);*/
                        /*}}*/
                        onClick={() => onSelectChat(chat.id)}
                    >
                        <div className="chat-list__names">
                            {otherUsers.join(", ")}
                        </div>

                        <div className="chat-list__last-message">
                            {chat.lastMessage}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}