"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type StatusMessage = {
  type: "success" | "error"
  message: string
}



const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const createFakeJwt = (email: string) =>
  `fake-jwt-${Buffer.from(`${email}|${Date.now()}`).toString("base64")}`

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<"email" | "password", string>>>(
    {}
  )
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      setStatus({
        type: "success",
        message: "You are already signed in. Redirecting...",
      })
  
      setTimeout(() => {
        router.push("/customizer")
      }, 800)
    }
  }, [])
  

  const validate = () => {
    const nextErrors: Partial<Record<"email" | "password", string>> = {}

    if (!email.trim() || !emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required."
    } else if (password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (!validate()) return

  setIsLoading(true)
  setStatus(null)

  try {
    login(email.trim(), password)
    setStatus({
      type: "success",
      message: "Signed in successfully. Redirecting...",
    })

    setTimeout(() => {
      router.push("/customizer")
    }, 800)
  } catch (err: any) {
    setStatus({
      type: "error",
      message: err.message || "Login failed",
    })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-foreground flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-sm text-muted-foreground">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <Sparkles className="size-5" />
          </div>
          <p>Sign in to manage your sneaker studio projects.</p>
        </div>

        <Card className="backdrop-blur bg-card/90 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <ShieldCheck className="size-5 text-primary" />
              Welcome back
            </CardTitle>
            <CardDescription>
              
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {status && (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  status.type === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}
              >
                {status.message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="text-destructive text-sm">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="current-password"
                    required
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="absolute right-1.5 top-1.5 text-muted-foreground"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-destructive text-sm">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            
          </CardContent>
        </Card>
      </div>
    </main>
  )

}

