"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
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


      <div className="w-full max-w-6xl relative z-10">
        {/* Angular border frame */}
        <div className="relative p-[2px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-sm"></div>

          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-cyan-400"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-cyan-400"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>

          <Card className="relative bg-black/80 backdrop-blur-md border-0 shadow-2xl h-[80vh]">
            <CardContent className="p-8 h-full flex flex-col justify-between items-center text-center">
              {/* Main heading */}
              <div className="space-y-4">
                <h2
                  className="text-4xl md:text-6xl font-black text-cyan-400 tracking-tight pb-4"
                  style={{
                    fontFamily: 'Impact, "Arial Black", sans-serif',
                    textShadow:
                      "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3), 0 0 3px rgba(255, 255, 255, 0.4)",
                    letterSpacing: "0.02em",
                    transform: "skew(-8deg, 0deg)",
                  }}
                >
                  RESEARCH BRIDGE
                </h2>
                
                <div className="space-y-3 pt-2 pb-2">
                  <h3 className="text-xl md:text-3xl font-bold text-cyan-300 font-mono tracking-[0.1em] uppercase">
                    Connecting Students with Researchers
                  </h3>
                  
                  <p className="text-base md:text-lg text-cyan-100/90 font-mono max-w-3xl mx-auto leading-relaxed">
                    Connecting research minds, one idea at a time<br/>
                    We bring students and professors from diverse institutions together because breakthroughs happen when knowledge meets opportunity.
                  </p>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="space-y-2 p-4 bg-slate-900/40 rounded-lg border border-cyan-400/20">
                  <div className="text-2xl text-cyan-400">🔬</div>
                  <h4 className="text-lg font-bold text-cyan-300 font-mono uppercase tracking-[0.1em]">
                    Find Research
                  </h4>
                  <p className="text-cyan-100/80 text-xs font-mono">
                    Discover cutting-edge research projects that match your interests and skills
                  </p>
                </div>
                
                <div className="space-y-2 p-4 bg-slate-900/40 rounded-lg border border-cyan-400/20">
                  <div className="text-2xl text-cyan-400">🤝</div>
                  <h4 className="text-lg font-bold text-cyan-300 font-mono uppercase tracking-[0.1em]">
                    Connect & Collaborate
                  </h4>
                  <p className="text-cyan-100/80 text-xs font-mono">
                    Network with researchers and join collaborative research teams
                  </p>
                </div>
                
                <div className="space-y-2 p-4 bg-slate-900/40 rounded-lg border border-cyan-400/20">
                  <div className="text-2xl text-cyan-400">🚀</div>
                  <h4 className="text-lg font-bold text-cyan-300 font-mono uppercase tracking-[0.1em]">
                    Accelerate Growth
                  </h4>
                  <p className="text-cyan-100/80 text-xs font-mono">
                    Fast-track your academic and professional development
                  </p>
                </div>
              </div>
              <p className="text-base md:text-lg text-cyan-100/90 font-mono max-w-3xl mx-auto leading-relaxed p-2">
                    "Collaboration is the spark that turns research into discovery"
                  </p>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="px-8 py-3 text-base bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-mono font-bold tracking-[0.15em] uppercase border border-cyan-400/50 shadow-lg shadow-cyan-500/25 hover:cursor-pointer"
                >
                  Get Started -{'>'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
