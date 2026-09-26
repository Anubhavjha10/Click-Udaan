import * as fs from "fs";
import * as path from "path";
import { initializeApp, getApps, cert, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;

export function formatFirebasePrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip outer quotes (single or double) if present
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1).trim();
  }
  // Replace escaped \n and \r\n with real newlines
  formatted = formatted.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
  return formatted;
}

function detectLocalServiceAccount(): { clientEmail?: string; privateKey?: string; projectId?: string } | null {
  // Never attempt to load local file in production/Vercel
  if (process.env.VERCEL || process.env.NODE_ENV === "production" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return null;
  }

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

  const isProduction = Boolean(process.env.VERCEL || process.env.NODE_ENV === "production" || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const localAccount = isProduction ? null : detectLocalServiceAccount();

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    localAccount?.projectId ||
    process.env.VITE_FIREBASE_PROJECT_ID ||
    "clickudaan-20cfe";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || localAccount?.clientEmail;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY?.trim() || localAccount?.privateKey;
  const formattedKey = formatFirebasePrivateKey(rawPrivateKey);

  // Safe diagnostics (never log secrets/keys)
  console.log(`[FIREBASE_ADMIN] project ID configured: ${Boolean(projectId)}`);
  console.log(`[FIREBASE_ADMIN] client email configured: ${Boolean(clientEmail)}`);
  console.log(`[FIREBASE_ADMIN] private key configured: ${Boolean(rawPrivateKey)}`);

  if (clientEmail && formattedKey) {
    try {
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
  if (!rawPrivateKey) missing.push("FIREBASE_PRIVATE_KEY");
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

export function getAdminAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (err: any) {
    console.error("[FIREBASE_ADMIN] Failed to acquire Admin Auth instance:", err.message || err);
    return null;
  }
}
