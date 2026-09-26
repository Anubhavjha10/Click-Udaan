import * as fs from "fs";
import * as path from "path";
import { initializeApp, getApps, cert, applicationDefault, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// 1. Manually parse .env if process.env values are missing
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile();

function detectServiceAccountFile(): { clientEmail?: string; privateKey?: string; projectId?: string } | null {
  const rootDir = process.cwd();
  try {
    const files = fs.readdirSync(rootDir);
    const keyFile = files.find(
      (f) =>
        f === "serviceAccountKey.json" ||
        (f.endsWith(".json") && (f.includes("firebase-adminsdk") || f.includes("service-account")))
    );
    if (keyFile) {
      const fullPath = path.join(rootDir, keyFile);
      const parsed = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      if (parsed.client_email && parsed.private_key) {
        console.log(`[BOOTSTRAP] Detected local service account file: ${keyFile}`);
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key,
          projectId: parsed.project_id,
        };
      }
    }
  } catch { }
  return null;
}

const localServiceAccount = detectServiceAccountFile();

const projectId =
  localServiceAccount?.projectId ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.VITE_FIREBASE_PROJECT_ID ||
  "clickudaan-20cfe";
const clientEmail = localServiceAccount?.clientEmail || process.env.FIREBASE_CLIENT_EMAIL?.trim();
let privateKey = localServiceAccount?.privateKey || process.env.FIREBASE_PRIVATE_KEY?.trim();
const adminUid =
  process.env.BOOTSTRAP_ADMIN_UID?.trim() || "LfzdNp4XB5WMcKl8VIqRvPTC4Y43";

// Legacy Certificate Records to Migrate
const LEGACY_CERTIFICATES = [
  {
    certificateId: "CU-WD-2026-076",
    verificationNumber: "CU-WD-2026-076",
    studentName: "Simran",
    email: "rajputsimran2428@gmail.com",
    course: "Web Development Internship",
    duration: "2 Months",
    issueDate: "01 Jan 2026",
    college: "IB College Panipat",
    issuedBy: "ClickUdaan (By Vabit Digify Media Pvt Ltd)",
    organization: "ClickUdaan (By Vabit Digify Media Pvt Ltd)",
    internshipStatus: "Completed",
    offerLetterUrl: "https://res.cloudinary.com/qfyp5jiy/raw/upload/v1/offer_letters/CU-WD-2026-076.pdf",
    active: true,
  },
  {
    certificateId: "CU-WD-2026-077",
    verificationNumber: "CU-WD-2026-077",
    studentName: "Rahul Sharma",
    email: "n2428@gmail.com",
    course: "Digital Marketing Internship",
    duration: "3 Months",
    issueDate: "15 Feb 2026",
    college: "IB College Panipat",
    issuedBy: "ClickUdaan",
    organization: "ClickUdaan",
    internshipStatus: "Completed",
    offerLetterUrl: "https://res.cloudinary.com/qfyp5jiy/raw/upload/v1/offer_letters/CU-WD-2026-077.pdf",
    active: true,
  },
  {
    certificateId: "CU-CEEP-2026-133",
    verificationNumber: "CU-CEEP-2026-133",
    studentName: "Shivam Aditya",
    email: "adityamishra4089@gmail.com",
    course: "ClickUdaan Excel Essentials Program",
    duration: "4 Week",
    issueDate: "5 Feb 2026",
    issuedBy: "ClickUdaan",
    organization: "ClickUdaan",
    coursepartner: "Vabit Digify Media Pvt Ltd",
    internshipStatus: "Completed",
    offerLetterUrl: "https://res.cloudinary.com/qfyp5jiy/raw/upload/v1/offer_letters/CU-CEEP-2026-133.pdf",
    active: true,
  },
];

// Legitimate Existing Team Members
const LEGACY_TEAM = [
  {
    id: "kumar-anubhav",
    name: "Kumar Anubhav",
    designation: "Founder & CEO",
    description: "Leads company vision and growth strategies with strong business insight.",
    displayOrder: 1,
    active: true,
  },
  {
    id: "vivek-manishi",
    name: "Vivek Manishi",
    designation: "Founder Vabit Digify Media Pvt Ltd",
    description: "Leading ClickUdaan’s growth under Vabit Digify Media, delivering innovative digital solutions and business success.",
    displayOrder: 2,
    active: true,
  },
  {
    id: "ankur-jha",
    name: "Ankur Jha",
    designation: "Co-Founder & Director",
    description: "Empowering ClickUdaan with leadership, creativity, and result-driven digital strategies.",
    displayOrder: 3,
    active: true,
  },
  {
    id: "ashish-shrivastava",
    name: "Ashish Shrivastava",
    designation: "Co-founder Vabit Digify Media Pvt Ltd",
    description: "Proud to partner with ClickUdaan, driving growth and digital success.",
    displayOrder: 4,
    active: true,
  },
];

// Legitimate Global Business Settings
const LEGACY_SETTINGS = {
  phone: "+91 85060 95853",
  whatsapp: "+91 85060 95853",
  email: "hello@clickudaan.com",
  secondaryEmail: "info@clickudaan.com",
  address: "Iconic Tower, Sector-63, Noida, UP, India",
  instagram: "https://www.instagram.com/clickudaan/",
  facebook: "https://www.facebook.com/share/1AzKTrj6gD/",
  twitter: "https://x.com/ClickUdaan",
  linkedin: "https://linkedin.com/company/clickudaan",
  youtube: "https://youtube.com/@clickudaan",
  tagline: "Where Clicks Take Flight",
};

async function runBootstrap() {
  console.log("========================================");
  console.log("ClickUdaan Firestore Bootstrap");
  console.log("========================================");
  console.log(`\nFirebase Project:\n${projectId}`);
  console.log(`\nAdmin UID:\n${adminUid}`);

  if (!clientEmail || !privateKey) {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error("\n[ERROR] Missing required server credentials:");
      const missing: string[] = [];
      if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
      if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
      console.error(`- ${missing.join("\n- ")}`);
      console.error("\nPlease configure these variables in .env before running bootstrap.");
      process.exit(1);
    }
  }

  // 1. Initialize Firebase Admin
  let app: App;
  try {
    const existing = getApps();
    if (existing.length > 0) {
      app = existing[0];
    } else if (clientEmail && privateKey) {
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      const formattedKey = privateKey.replace(/\\n/g, "\n");
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
        projectId,
      });
    } else {
      app = initializeApp({
        credential: applicationDefault(),
        projectId,
      });
    }
  } catch (err: any) {
    console.error(`\n[ERROR] Failed to initialize Firebase Admin SDK: ${err.message || err}`);
    process.exit(1);
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  // 2. Verify Admin User Exists in Firebase Auth
  console.log("\nAdmin user:");
  let authUser: any = null;
  try {
    authUser = await auth.getUser(adminUid);
    console.log(`FOUND (${authUser.email || "No email specified"})`);
  } catch (err: any) {
    console.error(`NOT FOUND in Firebase Authentication.`);
    console.error(`Error details: ${err.message || err}`);
    console.error(`STOPPING: Cannot bootstrap an admin account that does not exist in Firebase Auth.`);
    process.exit(1);
  }

  // 3. Create / Update Admin Document in Firestore (admins/{adminUid})
  console.log("\nAdmin document:");
  try {
    const adminDocRef = db.collection("admins").doc(adminUid);
    const adminSnap = await adminDocRef.get();

    if (adminSnap.exists) {
      const current = adminSnap.data();
      await adminDocRef.set(
        {
          active: true,
          email: authUser.email || current?.email || "",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log("UPDATED (active: true, email set)");
    } else {
      await adminDocRef.set({
        active: true,
        email: authUser.email || "",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log("CREATED (active: true, email set)");
    }
  } catch (err: any) {
    console.error(`FAILED to create/update admin document: ${err.message || err}`);
    process.exit(1);
  }

  // 4. Migrate Legacy Certificates (certificates/{certificateId})
  console.log("\nCertificates:");
  let certsMigrated = 0;
  let certsPreserved = 0;

  for (const certData of LEGACY_CERTIFICATES) {
    try {
      const certRef = db.collection("certificates").doc(certData.certificateId);
      const snap = await certRef.get();

      if (snap.exists) {
        console.log(`${certData.certificateId.padEnd(18)} → PRESERVED (already exists)`);
        certsPreserved++;
      } else {
        await certRef.set({
          ...certData,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`${certData.certificateId.padEnd(18)} → MIGRATED`);
        certsMigrated++;
      }
    } catch (err: any) {
      console.error(`${certData.certificateId.padEnd(18)} → FAILED: ${err.message || err}`);
    }
  }

  // 5. Migrate Team Members (team/{memberId})
  console.log("\nTeam:");
  let teamMigrated = 0;
  let teamPreserved = 0;

  for (const member of LEGACY_TEAM) {
    try {
      const teamRef = db.collection("team").doc(member.id);
      const snap = await teamRef.get();

      if (snap.exists) {
        teamPreserved++;
      } else {
        await teamRef.set({
          name: member.name,
          designation: member.designation,
          description: member.description,
          displayOrder: member.displayOrder,
          active: member.active,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        teamMigrated++;
      }
    } catch (err: any) {
      console.error(`Team member ${member.id} failed: ${err.message || err}`);
    }
  }
  console.log(`${teamMigrated} records migrated (${teamPreserved} preserved)`);

  // 6. Migrate Global Settings (settings/global)
  console.log("\nGlobal Settings:");
  try {
    const settingsRef = db.collection("settings").doc("global");
    const snap = await settingsRef.get();

    if (snap.exists) {
      console.log("PRESERVED (already exists)");
    } else {
      await settingsRef.set({
        ...LEGACY_SETTINGS,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log("CREATED");
    }
  } catch (err: any) {
    console.error(`Global settings failed: ${err.message || err}`);
  }

  console.log("\n========================================");
  console.log("BOOTSTRAP COMPLETE");
  console.log("========================================");
}

runBootstrap().catch((err) => {
  console.error("\nUnexpected bootstrap error:", err);
  process.exit(1);
});
