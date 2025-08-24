"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  Star,
  Building,
  FileText,
  Award,
  Sparkles
} from 'lucide-react'

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])

  // Fade in animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Animated counter effect
  useEffect(() => {
    if (isVisible) {
      const targetValues = [50000, 95, 3, 2]
      const duration = 2000 // 2 seconds
      const steps = 60 // 60 steps for smooth animation
      const increment = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setAnimatedStats([
          Math.floor(targetValues[0] * progress),
          Math.floor(targetValues[1] * progress),
          Math.floor(targetValues[2] * progress),
          Math.floor(targetValues[3] * progress)
        ])

        if (currentStep >= steps) {
          clearInterval(timer)
          setAnimatedStats(targetValues)
        }
      }, increment)

      return () => clearInterval(timer)
    }
  }, [isVisible])

  const mainStats = [
    {
      icon: Users,
      value: `${animatedStats[0].toLocaleString()}+`,
      label: "Professionals Helped",
      description: "Active users worldwide",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      value: `${animatedStats[1]}%`,
      label: "ATS Success Rate",
      description: "Resumes passing ATS filters",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Target,
      value: `${animatedStats[2]}x`,
      label: "More Interviews",
      description: "Average improvement",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      value: `${animatedStats[3]} min`,
      label: "Analysis Time",
      description: "Lightning-fast results",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const additionalStats = [
    {
      icon: Building,
      value: "500+",
      label: "Companies",
      description: "Fortune 500 companies represented"
    },
    {
      icon: FileText,
      value: "1M+",
      label: "Resumes",
      description: "Successfully analyzed"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Rating",
      description: "User satisfaction score"
    },
    {
      icon: Award,
      value: "15+",
      label: "Awards",
      description: "Industry recognition"
    }
  ]

  const achievements = [
    "🏆 Best AI Career Tool 2024",
    "⭐ TrustPilot Excellence Award",
    "🚀 Fastest Growing Career Platform",
    "💼 HR Technology Innovation Award"
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Sparkles className="h-4 w-4 mr-1" />
            Proven Impact
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by Professionals
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform delivers measurable results that help professionals 
            advance their careers and achieve their goals faster than ever before.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {additionalStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className={`text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            )
          })}
        </div>

        {/* Achievements Banner */}
        <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '1000ms' }}>
          <h3 className="text-2xl font-bold mb-6">Industry Recognition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
              >
                {achievement}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Text */}
        <div className={`text-center mt-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '1200ms' }}>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their careers with 
            <span className="font-semibold text-blue-600"> CareerCraft AI</span>. 
            Your success story starts here.
          </p>
        </div>
      </div>
    </section>
  )
}