import "./ProfileView.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

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
  if (loading) {
    return <div>Loading...</div>;
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
                                    <span className="metaIcon" aria-hidden="true">📍</span>
                                    <span>{user.addressLine1}</span>
                                </div>

                                <div className="metaLine">
                                    <span className="metaIcon" aria-hidden="true">🗓️</span>
                                    <span>Member since {createdAt.toLocaleDateString()} </span>
                                </div>
                            </div>
                            <ProfileSettingsButton />
                        </div>

                        <p className="profileBio">{user.bio}</p>
                    </section>

                    {/* Contact Info */}
                    <section className="card sectionCard">
                        <div className="sectionHeader">
                            <span className="sectionIcon" aria-hidden="true">✉️</span>
                            <h2 className="sectionTitle">Contact Information</h2>
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

                            <div className="infoItem">
                                <div className="infoLabel">Personal Website</div>
                                <div className="infoValue">{user.website}</div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="card sectionCard">
                        <div className="sectionHeader">
                            <span className="sectionIcon" aria-hidden="true">👤</span>
                            <h2 className="sectionTitle">About Me</h2>
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
                                <div className="infoLabel">When I'm Available</div>
                                <div className="infoValue">{user.availability}</div>
                            </div>

                            <div className="infoItem fullWidth">
                                <div className="infoLabel">How I Can Help Neighbors</div>
                                <div className="infoValue">{user.helpDesc}</div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="statsRow" aria-label="Profile stats">
                        <div className="card statCard">
                            <div className="statNumber">{user.stats?.posts}</div>
                            <div className="statLabel">Posts</div>
                        </div>
                        <div className="card statCard">
                            <div className="statNumber">{user.stats?.events}</div>
                            <div className="statLabel">Events</div>
                        </div>
                        <div className="card statCard">
                            <div className="statNumber">{user.stats?.following}</div>
                            <div className="statLabel">Following</div>
                        </div>
                    </section>

                    {/*MAYBE PUT THAT SPECIFIC USER'S POSTS HERE AT THE BOTTOM?*/}
                </div>
            </main>
        </>
    );
}