"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userType, setUserType] = useState<"student" | "professor" | null>(null)
  
  const [fullname, setFullname] = useState("")
  const [university, setUniversity] = useState("")
  const [batch, setBatch] = useState("")
  const [department, setDepartment] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const username = localStorage.getItem("username")
        if (!username) {
          router.push("/signin")
          return
        }

        const response = await fetch(`/api/user?username=${username}`)
        const userData = await response.json()
        
        if (userData) {
          setUserType(userData.usertype)
          setFullname(userData.fullname || "")
          setUniversity(userData.university || "")
          setBatch(userData.batch ? userData.batch.toString() : "")
          setDepartment(userData.department || "")
        } else {
          router.push("/signin")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullname || !university || !department) {
      alert("Please fill in all required fields")
      return
    }

    if (userType === "student" && !batch) {
      alert("Please fill in your batch")
      return
    }

    setSaving(true)
    
    try {
      const username = localStorage.getItem("username")
      if (!username) return

      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullname,
          university,
          batch: batch ? parseInt(batch) : null,
          department,
        }),
      })

      if (response.ok) {
        alert("Profile updated successfully!")
        router.push("/dashboard")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg2-tLU0DEFgAsUZ02DIGR1zvmOZASOwHW.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-1" />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300 font-mono text-lg tracking-[0.1em] uppercase">
            LOADING_PROFILE...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg2-tLU0DEFgAsUZ02DIGR1zvmOZASOwHW.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 z-1" />

      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="mb-6 border-cyan-400/30 hover:bg-cyan-400/10 bg-black/60 text-cyan-300 font-mono"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase mb-8">
            {userType === "student" ? "Student Profile" : "Professor Profile"}
          </h1>

          {/* Profile Form */}
          <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg">
            <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullname" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                      Full Name *
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="John Doe"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="university" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                      University *
                    </Label>
                    <Input
                      id="university"
                      type="text"
                      placeholder="Your University"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                      required
                    />
                  </div>

                  {userType === "student" && (
                    <div className="space-y-3">
                      <Label htmlFor="batch" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                        Batch (Year) *
                      </Label>
                      <Input
                        id="batch"
                        type="number"
                        placeholder="2024"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="department" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="Computer Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "SAVING..." : "SAVE_PROFILE"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
