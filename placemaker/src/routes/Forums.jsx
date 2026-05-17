import "./Forums.css";
import { useEffect, useState } from "react"; //new import
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"; // new import
import { db, auth } from "../firebase";
import ForumList from "../components/ForumList";
import ForumView from "../components/ForumView";

//Mock info for current user just to see if things work

// removing ALL MOCK INFO to build forums 

// const currentUser = "Alice";

//const mockForums = [
  //  {
    //    id: "nyForum", name: "New York Forum", lastPost: "Wow, this is pretty cool.", lastUser: "Jane Doe", updatedAt: 1712, unread: true,
       // description: "Talk to any and all of your fellow New Yorkers!"},
    //{
      //  id: "localForum", name: "Your Neighborhood Forum", lastPost: "I didn't even know you were in this neighborhood, honestly.", lastUser: "James Smith",
       // updatedAt: 1723, unread: false, description: "Get your message out there to your fellow neighbors!"
    //}
//];

//const mockForumPosts = {
  //  nyForum: [
    //    {
      //      id: "m1",
        //    senderID: "John Doe",
          //  text: "Hey there!",
            //createdAt: 1710
       // },
        //{
         //   id: "m2",
          //  senderID: "Walter Anderson",
           // text: "What's up?",
            //createdAt: 1711
        //},
        //{
         //   id: "m3",
          //  senderID: "Jane Doe",
           // text: "Wow, this is pretty cool.",
            //createdAt: 1712
        //}
    //],
    //localForum: [
    //    {
     //       id: "m4",
      //      senderID: "Penny Taylor",
       //     text: "Do any of you know where my car is?",
       //     createdAt: 1721
       // },
       // {
        //    id: "m5",
        //    senderID: "Alice",
        //    text: "No, actually, I don't.",
        //    createdAt: 1722
        //},
        //{
         //   id: "m6",
         //   senderID: "James Smith",
         //   text: "I didn't even know you were in this neighborhood, honestly.",
         //   createdAt: 1723
       // }
   // ]
//};

export default function Forums() {
    const [forums, setForums] = useState([]);
    const [selectedForumID, setSelectedForumID] = useState(null);
    const [posts, setPosts] = useState([]);

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

    return (
        <main className="forums">
            <div className="forums__forum-list">
                <ForumList forums={forums} onSelectForum={setSelectedForumID} />
            </div>
            <div className="forums__forum-view">
                <ForumView
                selectedForum={posts}
                currentUser={auth.currentUser?.uid}
                selectedForumID={selectedForumID}
                forumDesc={(forums.find(f=>f.id === selectedForumID) || {}).description}
                />
            </div>
        </main> 
    );
}