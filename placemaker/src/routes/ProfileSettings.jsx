import "./ProfileView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";


function ProfileSettingsButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/profile");
    }

    return (<button className="btn btnSecondary editBtn" type="button" onClick={handleClick}>
        <span className="btnIcon" aria-hidden="true">🖬</span>
        Save
    </button>)
}

export default function Profile() {
    const [job, setJob] = useState("");
    const [skills, setSkills] = useState("");
    const [workHours, setWorkHours] = useState("");
    const [availability, setAvailability] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [bio, setbio] = useState("");
    const [helpDesc, setHelpDesc] = useState("");

    const currentUser = auth.currentUser;

    const [notifs, setNotifs] = useState({
        newPosts: true,
        newEvents: true,
        directMessages: true,
        weeklyDigest: false,
    });

    function toggle(key) {
        setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    // Mock data (swap with Firestore later)
    const user = {
        name: "Alex Rivera",
        location: "234 W 14th St",
        memberSince: "January 2024",
        bio: "Born and raised in Chelsea. Love gardening and organizing neighborhood cleanups!",
        stats: { posts: 24, events: 8, connections: 12 },
        email: "alexrivera@email.com",
    };

    const initials = user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");

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
                                    <span>{user.location}</span>
                                </div>

                                <div className="metaLine">
                                    <span className="metaIcon" aria-hidden="true">🗓️</span>
                                    <span>Member since {user.memberSince}</span>
                                </div>
                            </div>
                            <ProfileSettingsButton />
                        </div>

                        <p className="profileBio">{user.bio}</p>
                    </section>

                    {/* Profile Settings */}
                    <section className="card sectionCard">
                        <div className="sectionHeader">
                            <span className="sectionIcon" aria-hidden="true">⚙</span>
                            <h2 className="sectionTitle">Profile Settings</h2>
                        </div>

                        <div className="formGrid">
                            <div className="formGroup">
                                <label className="formLabel" htmlFor="job">Occupation</label>
                                <input
                                    id="job"
                                    type="text"
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                    className="formInput"
                                />
                            </div>

                            <div className="formGroup">
                                <label className="formLabel" htmlFor="skills">Skills and Interests</label>
                                <input
                                    id="skills"
                                    type="text"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="formInput"
                                />
                            </div>

                            <div className="formGroup">
                                <label className="formLabel" htmlFor="workhours">Work Hours</label>
                                <input
                                    id="workhours"
                                    type="text"
                                    value={workHours}
                                    onChange={(e) => setWorkHours(e.target.value)}
                                    className="formInput"
                                />
                            </div>

                            <div className="formGroup">
                                <label className="formLabel" htmlFor="availability">When Are You Available?</label>
                                <input
                                    id="availablility"
                                    type="text"
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    className="formInput"
                                />
                            </div>

                            <div className="formGroup">
                                <label className="formLabel" htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="formInput"
                                />
                            </div>

                            <div className="formGroup">
                                <label className="formLabel" htmlFor="website">Personal Website</label>
                                <input
                                    id="website"
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="formInput"
                                />
                            </div>

                            <div className="formGroup fullWidth">
                                <label className="formLabel" htmlFor="bio">Account Bio</label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setbio(e.target.value)}
                                    className="formTextarea"
                                    rows="3"
                                />
                            </div>

                            <div className="formGroup fullWidth">
                                <label className="formLabel" htmlFor="helpDesc">How Can You Help Neighbors?</label>
                                <textarea
                                    id="helpDesc"
                                    value={helpDesc}
                                    onChange={(e) => setHelpDesc(e.target.value)}
                                    className="formTextarea"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="card sectionCard">
                        <div className="sectionHeader">
                            <span className="sectionIcon" aria-hidden="true">🔔</span>
                            <h2 className="sectionTitle">Notifications</h2>
                        </div>

                        <div className="settingRow">
                            <div className="settingText">
                                <div className="settingTitle">New Posts</div>
                                <div className="settingSub">Get notified when neighbors post updates</div>
                            </div>
                            <label className="switch" aria-label="Toggle new posts notifications">
                                <input
                                    type="checkbox"
                                    checked={notifs.newPosts}
                                    onChange={() => toggle("newPosts")}
                                />
                                <span className="slider" />
                            </label>
                        </div>

                        <div className="settingRow">
                            <div className="settingText">
                                <div className="settingTitle">New Events</div>
                                <div className="settingSub">Get notified about upcoming events</div>
                            </div>
                            <label className="switch" aria-label="Toggle new events notifications">
                                <input
                                    type="checkbox"
                                    checked={notifs.newEvents}
                                    onChange={() => toggle("newEvents")}
                                />
                                <span className="slider" />
                            </label>
                        </div>

                        <div className="settingRow">
                            <div className="settingText">
                                <div className="settingTitle">Direct Messages</div>
                                <div className="settingSub">Get notified when neighbors message you</div>
                            </div>
                            <label className="switch" aria-label="Toggle direct messages notifications">
                                <input
                                    type="checkbox"
                                    checked={notifs.directMessages}
                                    onChange={() => toggle("directMessages")}
                                />
                                <span className="slider" />
                            </label>
                        </div>

                        <div className="settingRow settingRowLast">
                            <div className="settingText">
                                <div className="settingTitle">Weekly Digest</div>
                                <div className="settingSub">Receive a weekly summary of block activity</div>
                            </div>
                            <label className="switch" aria-label="Toggle weekly digest">
                                <input
                                    type="checkbox"
                                    checked={notifs.weeklyDigest}
                                    onChange={() => toggle("weeklyDigest")}
                                />
                                <span className="slider" />
                            </label>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}