import "./ProfileView.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

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
    export default function ProfileSettings() {
        const navigate = useNavigate();
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [photoFile, setPhotoFile] = useState(null);
        const [photoURL, setPhotoURL] = useState(null);
      
        const [formData, setFormData] = useState({
            name: "",
            email: "",
            addressLine1: "",
            phone: "",
            bio: "",
            job: "",
            skills: "",
            workHours: "",
            website: "",
        });
        
      
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
                const userData = userSnap.data();
                setUser(userData);
      
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    addressLine1: userData.addressLine1 || "",
                    bio: userData.bio || "",
                    phone: userData.phone || "",
                    job: userData.job || "",
                    skills: userData.skills || "",
                    workHours: userData.workHours || "",
                    website: userData.website || "",
                  });
                  setPhotoURL(userData.photoURL || null);
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
      
        function handleChange(e) {
          const { name, value } = e.target;
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      async function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file || !auth.currentUser) return;

        //const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}_${Date.now()}`);
    
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoURL(downloadURL);
            setPhotoFile(file);
        } catch (err) {
            console.error("Photo upload failed:", err);
       }
    }
        async function handleSave() {
          const currentUser = auth.currentUser;
          if (!currentUser) return;
      
          setSaving(true);
          try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                name: formData.name,
                email: formData.email,
                addressLine1: formData.addressLine1,
                bio: formData.bio,
                phone: formData.phone,
                job: formData.job,
                skills: formData.skills,
                workHours: formData.workHours,
                website: formData.website,
                photoURL: photoURL,
            });
            navigate("/profile");
          } catch (err) {
            console.error("Error saving profile:", err);
          } finally {
            setSaving(false);
          }
        }
      
        //if (loading) return <div>Loading...</div>;
        if (!user) return <div></div>;

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
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="avatar" aria-hidden="true">
                {photoURL ? (
               <img src={photoURL} alt="Profile" 
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                initials
              )}
        </div>
       <div>
          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
      <button
            type="button"
            className="btn btnSecondary"
            onClick={() => document.getElementById("photoUpload").click()}
      >
        {photoFile ? "Change Photo" : "Upload Photo"}
      </button>
      </div>
    </div>

            <div className="profileMeta">
              <h1 className="profileName">{user.name}</h1>

              {user.addressLine1 && (
                <div className="metaLine">
                  <span className="metaIcon" aria-hidden="true">📍</span>
                  <span>{user.addressLine1}</span>
                </div>
              )}

              {createdAt && (
                <div className="metaLine">
                  <span className="metaIcon" aria-hidden="true">🗓️</span>
                  <span>Member since {createdAt.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <button
              className="btn btnSecondary editBtn"
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              <span className="btnIcon" aria-hidden="true"></span>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          {formData.bio && <p className="profileBio">{formData.bio}</p>}
        </section>

        {/* User Information Settings */}
        <section className="card sectionCard">
          <div className="sectionHeader">
            <span className="sectionIcon" aria-hidden="true">✉️</span>
            <h2 className="sectionTitle">User Information</h2>
          </div>

          <div className="formGrid">
            {user.email && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  className="formInput"
                  onChange={handleChange} 
                />
              </div>
            )}

            {user.addressLine1 && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="addressLine1">Address</label>
                <input
                  id="addressLine1"
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  className="formInput"
                  onChange={handleChange}
                />
              </div>
            )}

            {"phone" in user && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="formInput"
                />
              </div>
            )}
            {user.name && (
            <div className="formGroup">
                <label className="formLabel" htmlFor="name">Display Name</label>
                <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                className="formInput"
                onChange={handleChange}
                />
            </div>
            )}
          </div>
          
        </section>

        {/* About Me Settings */}
        <section className="card sectionCard">
          <div className="sectionHeader">
            <span className="sectionIcon" aria-hidden="true">👤</span>
            <h2 className="sectionTitle">About Me</h2>
          </div>

          <div className="formGrid">
            {"bio" in user && (
              <div className="formGroup fullWidth">
                <label className="formLabel" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="formTextarea"
                  rows="3"
                />
              </div>
            )}

            {"job" in user && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="job">Occupation</label>
                <input
                  id="job"
                  name="job"
                  type="text"
                  value={formData.job}
                  onChange={handleChange}
                  className="formInput"
                />
              </div>
            )}

            {"skills" in user && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="skills">Skills and Interests</label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  className="formInput"
                />
              </div>
            )}

            {"workHours" in user && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="workHours">Work Hours</label>
                <input
                  id="workHours"
                  name="workHours"
                  type="text"
                  value={formData.workHours}
                  onChange={handleChange}
                  className="formInput"
                />
              </div>
            )}

            {"website" in user && (
              <div className="formGroup">
                <label className="formLabel" htmlFor="website">Personal Website</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="formInput"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
        </>
    );
}