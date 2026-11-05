"use client"

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth"

/**
 * Firebase web config. These NEXT_PUBLIC_ values are the public client config
 * from Firebase console → Project settings → Your apps → Web app. They are not secrets.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/** Set to "localhost:9099" to run against the local Firebase Auth emulator. */
const EMULATOR_HOST = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST

let app: FirebaseApp | null = null
let auth: Auth | null = null

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

export function getFirebaseAuth(): Auth {
  if (auth) return auth
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* environment variables.")
  }
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
  if (EMULATOR_HOST) {
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}`, { disableWarnings: true })
  }
  return auth
}
