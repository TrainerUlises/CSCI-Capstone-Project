import { db } from "../firebase";
import "./FeedView.css";
import { useMemo, useState } from "react";
import CreatePostBox from "./CreatePostBox";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const MOCK_POSTS = [
  {
    id: "p1",
    type: "Needs Aid", // will make red
    urgent: true,
    title: "Need help shoveling snow tonight",
    body: "Hi neighbors — I’m recovering from a knee injury and can’t clear my front steps. If anyone nearby can help before 7pm, I’d really appreciate it. I have a shovel and hot cocoa.",
    author: { name: "Sarah Johnson", initials: "SJ", address: "230 W 14th St" },
    time: "1 hour ago",
    details: { neededBy: "Today, 7:00 PM" }, //gonna just change this to neededBy though
    imageUrl: null,
  },
  {
    id: "p2",
    type: "Offer Aid", // blue
    urgent: false,
    title: "Babysitting help available this week",
    body: "I’m available to help with babysitting this week in the evenings. If you need a break or have an appointment, I’d be happy to watch your little ones for a couple of hours.",
    author: { name: "Oscar Reyes", initials: "OR", address: "242 W 14th St" },
    time: "2 hours ago",
    details: { when: "This week (evenings)" },
    imageUrl: null,
  },
  {
    id: "p3",
    type: "Donation/Swap", // green
    urgent: false,
    title: "Donation: extra pantry items (pickup)",
    body: "I have extra pasta, canned beans, and rice from a delivery mix-up. Free to anyone who can use it — I can leave it in the lobby for easy pickup.",
    author: { name: "David Chen", initials: "DC", address: "238 W 14th St" },
    time: "4 hours ago",
    details: { items: ["Pasta", "Canned beans", "Rice"] },
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p4",
    type: "Donation/Swap", 
    urgent: false,
    title: "Swap: kids winter coat (size 6) for size 7/8",
    body: "We’ve got a gently used kids winter coat (size 6) that’s too small now. Would love to swap for size 7/8, or you can have it if you need it.",
    author: { name: "Maria Santos", initials: "MS", address: "234 W 14th St" },
    time: "6 hours ago",
    details: { condition: "Gently used" },
    imageUrl: null,
  },
  {
    id: "p5",
    type: "Other", // gray
    urgent: false,
    title: "Community garden meeting next month",
    body: "Anyone else excited about the new community garden? We’re planning a kickoff meeting to figure out plots, schedules, and volunteer days.",
    author: { name: "Alex Rivera", initials: "AR", address: "234 W 14th St" },
    time: "1 day ago",
    details: { date: "Next month" },
    imageUrl:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p6",
    type: "Needs Aid",
    urgent: false,
    title: "Elder check-in request (quick visit)",
    body: "My neighbor (an older adult living alone) hasn’t answered the door today. If someone nearby could do a quick check-in with me, I’d feel better.",
    author: { name: "Jordan Lee", initials: "JL", address: "228 W 14th St" },
    time: "30 minutes ago",
    details: { neededBy: "Today (ASAP)" },
    imageUrl: null,
  },
];

const FILTERS = ["All", "Needs Aid", "Offer Aid", "Donation/Swap", "Other", "Urgent"];

const TYPE_CLASS = {
    "Needs Aid": "needsaid",
    "Offer Aid": "offeraid",
    "Donation/Swap": "donationswap",
    "Other": "other",
  };
  

function matchesFilter(post, activeFilter) {
  if (activeFilter === "All") return true;
  if (activeFilter === "Urgent") return post.urgent === true;
  return post.type === activeFilter;
}

export default function FeedView() {
  const userProfile = {
    name: "Alex Rivera",
    zipcode: "10010",
  };

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
      zipCode: userData.zipCode || "",
  
      timestamp: serverTimestamp(),
      neededBy: postData.neededBy || "",
      imageUrl: postData.imageUrl || "",
    });
  }

  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]); // adding state for real posts
  const { user } = useAuth(); // adding this for real time render of user instead of hardcoded user
  const [userData, setUserData] = useState(null);

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
  
        return {
          id: doc.id,
          ...data,
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
            address: data.zipCode,
          },
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
            <span className="chip chip-soft">Location Verified</span>
            <span className="chip chip-soft">2 urgent needs</span>
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

        {/* PLACEHOLDER FOR CREATEPOST */}
        <CreatePostBox
          currentUser={{
            displayName: "Unknown User",
            zipCode: "Unknown Neighborhood",
          }}
          onCreatePost={handleCreatePost}
        />

        <div className="feedGrid">
          {filteredPosts.map((post) => {
          const typeKey = TYPE_CLASS[post.type] ?? "other";  
          return(
            <article key={post.id} className="postCard">
              <header className="postHeader">
                <div className="postAuthor">
                  <div className="avatar avatar-sm">{post.author.initials}</div>

                  <div className="postAuthorMeta">
                    <div className="postAuthorLine">
                      <span className="postAuthorName">{post.author.name}</span>
                      <span className="dot">•</span>
                      <span className="postTime">{post.time}</span>
                    </div>

                    <div className="postSub">
                      <span className="pin">📍</span> {post.author.address}
                    </div>
                  </div>
                </div>
                
                <div className="postBadges">
                <span className={`badge badge-${typeKey}`}>
                    {post.type}
                  </span>

                  {post.urgent && <span className="badge badge-urgent">Urgent</span>}
                </div>
              </header>

              <div className="postBody">
                <h3 className="postTitle">{post.title}</h3>
                <p className="postText">{post.body}</p>

                {post.details?.neededBy && (
                  <div className="postMetaRow">
                    <span className="metaPill">Needed by: {post.details.neededBy}</span>
                  </div>
                )}
              </div>

              {post.imageUrl && (
                <div className="postImageWrap">
                  <img className="postImage" src={post.imageUrl} alt="Post" />
                </div>
              )}

              <footer className="postFooter">
                <div className="postActions">
                  <button className="actionBtn actionPrimary" type="button">
                    Contact
                  </button>
                  <button className="actionBtn" type="button">
                    Share
                  </button>
                </div>
              </footer>
            </article>
          )})}
        </div>
      </div>
    </div>
  );
}