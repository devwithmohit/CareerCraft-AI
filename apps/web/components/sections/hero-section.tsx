"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, FileText, Target, Users, Sparkles, Play, CheckCircle } from 'lucide-react'

export function HeroSection() {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const rotatingTexts = [
    "Resume Analysis",
    "Job Matching", 
    "Interview Prep",
    "Career Growth"
  ]

  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Fade in animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    { icon: Brain, text: "AI-Powered Analysis" },
    { icon: Target, text: "ATS Optimization" },
    { icon: Users, text: "Expert Insights" },
  ]

  const stats = [
    { value: "50K+", label: "Resumes Optimized" },
    { value: "95%", label: "ATS Success Rate" },
    { value: "3x", label: "More Interviews" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] opacity-30"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Announcement Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">New: AI Interview Coach Now Available</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">Beta</Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Master Your Career with
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              AI-Powered{" "}
              <span className="relative inline-block">
                <span className="transition-all duration-500 ease-in-out">
                  {rotatingTexts[currentText]}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your career journey with intelligent resume optimization, 
            personalized job matching, and AI-driven interview preparation. 
            <span className="font-semibold text-gray-800"> Get hired 3x faster.</span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/resume-analysis" className="flex items-center">
                Analyze Resume Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-8 py-4 text-lg font-semibold group"
              asChild
            >
              <Link href="#demo" className="flex items-center">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-6">Trusted by professionals at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Company logos would go here */}
              <div className="text-gray-400 font-semibold text-lg">Google</div>
              <div className="text-gray-400 font-semibold text-lg">Microsoft</div>
              <div className="text-gray-400 font-semibold text-lg">Amazon</div>
              <div className="text-gray-400 font-semibold text-lg">Apple</div>
              <div className="text-gray-400 font-semibold text-lg">Netflix</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce delay-1000">
        <FileText className="h-8 w-8 text-blue-400/50" />
      </div>
      <div className="absolute top-40 right-10 animate-bounce delay-2000">
        <Target className="h-6 w-6 text-purple-400/50" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
        <Brain className="h-10 w-10 text-blue-500/30" />
      </div>
    </section>
  )
}