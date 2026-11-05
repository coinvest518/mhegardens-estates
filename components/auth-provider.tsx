"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase"

type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
  signUp: (name: string, email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
    if (name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() })
      // Refresh local state so the new display name shows immediately.
      setUser({ ...cred.user, displayName: name.trim() } as User)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
  }, [])

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider())
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(getFirebaseAuth(), email)
  }, [])

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth())
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      signOut,
    }),
    [user, loading, signUp, signIn, signInWithGoogle, resetPassword, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

/** Turn Firebase error codes into plain-language messages. */
export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ""
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email and password don't match. Try again or reset your password."
    case "auth/email-already-in-use":
      return "There's already an account with that email. Sign in instead."
    case "auth/weak-password":
      return "Use a password with at least 6 characters."
    case "auth/invalid-email":
      return "That email address doesn't look right."
    case "auth/too-many-requests":
      return "Too many tries. Wait a minute and try again."
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished."
    default:
      return "Something went wrong. Please try again."
  }
}
