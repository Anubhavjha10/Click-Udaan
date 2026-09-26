import * as fs from "fs";
import * as path from "path";
import { initializeApp, getApps, cert, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

function detectLocalServiceAccount(): { clientEmail?: string; privateKey?: string; projectId?: string } | null {
  try {
    const rootDir = process.cwd();
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
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key,
          projectId: parsed.project_id,
        };
      }
    }
  } catch {}
  return null;
}

export function getFirebaseAdminApp(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const localAccount = detectLocalServiceAccount();
  const projectId =
    localAccount?.projectId ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.VITE_FIREBASE_PROJECT_ID ||
    "clickudaan-20cfe";
  const clientEmail = localAccount?.clientEmail || process.env.FIREBASE_CLIENT_EMAIL?.trim();
  let privateKey = localAccount?.privateKey || process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (clientEmail && privateKey) {
    try {
      // Support multiline strings, escaped \n, and accidental wrapping quotes
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      const formattedKey = privateKey.replace(/\\n/g, "\n");

      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
        projectId,
      });
      return adminApp;
    } catch (err: any) {
      console.error("[FIREBASE_ADMIN] Initialization error:", err.message || err);
      return null;
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      adminApp = initializeApp({
        credential: applicationDefault(),
        projectId,
      });
      return adminApp;
    } catch (err: any) {
      console.error("[FIREBASE_ADMIN] Default credential initialization error:", err.message || err);
      return null;
    }
  }

  const missing: string[] = [];
  if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
  if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
  console.warn(`[FIREBASE_ADMIN] Missing server credentials: ${missing.join(", ")}. Admin SDK is not initialized.`);
  return null;
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (err: any) {
    console.error("[FIREBASE_ADMIN] Failed to acquire Admin Firestore instance:", err.message || err);
    return null;
  }
}
