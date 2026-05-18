import "./FeedView.css";
import { useMemo, useState } from "react";
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

export default function ExploreView() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]); // real posts
  const [usersMap, setUsersMap] = useState({});
  const { user } = useAuth(); // real time render
  const [userData, setUserData] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // used for radius filtering
  const [selectedRadius, setSelectedRadius] = useState(10); // used for radius fil, default to 5 miles, changed to 10 for testing purposes 
  const urgentCount = posts.filter(p => p.urgent).length;

  // geolocation
  useEffect(() => {
    if(!navigator.geolocation) return; // base case

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        console.error("ERROR WITH GEOLOCATION!", error);
      }
    );
  }, []);
  
  //adding real time firestore listener
  // functionality
  // listens to post collections
  // orders by newest first
  // converts firestore time
  // updates in real time
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const users = {};
  
        snapshot.docs.forEach((doc) => {
          users[doc.id] = doc.data();
        });
  
        setUsersMap(users);
      }
    );
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const normalizedType = normalizePostType(data.type);
        const authorData = usersMap[data.userId] || {};
  
        return {
          id: doc.id,
          ...data,
          type: normalizedType,
          time: data.timestamp?.toDate
            ? data.timestamp.toDate().toLocaleString()
            : "Just now",
            author: {
              name: authorData.name || "Unknown User",
        
              photoURL: authorData.photoURL || null,
        
              initials: authorData.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase(),
            },
          isAdmin: authorData.isAdmin || false,
          locationPublic: data.locationPublic || null,
          details: {
            neededBy: data.neededBy,
          },
        };
      });
  
      setPosts(fetchedPosts);
    });
  
    return () => unsubscribe();
  }, [usersMap]);
  


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
  
  function calcDistanceMiles(lat1, lng1, lat2, lng2)
{
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 3958.8;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const formula =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(formula), Math.sqrt(1 - formula));

  return R * c;
}

  /*const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((p) => matchesFilter(p, activeFilter));
  }, [activeFilter]);*/ //updating this!

  // replacing mock_posts with real posts
  const filteredPosts = useMemo(() => {

    return posts.filter((post) => {
  
      if (!matchesFilter(post, activeFilter)) return false;
  
      if (!userLocation) return true;
  
      if (post.locationPublic?.lat == null || post.locationPublic?.lng == null) {
        return false;
      }
  
      const distance = calcDistanceMiles(
        userLocation.lat,
        userLocation.lng,
        post.locationPublic.lat,
        post.locationPublic.lng
      );
  
      return distance <= selectedRadius;
    });
  
  }, [posts, activeFilter, userLocation, selectedRadius]);

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
        <div className="radiusControl">
          <span className="radiusLabel">Displaying Posts Within </span>

          <select
            className="radiusSelect"
            value={selectedRadius}
            onChange={(e) => setSelectedRadius(Number(e.target.value))}
          >
            <option value={5}>5 Miles</option>
            <option value={10}>10 Miles</option>
            <option value={15}>15 Miles</option>
            <option value={25}>25 Miles</option>
            <option value={35}>35 Miles</option>
          </select>
        </div>

        <div className="feedGrid">
          {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}