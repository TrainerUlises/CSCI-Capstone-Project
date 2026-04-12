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

  if (loading) {
    //return <div>Loading...</div>;
  }
  if (!user) {
    return <div>No user data available.</div>;
  }
  
    const initials = user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

    const createdAt = user.createdAt.toDate();
    return (
        <>
            <main className="profilePage">
                <div className="profileContainer">
                    {/* Top Profile Card */}
                    <section className="card profileCard">
                        <div className="profileTopRow">
                            <div className="avatar" aria-hidden="true">
                                {initials}
                            </div>

                            <div className="profileMeta">
                                <h1 className="profileName">{user.name}</h1>
                                <div className="metaLine">
                                    <span className="metaIcon" aria-hidden="true">🗓️</span>
                                    <span>Member since {createdAt.toLocaleDateString()} </span>
                                </div>
                            </div>
                            <ProfileSettingsButton />
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