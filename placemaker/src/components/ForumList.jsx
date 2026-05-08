import "./ForumList.css";

export default function ForumList({ forums, onSelectForum }) {
    const sortedForums = forums.toSorted((a, b) => b.updatedAt - a.updatedAt);
    return (
        <div>
            {sortedForums.map(forum => (
                    <div
                        className="forum-list__item"
                        key={forum.id}
                        onClick={() => onSelectForum(forum.id)}
                    >
                        <div className="forum-list__title">
                            {forum.name}
                            {/*The jumble of text down there in notif-badge is the unicode for a monochrome bell*/}
                            {forum.unread && (<span className={`forum-list__notif-badge ${forum.unread ? "" : "--read"}`}>&#128276;&#xFE0E;</span>)}
                        </div>

                        <div className="forum-list__last-post">
                            {forum.lastUser && forum.lastPost ? `${forum.lastUser}: ${forum.lastPost}` : "No posts yet..."}
                        </div>
                    </div>
            ))}
            <div className="forum-list__item">
                <div className="forum-list__title">
                    More to come...
                </div>
            </div>
        </div>
    );
}