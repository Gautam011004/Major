"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

export default function ApplyPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [previousExperience, setPreviousExperience] = useState("")
  const [whyJoin, setWhyJoin] = useState("")

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects?projectId=${projectId}`)
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!previousExperience.trim() || !whyJoin.trim()) {
      alert("Please fill in all fields")
      return
    }

    setSubmitting(true)
    
    try {
      const username = localStorage.getItem("username")
      if (!username) {
        alert("Please sign in to apply")
        router.push("/signin")
        return
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: parseInt(projectId),
          username,
          previousExperience,
          whyJoin,
        }),
      })

      if (response.ok) {
        alert("Application submitted successfully!")
        router.push("/dashboard")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application")
    } finally {
      setSubmitting(false)
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
            LOADING_PROJECT...
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
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="mb-6 border-cyan-400/30 hover:bg-cyan-400/10 bg-black/60 text-cyan-300 font-mono"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Project Info Card */}
          {project && (
            <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg mb-8">
              <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase mb-2">
                    {project.title}
                  </h2>
                  <p className="text-cyan-300 font-mono text-sm tracking-[0.1em] uppercase mb-4">
                    {project.professor} • {project.department}
                  </p>
                  <p className="text-cyan-100/90 text-sm font-mono leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Application Form */}
          <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg">
            <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase mb-6">
                  Application Form
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="experience" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                      Previous Research Experience
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Describe your previous research experience, relevant coursework, or projects..."
                      value={previousExperience}
                      onChange={(e) => setPreviousExperience(e.target.value)}
                      className="min-h-[150px] bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="whyJoin" className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase">
                      Why do you want to join this research?
                    </Label>
                    <Textarea
                      id="whyJoin"
                      placeholder="Explain your motivation and interest in this research project..."
                      value={whyJoin}
                      onChange={(e) => setWhyJoin(e.target.value)}
                      className="min-h-[150px] bg-slate-900/60 border-cyan-400/30 focus:ring-cyan-400 focus:border-cyan-400 text-cyan-100 font-mono placeholder:text-slate-500 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                  >
                    {submitting ? "SUBMITTING..." : "SUBMIT_APPLICATION"}
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
