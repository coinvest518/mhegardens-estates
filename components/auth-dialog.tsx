"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authErrorMessage, useAuth } from "@/components/auth-provider"

type Mode = "signin" | "signup" | "reset"

const COPY: Record<Mode, { title: string; description: string; submit: string }> = {
  signin: {
    title: "Sign in",
    description: "Pick up where you left off — your answers and next steps are saved to your account.",
    submit: "Sign in",
  },
  signup: {
    title: "Create your account",
    description: "Save your answers, track your next steps, and book your free 30-minute call.",
    submit: "Create account",
  },
  reset: {
    title: "Reset your password",
    description: "Enter your email and we'll send you a link to set a new password.",
    submit: "Send reset link",
  },
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signin",
  signupDescription,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode?: Mode
  /** Optional reason shown when creating an account (e.g. what it unlocks). */
  signupDescription?: string
}) {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const switchMode = (m: Mode) => {
    setMode(m)
    setError(null)
  }

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setError(null)
      setPassword("")
      setMode(initialMode)
    }
    onOpenChange(o)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === "signin") {
        await signIn(email, password)
        toast.success("You're signed in.")
        handleOpenChange(false)
      } else if (mode === "signup") {
        await signUp(name, email, password)
        toast.success("Account created. Welcome!")
        handleOpenChange(false)
      } else {
        await resetPassword(email)
        toast.success("If that email has an account, a reset link is on its way.")
        switchMode("signin")
      }
    } catch (err) {
      // Don't reveal whether an email exists on the reset screen.
      if (mode === "reset") {
        toast.success("If that email has an account, a reset link is on its way.")
        switchMode("signin")
      } else {
        setError(authErrorMessage(err))
      }
    } finally {
      setBusy(false)
    }
  }

  const onGoogle = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
      toast.success("You're signed in.")
      handleOpenChange(false)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const copy = COPY[mode]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{mode === "signup" && signupDescription ? signupDescription : copy.description}</DialogDescription>
        </DialogHeader>

        {mode !== "reset" && (
          <>
            <Button type="button" variant="outline" className="w-full" onClick={onGoogle} disabled={busy}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or use email
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          {mode !== "reset" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">Password</Label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="auth-password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                required
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {copy.submit}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" && (
            <>
              New here?{" "}
              <button type="button" onClick={() => switchMode("signup")} className="font-medium text-primary hover:underline">
                Create an account
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("signin")} className="font-medium text-primary hover:underline">
                Sign in
              </button>
            </>
          )}
          {mode === "reset" && (
            <button type="button" onClick={() => switchMode("signin")} className="font-medium text-primary hover:underline">
              Back to sign in
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  )
}
