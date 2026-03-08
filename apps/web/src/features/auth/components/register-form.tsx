"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { z } from "zod"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useRegisterUser } from "@/features/user/hooks/register-user.hook"

import { registerSchema, RegisterFormValues } from "../types"

type RegisterFormInput = z.input<typeof registerSchema>

export function RegisterForm() {
  const registerMutation = useRegisterUser()

  const form = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        isAdmin: data.isAdmin,
      })
      toast.success("Registration successful")
      form.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        isAdmin: false,
      })
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Role</FormLabel>
              <FormControl>
                <Tabs
                  onValueChange={(value) => field.onChange(value === "ADMIN")}
                  value={field.value ? "ADMIN" : "USER"}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
                    <TabsTrigger value="USER">User</TabsTrigger>
                    <TabsTrigger value="ADMIN">Admin</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <FormControl>
                <Input
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white/50"
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white/50"
                  placeholder="name@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white/50"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white/50"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90 mt-2 font-semibold"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
