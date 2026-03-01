import "./ProfileView.css";
import { useState } from "react";

//To be made more of a format with profile settings

export default function Profile() {
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
    tags: ["Gardening", "Sustainability", "Food", "Art"],
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

              <button className="btn btnSecondary editBtn" type="button">
                <span className="btnIcon" aria-hidden="true">✎</span>
                Edit
              </button>
            </div>

            <p className="profileBio">{user.bio}</p>

            <div className="tagRow">
              {user.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="statsRow" aria-label="Profile stats">
            <div className="card statCard">
              <div className="statNumber">{user.stats.posts}</div>
              <div className="statLabel">Posts</div>
            </div>
            <div className="card statCard">
              <div className="statNumber">{user.stats.events}</div>
              <div className="statLabel">Events</div>
            </div>
            <div className="card statCard">
              <div className="statNumber">{user.stats.connections}</div>
              <div className="statLabel">Connections</div>
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

          {/* Contact Info */}
          <section className="card sectionCard">
            <div className="sectionHeader">
              <span className="sectionIcon" aria-hidden="true">✉️</span>
              <h2 className="sectionTitle">Contact Information</h2>
            </div>

            <div className="contactGrid">
              <div className="contactItem">
                <div className="contactLabel">Email</div>
                <div className="contactValue">{user.email}</div>
              </div>

              <div className="contactItem">
                <div className="contactLabel">Address</div>
                <div className="contactValue">{user.location}</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}