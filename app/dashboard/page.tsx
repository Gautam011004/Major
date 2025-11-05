"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { User, FileText, Briefcase, FolderOpen, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

export default function Dashboard() {
  const [filter, setFilter] = useState("all")
  const [activeView, setActiveView] = useState<"all" | "applied" | "working" | "applicants" | "myprojects">("all")
  const [userType, setUserType] = useState<"student" | "professor" | null>(null)
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [researchProjects, setResearchProjects] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const router = useRouter()

  // Fetch user data and projects from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get username from localStorage or session (set during login)
        const username = localStorage.getItem("username")
        
        if (!username) {
          // If no user is logged in, redirect to signin
          router.push("/signin")
          return
        }

        // Fetch user data from your API
        const response = await fetch(`/api/user?username=${username}`)
        const userData = await response.json()
        
        if (userData && userData.usertype) {
          setUserType(userData.usertype)
          setUserId(userData.id)
          // Set default view based on user type
          setActiveView(userData.usertype === "student" ? "all" : "applicants")
        } else {
          // If user not found, redirect to signin
          router.push("/signin")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Fetch projects and applicants based on user type and active view
  useEffect(() => {
    const fetchData = async () => {
      if (!userType || !userId) return

      setDataLoading(true)
      try {
        const username = localStorage.getItem("username")
        if (!username) return

        if (userType === "professor") {
          // Fetch applicants for professor
          const appsResponse = await fetch(`/api/applications?username=${username}`)
          const appsData = await appsResponse.json()
          setApplicants(Array.isArray(appsData) ? appsData : [])

          // Fetch professor's projects
          if (activeView === "myprojects") {
            const projResponse = await fetch(`/api/projects?professorId=${userId}`)
            const projData = await projResponse.json()
            setResearchProjects(Array.isArray(projData) ? projData : [])
          }
        } else {
          // Fetch projects for students
          let url = "/api/projects"
          
          if (activeView === "applied") {
            url = `/api/projects?studentId=${userId}&view=applied`
          } else if (activeView === "working") {
            url = `/api/projects?studentId=${userId}&view=working`
          } else if (activeView === "all") {
            // For available projects, exclude already applied projects
            url = `/api/projects?studentId=${userId}&view=available`
          }

          const response = await fetch(url)
          const data = await response.json()
          console.log("Fetched data:", data) // Debug log
          setResearchProjects(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setResearchProjects([])
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [userType, userId, activeView])

  // Filter projects by category
  let filteredProjects = Array.isArray(researchProjects) 
    ? (filter === "all" 
        ? researchProjects 
        : researchProjects.filter(project => project.type === filter))
    : []
  
  // For working view, only show accepted applications
  if (userType === "student" && activeView === "working") {
    filteredProjects = filteredProjects.filter(project => project.applicationStatus === "accepted")
  }
  
  // Filter applicants by category
  const filteredApplicants = Array.isArray(applicants)
    ? (filter === "all" 
        ? applicants 
        : applicants.filter(app => {
            const project = researchProjects.find(p => p.id === app.projectId)
            return project && project.type === filter
          }))
    : []

  // Handle student applying to a project
  const handleApply = (projectId: number) => {
    router.push(`/apply/${projectId}`)
  }

  // Handle professor accepting/rejecting application
  const handleApplicationAction = async (applicationId: number, status: string) => {
    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      })

      alert(`Application ${status}!`)
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error("Error updating application:", error)
      alert("Failed to update application")
    }
  }

  // Show loading state while fetching user data
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
            LOADING_DASHBOARD...
          </p>
        </div>
      </div>
    )
  }

  // If no user type after loading, don't render
  if (!userType) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen relative overflow-hidden flex w-full">
        {/* Video background */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg2-tLU0DEFgAsUZ02DIGR1zvmOZASOwHW.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-1" />

        {/* Sidebar */}
        <Sidebar className="border-r border-cyan-400/20" collapsible="icon">
          <SidebarContent className="bg-black/80 backdrop-blur-md">
            <SidebarGroup>
              <SidebarGroupLabel className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase px-4 py-3">
                {userType === "student" ? "Student Menu" : "Professor Menu"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userType === "student" ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveView("all")}
                          isActive={activeView === "all"}
                          className="text-cyan-300 hover:bg-cyan-400/20 data-[active=true]:bg-cyan-400/30 data-[active=true]:text-cyan-100 font-mono"
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span>Available Projects</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveView("applied")}
                          isActive={activeView === "applied"}
                          className="text-cyan-300 hover:bg-cyan-400/20 data-[active=true]:bg-cyan-400/30 data-[active=true]:text-cyan-100 font-mono"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Applied Projects</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveView("working")}
                          isActive={activeView === "working"}
                          className="text-cyan-300 hover:bg-cyan-400/20 data-[active=true]:bg-cyan-400/30 data-[active=true]:text-cyan-100 font-mono"
                        >
                          <Briefcase className="h-4 w-4" />
                          <span>Working On</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  ) : (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveView("applicants")}
                          isActive={activeView === "applicants"}
                          className="text-cyan-300 hover:bg-cyan-400/20 data-[active=true]:bg-cyan-400/30 data-[active=true]:text-cyan-100 font-mono"
                        >
                          <User className="h-4 w-4" />
                          <span>Applicants</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveView("myprojects")}
                          isActive={activeView === "myprojects"}
                          className="text-cyan-300 hover:bg-cyan-400/20 data-[active=true]:bg-cyan-400/30 data-[active=true]:text-cyan-100 font-mono"
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span>My Projects</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <SidebarInset className="flex-1">{/* Top bar with filter (left) and profile (right) */}

          <div className="relative z-10 p-4">
            {/* Top bar with filter (left) and profile (right) */}
            <div className="flex items-center justify-between mb-8">
        {/* Sidebar trigger + Filter */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-cyan-300 hover:bg-cyan-400/20 border border-cyan-400/20 bg-black/60 backdrop-blur-md" />
          <div className="relative">
          <div className="relative p-[1px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-black/80 backdrop-blur-md border-cyan-400/30 text-cyan-300 font-mono text-xs tracking-[0.1em] uppercase">
                <SelectValue placeholder="FILTER_PROJECTS" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-cyan-400/30">
                <SelectItem value="all" className="text-cyan-300 font-mono uppercase focus:bg-cyan-400/20">ALL_PROJECTS</SelectItem>
                <SelectItem value="ai" className="text-cyan-300 font-mono uppercase focus:bg-cyan-400/20">AI_RESEARCH</SelectItem>
                <SelectItem value="physics" className="text-cyan-300 font-mono uppercase focus:bg-cyan-400/20">PHYSICS</SelectItem>
                <SelectItem value="engineering" className="text-cyan-300 font-mono uppercase focus:bg-cyan-400/20">ENGINEERING</SelectItem>
                <SelectItem value="biology" className="text-cyan-300 font-mono uppercase focus:bg-cyan-400/20">BIOLOGY</SelectItem>
                <SelectItem value="chemistry" className="text-cyan-300 font-mono uppercase focus:bg-cyan-400/20">CHEMISTRY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>

        {/* Create New Project button (professors only) + Profile dropdown */}
        <div className="flex items-center gap-3">
          {userType === "professor" && (
            <Button
              onClick={() => router.push('/create-project')}
              className="h-10 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
          
        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 rounded-full bg-black/60 border border-cyan-400/20 backdrop-blur-md hover:bg-black/80 hover:border-cyan-400/40 flex items-center justify-center transition-all">
              <User className="h-5 w-5 text-cyan-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-black/90 backdrop-blur-md border-cyan-400/30">
            <DropdownMenuItem
              className="text-cyan-300 font-mono cursor-pointer focus:bg-cyan-400/20 focus:text-cyan-100"
              onClick={() => router.push('/profile')}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400 font-mono cursor-pointer focus:bg-red-400/20 focus:text-red-300"
              onClick={() => {
                localStorage.removeItem("username")
                router.push('/signin')
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

            {/* Content Area - Show applicants for professors, projects for students */}
            {dataLoading ? (
              /* Loading State */
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                  <p className="text-cyan-300 font-mono text-lg tracking-[0.1em] uppercase">
                    LOADING_DATA...
                  </p>
                </div>
              </div>
            ) : userType === "professor" && activeView === "applicants" ? (
              /* Applicants Table for Professors */
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase mb-6">
                  Student Applicants
                </h2>
                <div className="space-y-4">
                  {filteredApplicants.map((applicant) => {
                    return (
                      <div key={applicant.id} className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-sm rounded-lg"></div>
                        
                        <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase">
                                  {applicant.name}
                                </h3>
                                <p className="text-cyan-300 font-mono text-sm tracking-[0.1em] mt-1">
                                  {applicant.email}
                                </p>
                                <p className="text-cyan-100/90 text-sm font-mono mt-2">
                                  Applied to: <span className="text-cyan-400">{applicant.projectTitle}</span>
                                </p>
                                <p className="text-cyan-100/70 text-xs font-mono mt-1">
                                  Applied on: {applicant.appliedDate}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => router.push(`/review/${applicant.id}`)}
                                  className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-400/50 font-mono uppercase"
                                >
                                  Review
                                </Button>
                                {applicant.status !== "pending" && (
                                  <span className={`px-3 py-1 rounded font-mono text-xs uppercase ${
                                    applicant.status === "accepted" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                  }`}>
                                    {applicant.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                  
                  {!dataLoading && filteredApplicants.length === 0 && (
                    <div className="text-center mt-16">
                      <p className="text-cyan-300 font-mono text-lg tracking-[0.1em] uppercase">
                        NO_APPLICANTS_FOUND
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Projects Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {Array.isArray(filteredProjects) ? filteredProjects.map((project) => (
          <div key={project.id} className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-sm rounded-lg"></div>
            
            {/* Corner decorations */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-cyan-400"></div>

            <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl rounded-lg h-full">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header section */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-[0.05em] uppercase">
                    {project.title}
                  </h3>
                  <p className="text-cyan-300 font-mono text-sm tracking-[0.1em] uppercase">
                    {project.professor} • {project.department}
                  </p>
                </div>

                {/* Description section - flex-grow to take available space */}
                <div className="flex-grow">
                  <p className="text-cyan-100/90 text-sm font-mono leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer section - always at bottom */}
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between text-xs font-mono text-cyan-300 uppercase tracking-[0.1em]">
                    <span>Duration: {project.duration}</span>
                    <span className={`px-2 py-1 rounded ${
                      project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  {userType === "student" && activeView !== "working" && (
                    <Button
                      onClick={() => handleApply(project.id)}
                      disabled={project.applicationStatus}
                      className="w-full h-10 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {project.applicationStatus ? `Status: ${project.applicationStatus}` : "Apply_Now"}
                    </Button>
                  )}

                  {userType === "student" && activeView === "working" && project.applicationStatus === "accepted" && (
                    <div className="w-full flex items-center justify-center">
                      <span className="px-4 py-2 rounded font-mono text-sm uppercase bg-green-500/20 text-green-400">
                        Enrolled
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
          </Card>
        </div>
      )) : null}
              </div>
            )}
            
            {/* No results message for projects */}
            {!dataLoading && (userType === "student" || activeView === "myprojects") && filteredProjects.length === 0 && (
              <div className="text-center mt-16">
                <p className="text-cyan-300 font-mono text-lg tracking-[0.1em] uppercase">
                  NO_PROJECTS_FOUND
                </p>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}