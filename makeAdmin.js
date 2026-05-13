const admin = require("firebase-admin");
const fs = require("fs");

// Read the JSON file manually
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// your UIDs
const uids = [
  "U3TvN2NO6nUb0GkXuRuKmBjEDl03"
];

async function makeAdmins() {
  for (const uid of uids) {
    await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
    console.log(`✅ ${uid} is now admin`);
  }
  process.exit();
}

makeAdmins().catch(console.error);
