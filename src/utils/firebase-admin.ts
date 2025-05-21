// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";

let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  app = getApp();
}

export { app };
