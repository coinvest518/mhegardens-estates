"use client"

import { useState } from "react"
import Link from "next/link"
import { UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth-dialog"
import { useAuth } from "@/components/auth-provider"

/** Sign in / My account button for the navigation bar. */
export function AccountButton({ className = "" }: { className?: string }) {
  const { user, loading, configured } = useAuth()
  const [open, setOpen] = useState(false)

  if (!configured || loading) return null

  if (user) {
    return (
      <Button asChild variant="ghost" size="sm" className={className}>
        <Link href="/account">
          <UserRound className="mr-1.5 h-4 w-4" />
          My account
        </Link>
      </Button>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" className={className} onClick={() => setOpen(true)}>
        <UserRound className="mr-1.5 h-4 w-4" />
        Sign in
      </Button>
      <AuthDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
