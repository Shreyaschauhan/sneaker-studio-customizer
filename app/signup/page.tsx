 "use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import bcrypt from "bcryptjs"
import { Eye, EyeOff, Loader2, ShieldPlus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signup } from "@/lib/auth"
import { useRouter } from "next/navigation"


type StatusMessage = {
  type: "success" | "error"
  message: string
}

const USER_KEY = "sneakerstudio_user"
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type StoredUser = {
  email: string
  passwordHash: string
  createdAt: string
}

const getPasswordStrength = (value: string) => {
  const tests = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  }

  const score = Object.values(tests).filter(Boolean).length

  if (!value) return { label: "Enter a password", score, tone: "muted" as const }
  if (score <= 2) return { label: "Weak — add more variety", score, tone: "destructive" as const }
  if (score === 3) return { label: "Fair — could be stronger", score, tone: "amber" as const }
  if (score === 4) return { label: "Strong", score, tone: "emerald" as const }
  return { label: "Very strong", score, tone: "emerald" as const }
}

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [errors, setErrors] = useState<
    Partial<Record<"email" | "password" | "confirmPassword", string>>
  >({})
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [existingUser, setExistingUser] = useState<StoredUser | null>(null)

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  const router = useRouter()


  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        setExistingUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }
  }, [])

  const validate = () => {
    const nextErrors: Partial<Record<"email" | "password" | "confirmPassword", string>> = {}

    if (!email.trim() || !emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required."
    } else if (password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters."
    } else if (passwordStrength.score < 3) {
      nextErrors.password = "Use a stronger password (add upper, number, symbol)."
    }

    if (confirmPassword.trim() !== password.trim()) {
      nextErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
  
    try {
      signup(email.trim().toLowerCase(), password)
      setStatus({
        type: "success",
        message: "Account created successfully. Redirecting to login...",
      })
  
      setTimeout(() => {
        router.push("/login")
      }, 800)
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Signup failed",
      })
    }
  }
  

  const toneClass = {
    destructive: "text-destructive",
    amber: "text-amber-500 dark:text-amber-300",
    emerald: "text-emerald-600 dark:text-emerald-300",
    muted: "text-muted-foreground",
  }[passwordStrength.tone]

  return (
    <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-foreground flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-sm text-muted-foreground">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <Sparkles className="size-5" />
          </div>
          <p>Create your Sneaker Studio account with a secure password.</p>
        </div>

        <Card className="backdrop-blur bg-card/90 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <ShieldPlus className="size-5 text-primary" />
              Create account
            </CardTitle>
            <CardDescription>Passwords are hashed locally with bcrypt.</CardDescription>
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

            {existingUser && (
              <div className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Saved user detected</p>
                <p>{existingUser.email}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Created at {new Date(existingUser.createdAt).toLocaleString()}
                </p>
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <span className={`text-xs font-medium ${toneClass}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Use 8+ characters, symbols, numbers"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="new-password"
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
                    {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      passwordStrength.score >= 4
                        ? "bg-emerald-500"
                        : passwordStrength.score === 3
                          ? "bg-amber-500"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <ul className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                  <li className={password.length >= 8 ? "text-emerald-500" : ""}>8+ characters</li>
                  <li className={/[A-Z]/.test(password) ? "text-emerald-500" : ""}>Uppercase</li>
                  <li className={/\d/.test(password) ? "text-emerald-500" : ""}>Number</li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? "text-emerald-500" : ""}>
                    Symbol
                  </li>
                </ul>
                {errors.password && (
                  <p id="password-error" className="text-destructive text-sm">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmVisible ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                    autoComplete="new-password"
                    required
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="absolute right-1.5 top-1.5 text-muted-foreground"
                    onClick={() => setConfirmVisible((prev) => !prev)}
                    aria-label={confirmVisible ? "Hide confirm password" : "Show confirm password"}
                  >
                    {confirmVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-error" className="text-destructive text-sm">
                    {errors.confirmPassword}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
              <p className="font-semibold">Local-only signup</p>
              <p className="mt-1">
                We hash your password with bcryptjs and store it under{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">{USER_KEY}</code> in
                localStorage. No network calls are made.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )

}


