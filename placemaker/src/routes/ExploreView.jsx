import "./FeedView.css";
import { useMemo, useState } from "react";
import CreatePostBox from "./CreatePostBox";
import Post from "../components/Post";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { onSnapshot, query, orderBy, where } from "firebase/firestore"; // modifying import to match user zipcodes

const FILTERS = ["All", "Needs Aid", "Offering Aid", "Donation/Swap", "Other", "Urgent"];

const TYPE_CLASS = {
    "Needs Aid": "needsaid",
    "Offering Aid": "offeraid",
    "Donation/Swap": "donationswap",
    "Other": "other",
  };
  

function matchesFilter(post, activeFilter) {
  if (activeFilter === "All") return true;
  if (activeFilter === "Urgent") return post.urgent === true;
  return post.type === activeFilter;
}

function normalizePostType(type) {
  if (type === "Request Aid") return "Needs Aid";
  if (type === "Offer Aid") return "Offering Aid";
  return type || "Other";
}

export default function FeedView() {
  async function handleCreatePost(postData) {
    const firebaseUser = auth.currentUser;
  
    if (!firebaseUser) {
      throw new Error("No logged-in user found.");
    }
  
    // get the user document using UID
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }
  
    const userData = userSnap.data();
  
    await addDoc(collection(db, "posts"), {
      userId: firebaseUser.uid,
      type: postData.type || "Other",
      urgent: postData.urgent ?? false,
      title: postData.title,
      body: postData.body,
    
      authorName: userData.name || "Unknown User",
      zipCode: postData.locationPrivate?.zipCode || userData.zipCode || "",
    
      timestamp: serverTimestamp(),
      neededBy: postData.neededBy || "",
      imageUrl: postData.imageUrl || "",
    
      locationPublic: postData.locationPublic || null,
      locationPrivate: postData.locationPrivate || null,
    });
  }

  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]); // real posts
  const { user } = useAuth(); // real time render
  const [userData, setUserData] = useState(null);
  const urgentCount = posts.filter(p => p.urgent).length;

  //adding real time firestore listener
  // functionality
  // listens to post collections
  // orders by newest first
  // converts firestore time
  // updates in real time


  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const normalizedType = normalizePostType(data.type);
  
        return {
          id: doc.id,
          ...data,
          type: normalizedType,
          time: data.timestamp?.toDate
            ? data.timestamp.toDate().toLocaleString()
            : "Just now",
          author: {
            name: data.authorName,
            initials: data.authorName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
          },
          locationPublic: data.locationPublic || null,
          details: {
            neededBy: data.neededBy,
          },
        };
      });
  
      setPosts(fetchedPosts);
    });
  
    return () => unsubscribe();
  }, []);
  


  //will fetch real logged-in uder info
  useEffect(() => {
    if (!user) return;
  
    const fetchUser = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUser();
  }, [user]);
  

  /*const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((p) => matchesFilter(p, activeFilter));
  }, [activeFilter]);*/ //updating this!

  // replacing mock_posts with real posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => matchesFilter(p, activeFilter));
  }, [posts, activeFilter]);

  return (
    <div className="feedPage">
      <div className="feedWrap">
        <div className="feedHero">
          <div className="feedHeroTop">
          <h1>
            Welcome back, {userData?.name || "Neighbor"}
          </h1>

          <p>
            Your residency on{" "}
            <strong>{userData?.addressLine1 || "your block"}</strong>
          </p>

          </div>

          <div className="feedHeroChips">
            <span className="chip chip-soft">
            {urgentCount} urgent {urgentCount === 1 ? "need" : "needs"}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="feedFilters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filterPill ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
              type="button"
            >
              {f}
            </button>
          ))}
        </div>

        <CreatePostBox
          onCreatePost={handleCreatePost}
        />

        <div className="feedGrid">
          {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}