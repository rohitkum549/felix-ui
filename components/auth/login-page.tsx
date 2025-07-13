"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showSignup, setShowSignup] = useState(false)
  const [useSimpleForm, setUseSimpleForm] = useState(false)
  const [signupUsername, setSignupUsername] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      
      // Show success toast
      toast({
        title: "Login Successful!",
        description: "Welcome back! Redirecting to dashboard...",
        variant: "default",
      })
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null)
    setSignupSuccess(false)
    if (!signupUsername || !signupPassword || !signupConfirm) {
      setSignupError("All fields are required.")
      return
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.")
      return
    }
    // For now, just show success (no real registration logic)
    setSignupSuccess(true)
    setSignupUsername("")
    setSignupPassword("")
    setSignupConfirm("")
    setTimeout(() => {
      setShowSignup(false)
      setSignupSuccess(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="w-full max-w-md p-10 bg-gray-800/90 border border-gray-700 rounded-3xl shadow-2xl backdrop-blur-md">
        {/* Removed Logo/Brand area */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">{showSignup ? "Sign Up" : "Login"}</h3>
          <p className="text-white/70">{showSignup ? "Create your account" : "Enter your credentials to access the dashboard"}</p>
        </div>
        {showSignup ? (
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={e => setSignupUsername(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirm}
                onChange={e => setSignupConfirm(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                required
              />
            </div>
            {signupError && <div className="text-red-400 text-sm text-center">{signupError}</div>}
            {signupSuccess && <div className="text-green-400 text-sm text-center">Signup successful! Please login.</div>}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 font-medium py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 font-medium py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        )}
        <div className="mt-6 text-center">
          {showSignup ? (
            <>
              <span className="text-white/60">Already have an account? </span>
              <button 
                className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:rounded transition-all duration-150 px-1 py-0.5" 
                type="button" 
                onClick={() => setShowSignup(false)}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <span className="text-white/60">Don't have an account? </span>
              <button 
                className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:rounded transition-all duration-150 px-1 py-0.5" 
                type="button" 
                onClick={() => setShowSignup(true)}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
