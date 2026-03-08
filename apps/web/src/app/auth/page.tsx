"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/features/auth/components/glass-card"
import { LoginForm } from "@/features/auth/components/login-form"
import { RegisterForm } from "@/features/auth/components/register-form"
import { me as getMe } from "@/features/auth/api/auth.api"
import { useAuthStore } from "@/stores/auth.store"

type TokenPayload = {
  role?: string
  userRole?: string
  authorities?: string[]
  scope?: string
}

const toAppRole = (value?: string): "ADMIN" | "USER" | null => {
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

const extractRole = (payload: TokenPayload): "ADMIN" | "USER" | null => {
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

export default function AuthPage() {
  const [activeTab, setActiveTab] = React.useState("login")
  const [isCheckingSession, setIsCheckingSession] = React.useState(false)
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const tokenRole = React.useMemo(() => {
    if (!accessToken) {
      return null
    }

    const payload = parseTokenPayload(accessToken)
    return payload ? extractRole(payload) : null
  }, [accessToken])

  React.useEffect(() => {
    if (!accessToken) {
      return
    }

    if (tokenRole === "ADMIN") {
      router.replace("/quiz")
      return
    }

    if (tokenRole === "USER") {
      router.replace("/exam")
      return
    }

    setIsCheckingSession(true)
    let isMounted = true

    const redirectAuthenticatedUser = async () => {
      try {
        const meResponse = await getMe()

        if (!isMounted || !meResponse.success) {
          return
        }

        const destination = meResponse.data.role === "ADMIN" ? "/quiz" : "/exam"
        router.replace(destination)
      } catch {
        // Keep user on auth page when session cannot be validated.
      } finally {
        if (isMounted) {
          setIsCheckingSession(false)
        }
      }
    }

    void redirectAuthenticatedUser()

    return () => {
      isMounted = false
    }
  }, [accessToken, router, tokenRole])

  if (accessToken && (tokenRole || isCheckingSession)) {
    return null
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0a] selection:bg-purple-500/30">
      {/* Abstract Gradient Circle Blurred Glassmorphism Effect */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-pink-500/20 to-rose-500/20 blur-[90px]"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md px-4 z-10">
        <GlassCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-400 text-sm">
              {activeTab === "login"
                ? "Enter your credentials to access your account"
                : "Enter your details to create a new account"}
            </p>
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-8">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 hover:text-white transition-colors"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 hover:text-white transition-colors"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="login" className="mt-0">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register" className="mt-0">
                  <RegisterForm />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="hover:text-purple-400 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="hover:text-purple-400 underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
