"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:3000/api/signin", {
        username: email,
        password: password
      })
      
      if (response.data.user) {
        // Store username in localStorage for session management
        localStorage.setItem("username", response.data.user.username)
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials."
      alert(errorMessage)
    }
  }

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log("Google login")
  }
   const router = useRouter()
  
   const handleGetStarted = () => {
      router.push("/signup")
    }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Video background */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg2-tLU0DEFgAsUZ02DIGR1zvmOZASOwHW.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-1" />

      <div className="relative z-10 mb-8">
        <h1
          className="text-4xl md:text-5xl font-black text-cyan-400 tracking-tight"
          style={{
            fontFamily: 'Impact, "Arial Black", sans-serif',
            textShadow:
              "0 0 15px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.2), 0 0 2px rgba(255, 255, 255, 0.3)",
            letterSpacing: "0.02em",
            transform: "skew(-12deg, 0deg)",
          }}
        >
          RESEARCH BRIDGE
        </h1>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Angular border frame */}
        <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-sm"></div>

          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

          <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    USERNAME
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    PASSWORD_KEY
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25"
                >
                  INITIALIZE_SESSION
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-cyan-400/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-4 text-cyan-300 font-mono tracking-[0.2em]">OR_CONTINUE_WITH</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-12 border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100 bg-slate-900/40 text-cyan-300 font-mono tracking-[0.15em] uppercase"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                GOOGLE_AUTH_PROTOCOL
              </Button>

              <div className="text-center text-sm text-cyan-400 font-mono">
                <span className="text-cyan-300/70 tracking-[0.1em]">NO_ACCOUNT_FOUND? </span>
                <button className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 tracking-[0.1em] uppercase hover:cursor-pointer" onClick={handleGetStarted}>
                  CREATE_NEW_USER
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
