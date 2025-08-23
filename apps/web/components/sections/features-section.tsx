"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  FileText, 
  Target, 
  Users, 
  Zap, 
  Search, 
  MessageSquare, 
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI Resume Analysis",
      description: "Get instant, comprehensive feedback on your resume with our advanced AI engine",
      benefits: [
        "ATS compatibility scoring",
        "Keyword optimization suggestions", 
        "Industry-specific recommendations",
        "Real-time improvement tracking"
      ],
      gradient: "from-blue-500 to-cyan-500",
      href: "/resume-analysis"
    },
    {
      icon: FileText,
      title: "Smart Resume Builder",
      description: "Create professional resumes with AI-powered content suggestions and templates",
      benefits: [
        "15+ professional templates",
        "AI-generated content suggestions",
        "Auto-formatting and styling",
        "Multi-format export options"
      ],
      gradient: "from-purple-500 to-pink-500",
      href: "/resume-builder"
    },
    {
      icon: Target,
      title: "Intelligent Job Matching",
      description: "Find your perfect job match with AI-powered recommendation engine",
      benefits: [
        "Personalized job recommendations",
        "Skill gap analysis",
        "Salary insights and trends",
        "Company culture matching"
      ],
      gradient: "from-green-500 to-emerald-500",
      href: "/job-search"
    },
    {
      icon: MessageSquare,
      title: "Interview Preparation",
      description: "Practice with AI mock interviews and get personalized feedback",
      benefits: [
        "Industry-specific questions",
        "Real-time feedback analysis",
        "STAR method coaching",
        "Confidence building exercises"
      ],
      gradient: "from-orange-500 to-red-500",
      href: "/interview-prep"
    }
  ]

  const additionalFeatures = [
    {
      icon: BarChart3,
      title: "Career Analytics",
      description: "Track your job search progress with detailed insights",
      comingSoon: false
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with industry professionals and mentors",
      comingSoon: true
    },
    {
      icon: Zap,
      title: "Cover Letter Generator",
      description: "Create compelling cover letters in seconds",
      comingSoon: false
    },
    {
      icon: Search,
      title: "Skill Assessment",
      description: "Evaluate and improve your professional skills",
      comingSoon: true
    },
    {
      icon: Clock,
      title: "Application Tracker",
      description: "Organize and track all your job applications",
      comingSoon: false
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Stay updated with industry trends and salary data",
      comingSoon: false
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Sparkles className="h-4 w-4 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Accelerate Your Career
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you at every stage of your career journey,
            from resume optimization to landing your dream job.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    asChild 
                    className="w-full group-hover:bg-blue-600 transition-colors"
                  >
                    <Link href={feature.href} className="flex items-center justify-center">
                      Try {feature.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">And Much More</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover additional tools and features designed to give you a competitive edge in today's job market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white"
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto p-3 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors w-fit">
                    <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-lg font-semibold">
                      {feature.title}
                    </CardTitle>
                    {feature.comingSoon && (
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who have already accelerated their careers with CareerCraft AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              asChild
            >
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold"
              asChild
            >
              <Link href="/demo">
                Schedule a Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}