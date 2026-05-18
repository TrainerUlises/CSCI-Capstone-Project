import "./Forums.css";
import { useEffect, useState } from "react"; //new import
import { collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore"; // new import
import { db, auth } from "../firebase";
import ForumList from "../components/ForumList";
import ForumView from "../components/ForumView";

export default function Forums() {
    const [forums, setForums] = useState([]);
    const [selectedForumID, setSelectedForumID] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);

    // new useEffect for live Firestore forums

    useEffect(() => {
        const q = query(
            collection(db, "forums"),
            orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) =>{
            const forumList = snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    ...doc.data()
                }));
                setForums(forumList);
        });
        return () => unsubscribe();
    }, []);

    // new useEffect that will wait until a forum is selected, listens to it in real time, updates in real time

    useEffect(() => {
        if(!selectedForumID) return;

        const q = query(
            collection(db, "forums", selectedForumID, "posts"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postList);
        });
        return () => unsubscribe();
    }, [selectedForumID]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!auth.currentUser) return;
    
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
    
            if (userSnap.exists()) {
                setCurrentUserData({
                    uid: auth.currentUser.uid,
                    ...userSnap.data(),
                });
            }
        };
    
        fetchCurrentUser();
    }, []);

    return (
        <main className="forums">
            <div className="forums__forum-list">
                <ForumList forums={forums} onSelectForum={setSelectedForumID} />
            </div>
            <div className="forums__forum-view">
                <ForumView
                selectedForum={posts}
                currentUser={currentUserData}
                selectedForumID={selectedForumID}
                forumDesc={(forums.find(f=>f.id === selectedForumID) || {}).description}
                />
            </div>
        </main> 
    );
}