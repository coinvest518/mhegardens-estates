"use client"

import { useState } from "react"
import { Loader2, LogOut, CalendarCheck, ClipboardList } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthDialog } from "@/components/auth-dialog"
import { useAuth } from "@/components/auth-provider"

export default function AccountPage() {
  const { user, loading, configured, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {!configured ? (
            <p className="text-muted-foreground">Accounts aren&apos;t switched on yet.</p>
          ) : loading ? (
            <div className="flex items-center gap-2 text-muted-foreground" data-testid="account-loading">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your account…
            </div>
          ) : !user ? (
            <div className="text-center space-y-4" data-testid="account-signed-out">
              <h1 className="text-3xl font-bold text-foreground">Sign in to see your account</h1>
              <p className="text-muted-foreground">
                Your saved answers, next steps and booked calls live here.
              </p>
              <Button onClick={() => setOpen(true)}>Sign in or create an account</Button>
              <AuthDialog open={open} onOpenChange={setOpen} />
            </div>
          ) : (
            <div className="space-y-6" data-testid="account-signed-in">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-leaf">My account</p>
                  <h1 className="text-3xl font-bold text-foreground">
                    Hi{user.displayName ? `, ${user.displayName}` : ""}
                  </h1>
                  <p className="text-muted-foreground" data-testid="account-email">{user.email}</p>
                </div>
                <Button variant="outline" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Your answers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Your qualifier answers (buyer, seller or investor, funds and credit range) will show here once the
                  questionnaire is connected.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Your next step</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Book your free 30-minute call. Your booking and next steps will show here.
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
