"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"

export default function ReviewApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.applicationId as string
  
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const username = localStorage.getItem("username")
        if (!username) {
          router.push("/signin")
          return
        }

        // Fetch all applications and find the specific one
        const response = await fetch(`/api/applications?username=${username}`)
        const applications = await response.json()
        
        const app = applications.find((a: any) => a.id === parseInt(applicationId))
        
        if (!app) {
          alert("Application not found")
          router.push("/dashboard")
          return
        }
        
        setApplication(app)
      } catch (error) {
        console.error("Error fetching application:", error)
        alert("Failed to load application")
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      fetchApplication()
    }
  }, [applicationId, router])

  const handleDecision = async (status: string) => {
    if (!confirm(`The candidate will be ${status}, Are you sure?`)) {
      return
    }

    setProcessing(true)
    
    try {
      const response = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: parseInt(applicationId),
          status,
        }),
      })

      if (response.ok) {
        alert(`Application ${status} successfully!`)
        router.push("/dashboard")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update application")
      }
    } catch (error) {
      console.error("Error updating application:", error)
      alert("Failed to update application")
    } finally {
      setProcessing(false)
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
            LOADING_APPLICATION...
          </p>
        </div>
      </div>
    )
  }

  if (!application) {
    return null
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

          <h1 className="text-3xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase mb-8">
            Application Review
          </h1>

          {/* Student Info Card */}
          <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg mb-6">
            <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase mb-4">
                  Student Information
                </h2>
                <div className="space-y-2 text-cyan-100 font-mono">
                  <p><span className="text-cyan-300">Full Name:</span> {application.name}</p>
                  <p><span className="text-cyan-300">Email:</span> {application.email}</p>
                  {application.university && <p><span className="text-cyan-300">University:</span> {application.university}</p>}
                  {application.batch && <p><span className="text-cyan-300">Batch:</span> {application.batch}</p>}
                  {application.department && <p><span className="text-cyan-300">Department:</span> {application.department}</p>}
                  <p><span className="text-cyan-300">Project Applied:</span> {application.projectTitle}</p>
                  <p><span className="text-cyan-300">Applied Date:</span> {application.appliedDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Previous Experience Card */}
          <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg mb-6">
            <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
              <CardContent className="p-6">
                <Label className="text-cyan-300 font-mono text-sm tracking-[0.2em] uppercase mb-3 block">
                  Previous Research Experience
                </Label>
                <p className="text-cyan-100/90 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {application.previousExperience || "No information provided"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Join Card */}
          <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg mb-8">
            <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
              <CardContent className="p-6">
                <Label className="text-cyan-300 font-mono text-sm tracking-[0.2em] uppercase mb-3 block">
                  Why They Want to Join
                </Label>
                <p className="text-cyan-100/90 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {application.whyJoin || "No information provided"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {application.status === "pending" && (
            <div className="flex gap-4">
              <Button
                onClick={() => handleDecision("accepted")}
                disabled={processing}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-green-400/50 shadow-lg shadow-green-500/25"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {processing ? "PROCESSING..." : "ACCEPT_APPLICATION"}
              </Button>
              <Button
                onClick={() => handleDecision("rejected")}
                disabled={processing}
                className="flex-1 h-12 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-red-400/50 shadow-lg shadow-red-500/25"
              >
                <XCircle className="h-5 w-5 mr-2" />
                {processing ? "PROCESSING..." : "REJECT_APPLICATION"}
              </Button>
            </div>
          )}

          {application.status !== "pending" && (
            <div className="text-center">
              <span className={`inline-block px-6 py-3 rounded font-mono text-lg uppercase ${
                application.status === "accepted" 
                  ? "bg-green-500/20 text-green-400 border border-green-400/50" 
                  : "bg-red-500/20 text-red-400 border border-red-400/50"
              }`}>
                Application {application.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
