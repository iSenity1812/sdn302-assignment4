"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpenText, LogOut, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { logout } from "@/features/auth/api/auth.api"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth.store"

type TokenPayload = {
  role?: string
  userRole?: string
  authorities?: string[]
  scope?: string
}

type AppRole = "ADMIN" | "USER"

const toAppRole = (value?: string): AppRole | null => {
  if (!value) {
    return null
  }

  const normalized = value.toUpperCase()
  if (normalized.includes("ADMIN")) {
    return "ADMIN"
  }

  if (normalized.includes("USER")) {
    return "USER"
  }

  return null
}

const extractRole = (payload: TokenPayload): AppRole | null => {
  return (
    toAppRole(payload.role) ??
    toAppRole(payload.userRole) ??
    toAppRole(payload.scope) ??
    toAppRole(payload.authorities?.join(" "))
  )
}

const parseTokenPayload = (token: string): TokenPayload | null => {
  try {
    const [, payload] = token.split(".")
    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const decoded = atob(normalized)
    return JSON.parse(decoded) as TokenPayload
  } catch {
    return null
  }
}

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const clearTokens = useAuthStore((state) => state.clearTokens)

  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const role = React.useMemo(() => {
    if (!accessToken) {
      return null
    }

    const payload = parseTokenPayload(accessToken)
    return payload ? extractRole(payload) : null
  }, [accessToken])

  if (pathname === "/auth" || !accessToken) {
    return null
  }

  const isAdmin = role === "ADMIN"

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      if (refreshToken) {
        await logout({ refreshToken })
      }
    } catch {
      // Client state is still cleared even if server logout fails.
    } finally {
      clearTokens()
      router.replace("/auth")
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={isAdmin ? "/quiz" : "/exam"} className="flex items-center gap-2">
          <BookOpenText className="size-5 text-primary" />
          <span className="font-semibold tracking-tight">SaaS Quiz</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {isAdmin ? (
            <>
              <Link
                href="/quiz"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  pathname.startsWith("/quiz") && "bg-muted text-foreground"
                )}
              >
                Quiz
              </Link>
              <Link
                href="/question"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  pathname.startsWith("/question") && "bg-muted text-foreground"
                )}
              >
                Question
              </Link>
            </>
          ) : null}

          <span className="hidden items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground sm:inline-flex">
            <ShieldCheck className="size-3.5" />
            {isAdmin ? "Admin" : "User"}
          </span>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </nav>
      </div>
    </header>
  )
}