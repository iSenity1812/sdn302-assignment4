"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { loginSchema, LoginFormValues } from "../types"
import { useLogin } from "../hooks/login.hook"
import { me as getMe } from "../api/auth.api"

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const loginResponse = await loginMutation.mutateAsync(data)

      if (!loginResponse.success) {
        toast.error(loginResponse.error.message || "Invalid email or password.")
        return
      }

      const meResponse = await getMe()

      if (!meResponse.success) {
        toast.error(meResponse.error.message || "Unable to load your profile.")
        return
      }

      const destination = meResponse.data.role === "ADMIN" ? "/quiz" : "/exam"

      toast.success("Logged in successfully")
      router.push(destination)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90 font-semibold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
