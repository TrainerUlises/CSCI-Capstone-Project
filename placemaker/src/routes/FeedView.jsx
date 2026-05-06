import "./FeedView.css";
import { useMemo, useState } from "react";
import CreatePostBox from "./CreatePostBox";
import Post from "../components/Post";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { onSnapshot, query, orderBy, where } from "firebase/firestore"; // modifying import to match user zipcodes
import { toast } from "react-hot-toast";

const FILTERS = ["All", "Needs Aid", "Offering Aid", "Donation/Swap", "Other", "Urgent", "Removed"];

const TYPE_CLASS = {
    "Needs Aid": "needsaid",
    "Offering Aid": "offeraid",
    "Donation/Swap": "donationswap",
    "Other": "other",
  };
  

function matchesFilter(post, activeFilter) {
  if (activeFilter === "All") return true;
  if (activeFilter === "Urgent") return post.urgent === true;
  if (activeFilter === "Removed") return post.isRemoved === true;
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
      isRemoved: false,
    
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
    // Waiting until userData displays and has a valid zipCode
    if (!userData?.zipCode) return;
  
    const q = query(
      collection(db, "posts"),
      where("zipCode", "==", userData.zipCode), // Filter by user's zip
      orderBy("timestamp", "desc") // Sort newest first
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const normalizedType = normalizePostType(data.type);
  
        return {
          id: doc.id,
          ...data,
          isAdmin: data.isAdmin || false,
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
  }, [userData]);
  


  //will fetch real logged-in user info
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
    return posts.filter((p) => {
      // If "Removed" tab → only show removed (admin only)
      if (activeFilter === "Removed") {
        return userData?.isAdmin && p.isRemoved;
      }
  
      // Otherwise → behave like normal user view (hide removed)
      if (p.isRemoved) return false;
  
      return matchesFilter(p, activeFilter);
    });
  }, [posts, activeFilter, userData]);

  async function onToggleRemove(postId, isRemoved) {
    try {
      const ref = doc(db, "posts", postId);
  
      await updateDoc(ref, { isRemoved });
  
      // update UI immediately
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isRemoved } : p
        )
      );
    } catch (err) {
      console.error("Error updating post:", err);
    }
  }

  function handleSharebutton(post) {
    const text = `${post.title} \n\n${post.body}`;
    navigator.clipboard.writeText(text).then(() => {
    toast.success("Post copied to clipboard!");
  }).catch(() => {
    toast.error("Post failed, try again.");
  });
  }

  return (
    <div className="feedPage">
      <div className="feedWrap">
        <div className="feedHero">
          <div className="feedHeroTop">
          <h1>
            Welcome back{userData ? `, ${userData.name || "User"}` : ""}{userData?.isAdmin && "🛡️"}!
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
          {FILTERS
            .filter((f) => f !== "Removed" || userData?.isAdmin)
            .map((f) => (
            <button
              key={f}
              className={`filterPill ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
              type="button"
            >
              {f === "Removed" ? `🛡️ Removed (${posts.filter(p => p.isRemoved).length})` : f}
            </button>
          ))}
        </div>

        <CreatePostBox
          onCreatePost={handleCreatePost}
        />

        <div className="feedGrid">
          {filteredPosts.map((post) => (
            <Post 
              key={post.id} 
              post={post} 
              currentUser={userData}
              onToggleRemove={onToggleRemove} />
          ))}
        </div>
      </div>
    </div>
  );
}