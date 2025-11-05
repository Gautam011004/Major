"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

export default function CreateProject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    difficulty: "Intermediate",
    type: "ai",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const username = localStorage.getItem("username")
      if (!username) {
        alert("Please log in first")
        router.push("/signin")
        return
      }

      await axios.post("http://localhost:3000/api/projects", {
        ...formData,
        username,
      })

      alert("Project created successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating project:", error)
      alert(error.response?.data?.error || "Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Video background */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg2-tLU0DEFgAsUZ02DIGR1zvmOZASOwHW.mp4" type="video/mp4" />
      </video>

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
          CREATE PROJECT
        </h1>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-sm"></div>

          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

          <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., AI in Healthcare"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the research project..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 min-h-[120px]"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <Label htmlFor="duration" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    type="text"
                    placeholder="e.g., 6 months"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 h-12"
                    required
                  />
                </div>

                {/* Type */}
                <div className="space-y-3">
                  <Label htmlFor="type" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    Category
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-slate-900/60 border-cyan-400/30 text-cyan-300 font-mono h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-400/30">
                      <SelectItem value="ai" className="text-cyan-300 font-mono">AI Research</SelectItem>
                      <SelectItem value="physics" className="text-cyan-300 font-mono">Physics</SelectItem>
                      <SelectItem value="engineering" className="text-cyan-300 font-mono">Engineering</SelectItem>
                      <SelectItem value="biology" className="text-cyan-300 font-mono">Biology</SelectItem>
                      <SelectItem value="chemistry" className="text-cyan-300 font-mono">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div className="space-y-3">
                  <Label htmlFor="difficulty" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                    Difficulty Level
                  </Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger className="bg-slate-900/60 border-cyan-400/30 text-cyan-300 font-mono h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-400/30">
                      <SelectItem value="Beginner" className="text-cyan-300 font-mono">Beginner</SelectItem>
                      <SelectItem value="Intermediate" className="text-cyan-300 font-mono">Intermediate</SelectItem>
                      <SelectItem value="Advanced" className="text-cyan-300 font-mono">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="flex-1 h-12 border-cyan-400/30 hover:bg-cyan-400/10 bg-slate-900/40 text-cyan-300 font-mono tracking-[0.15em] uppercase"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25"
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
