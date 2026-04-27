import "./ProfileView.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore"; // new imports 
import { useState, useEffect } from "react";
import Post from "../components/Post"; // new imports

//To be made more of a format with profile settings
function ProfileSettingsButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/profile-settings");
    }
    
    return (<button className="btn btnSecondary editBtn" type="button" onClick={handleClick}>
        <span className="btnIcon" aria-hidden="true">✎</span>
        Edit
    </button>)
}

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]); // new profile view
    const [photoURL, setPhotoURL] = useState(null); //profile picture
    const [isAvailable, setIsAvailable] = useState(false); // local availability toggle state
    const [expiration, setExpiration] = useState(null); // local expiration time state
    const [tags, setTags] = useState([]); // local tags state

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
          setPhotoURL(userSnap.data().photoURL || null);
        } else {
          console.error("No user profile found!");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  
  }, []);

  // another useEffect that will look at logged on user and queries firestore for posts where userID matches
  useEffect(() =>{
    const firebaseUser = auth.currentUser; // checking current user
    if(!firebaseUser) return;

    const q = query(
       collection(db, "posts"),
       where("userId", "==", firebaseUser.uid),
       orderBy("timestamp", "desc") 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const userPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),

        }));
        setPosts(userPosts);
    });
    
    return () => unsubscribe();
}, []);

const tagOptions = ["Shoveling" , "Heavy Lifting", "Gardening", "Tech Help", "Childcare", "Pet Care", "Transportation", "Language Assistance", "Elderly Assistance", "Other"];

const handleAvailability = (duration) => {
    setIsAvailable(true);
    const expirationTime = new Date(Date.now() + duration * 60 * 60 * 1000);
    setExpiration(expirationTime);
};

const handleAway =() => {
    setIsAvailable(false);
    setExpiration(null);
    setTags([]);
};

const toggleTag = (tag) => {
    if (tags.includes(tag)) {
        setTags(tags.filter(t => t !== tag));
    } else {
        setTags([...tags, tag]);
    }
};
  if (loading) {
    //return <div>Loading...</div>;
  }
  if (!user) {
    return <div>No user data available.</div>;
  }
  
    const initials = user?.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "";

    async function ProfilePictureUpload(event) {
        if (!auth.currentUser) return;
        const file = event.target.files[0];
        if (!file) return;

        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}_${Date.now()}`
    );
        
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoURL(downloadURL);
            await updateDoc(doc(db, "users", auth.currentUser.uid), { photoURL: downloadURL });
        } catch (err) {
            console.error("Upload failed:", err);
        }
    }

    const createdAt = user.createdAt.toDate();
    return (
        <>
            <main className="profilePage">
                <div className="profileContainer">
                    {/* Top Profile Card */}
                    <section className="card profileCard">
                        <div className="profileTopRow">
                            <div className="avatar" aria-hidden="true">
                                {photoURL ? (
                                    <img src={photoURL} alt={`${user.name}'s profile`} 
                                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                        ) : (
                                        initials    
                                    )}
                            </div>

                            <div className="profileMeta">
                                <h1 className="profileName">{user.name}</h1>
                                <div className="availabilityStatus">
                                    {isAvailable ? (
                                        <span className="available">Available</span>
                                    ) : (
                                        <span className="notAvailable">Not Available</span>
                                    )}
                                </div>
                                <div className="metaLine">
                                    <span className="metaIcon" aria-hidden="true">🗓️</span>
                                    <span>Member since {createdAt.toLocaleDateString()} </span>
                                </div>
                            </div>
                            <ProfileSettingsButton />
                            </div>
                            <div className= "profileActions">
                                <div className ="availabilityControls">
                                <button className="btn btnPrimary" onClick={() => handleAvailability(1)}>Available for 1 hour</button>
                                <button className="btn btnPrimary" onClick={() => handleAvailability(2)}>Available for 2 hours</button>
                                <button className="btn btnPrimary" onClick={() => handleAvailability(3)}>Available for 3 hours</button>
                                <button className="btn btnSecondary" onClick={handleAway}>Set Away</button>
                                </div>
                            <div className="tagSelector">
                                {tagOptions.map((tag) => (
                                    <button 
                                        key={tag} 
                                        className={`tagButton ${tags.includes(tag) ? "selected" : ""}`} 
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="card sectionCard">
                        <div className="sectionHeader">
                            <span className="sectionIcon" aria-hidden="true">✉️</span>
                            <h2 className="sectionTitle">User Information</h2>
                        </div>

                        <div className="infoGrid">
                            <div className="infoItem">
                                <div className="infoLabel">Email</div>
                                <div className="infoValue">{user.email}</div>
                            </div>

                            <div className="infoItem">
                                <div className="infoLabel">Address</div>
                                <div className="infoValue">{user.addressLine1}</div>
                            </div>

                            <div className="infoItem">
                                <div className="infoLabel">Phone Number</div>
                                <div className="infoValue">{user.phone}</div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="card sectionCard">
                        <div className="sectionHeader">
                            <span className="sectionIcon" aria-hidden="true">👤</span>
                            <h2 className="sectionTitle">About Me</h2>
                        </div>
                        <div className="infoItem fullWidth">
                                <div className="infoLabel">Bio</div>
                                <div className="infoValue">{user.bio}</div>
                            </div>
                        <div className="infoGrid">
                            <div className="infoItem">
                                <div className="infoLabel">Occupation</div>
                                <div className="infoValue">{user.job}</div>
                            </div>

                            <div className="infoItem">
                                <div className="infoLabel">Skills and Interests</div>
                                <div className="infoValue">{user.skills}</div>
                            </div>

                            <div className="infoItem">
                                <div className="infoLabel">Work Hours</div>
                                <div className="infoValue">{user.workHours}</div>
                            </div>

                            <div className="infoItem">
                                <div className="infoLabel">Personal Website</div>
                                <div className="infoValue">{user.website}</div>
                            </div>
                        </div>
                    </section>
                    
                    {/* This section will display profile info, about section, and a small section that displays your personal posts */}
                    <section className="card sectionCard">
                    <div className="sectionHeader">
                        <h2 className="sectionTitle">My Personal Posts</h2>
                    </div>

                    {posts.length === 0 ? (
                        <p>No posts</p>
                    ) : (
                        <div className="feedGrid">
                        {posts.map((post) => (
                            <Post key={post.id} post={post}/>
                        ))}
                        </div>
                    )}
                    </section>
                </div>
            </main>
        </>
    );
}