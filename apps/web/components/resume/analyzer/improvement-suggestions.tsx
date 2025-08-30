"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { SparklesCore } from '@/components/ui/sparkles'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'
import { 
  Lightbulb,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Eye,
  Download,
  Share2,
  RotateCcw,
  Brain,
  Gauge,
  Award,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Copy,
  ExternalLink,
  Clock,
  Users,
  DollarSign,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Animated Counter Component
const AnimatedCounter = ({ value, delay = 0, className }: {
  value: number
  delay?: number
  className?: string
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000
      const increment = value / (duration / 50)
      let current = 0

      const counter = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(counter)
        } else {
          setCount(Math.floor(current))
        }
      }, 50)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return <span className={className}>{count}</span>
}

// Suggestion Card Component
const SuggestionCard = ({ 
  title, 
  description, 
  impact, 
  effort, 
  category,
  icon: Icon, 
  suggestions = [],
  delay = 0,
  onApply,
  onDismiss 
}: {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  category: string
  icon: React.ElementType
  suggestions?: string[]
  delay?: number
  onApply?: () => void
  onDismiss?: () => void
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getImpactColor = () => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
    }
  }

  const getEffortColor = () => {
    switch (effort) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    }
  }

  return (
    <CardContainer className="w-full">
      <CardBody className="w-full">
        <CardItem translateZ="50" className="w-full">
          <div className={cn(
            "p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform",
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge className={cn("text-xs", getImpactColor())}>
                  {impact} impact
                </Badge>
                <Badge className={cn("text-xs", getEffortColor())}>
                  {effort} effort
                </Badge>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specific Suggestions:
                </h4>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-1">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 justify-end">
              <Button size="sm" variant="outline" onClick={onDismiss}>
                <ThumbsDown className="mr-1 h-3 w-3" />
                Dismiss
              </Button>
              <Button size="sm" onClick={onApply}>
                <ThumbsUp className="mr-1 h-3 w-3" />
                Apply
              </Button>
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

// Sample Suggestions Data
const suggestionsData = [
  {
    title: "Add Quantifiable Achievements",
    description: "Replace vague statements with specific, measurable accomplishments",
    impact: 'high' as const,
    effort: 'medium' as const,
    category: "Content Quality",
    icon: Target,
    suggestions: [
      "Change 'Managed team' to 'Managed 5-person team, increasing productivity by 25%'",
      "Add specific metrics to your project descriptions",
      "Include percentage improvements and dollar amounts"
    ]
  },
  {
    title: "Optimize Keyword Placement",
    description: "Move important keywords to the top of your resume sections",
    impact: 'high' as const,
    effort: 'low' as const,
    category: "ATS Optimization",
    icon: Zap,
    suggestions: [
      "Place job-specific keywords in the first 1/3 of your resume",
      "Use exact phrases from the job description",
      "Include both singular and plural forms of keywords"
    ]
  },
  {
    title: "Improve Section Headings",
    description: "Use standard section headings that ATS systems can easily parse",
    impact: 'medium' as const,
    effort: 'low' as const,
    category: "Formatting",
    icon: Eye,
    suggestions: [
      "Use 'Work Experience' instead of 'Professional Background'",
      "Ensure consistent formatting for all headings",
      "Avoid creative or stylized fonts for headings"
    ]
  },
  {
    title: "Add Industry Certifications",
    description: "Include relevant certifications to boost credibility",
    impact: 'medium' as const,
    effort: 'medium' as const,
    category: "Credentials",
    icon: Award,
    suggestions: [
      "Add AWS Certified Solutions Architect certification",
      "Include Scrum Master certification if applicable",
      "List certification dates and issuing organizations"
    ]
  },
  {
    title: "Strengthen Summary Section",
    description: "Make your professional summary more compelling and keyword-rich",
    impact: 'high' as const,
    effort: 'medium' as const,
    category: "Content Quality",
    icon: Brain,
    suggestions: [
      "Start with your years of experience and key expertise",
      "Include 3-5 relevant keywords in the first sentence",
      "Highlight your unique value proposition"
    ]
  },
  {
    title: "Update Contact Information",
    description: "Ensure all contact details are current and professional",
    impact: 'low' as const,
    effort: 'low' as const,
    category: "Professionalism",
    icon: Users,
    suggestions: [
      "Use a professional email address",
      "Include LinkedIn profile URL",
      "Add relevant portfolio or GitHub links"
    ]
  }
]

// Improvement Statistics
const improvementStats = [
  {
    id: 1,
    name: "ATS Score Boost",
    designation: "+15% potential increase",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Interview Rate",
    designation: "+20% improvement",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Keyword Match",
    designation: "+25% coverage",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Overall Impact",
    designation: "High Priority",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
]

interface ImprovementSuggestionsProps {
  fileName?: string
  currentScore?: number
  targetScore?: number
  onApplySuggestion?: (suggestionId: string) => void
  onDismissSuggestion?: (suggestionId: string) => void
  onGenerateReport?: () => void
  onExportSuggestions?: () => void
  isLoading?: boolean
  className?: string
}

export default function ImprovementSuggestions({
  fileName = "john-doe-resume.pdf",
  currentScore = 75,
  targetScore = 90,
  onApplySuggestion,
  onDismissSuggestion,
  onGenerateReport,
  onExportSuggestions,
  isLoading = false,
  className
}: ImprovementSuggestionsProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set())
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())
  const [showSparkles, setShowSparkles] = useState(false)

  const potentialScoreIncrease = targetScore - currentScore
  const filteredSuggestions = useMemo(() => {
    if (activeTab === "all") return suggestionsData
    if (activeTab === "high-impact") return suggestionsData.filter(s => s.impact === 'high')
    if (activeTab === "quick-wins") return suggestionsData.filter(s => s.effort === 'low')
    return suggestionsData
  }, [activeTab])

  useEffect(() => {
    if (potentialScoreIncrease >= 15) {
      setShowSparkles(true)
      const timer = setTimeout(() => setShowSparkles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [potentialScoreIncrease])

  const handleApply = (index: number) => {
    const suggestionId = `${activeTab}-${index}`
    setAppliedSuggestions(prev => new Set([...prev, suggestionId]))
    onApplySuggestion?.(suggestionId)
  }

  const handleDismiss = (index: number) => {
    const suggestionId = `${activeTab}-${index}`
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]))
    onDismissSuggestion?.(suggestionId)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6 space-y-8", className)}>
      {/* Header */}
      <div className="text-center">
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            Improvement Suggestions
          </h1>
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={50}
                className="w-full h-full"
                particleColor="#EC4899"
              />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Personalized recommendations for <Badge variant="outline" className="mx-1">{fileName}</Badge>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Current Score: <Badge variant="secondary">{currentScore}%</Badge> → 
          Potential: <Badge className="ml-1 bg-green-100 text-green-800">{targetScore}%</Badge>
        </p>
      </div>

      {/* Overall Impact Section */}
      <CardContainer className="w-full">
        <CardBody className="relative w-full">
          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Potential Improvement */}
              <CardItem translateZ="100" className="text-center">
                <div className="relative">
                  <div className="text-6xl font-bold text-purple-600 mb-2">
                    +<AnimatedCounter value={potentialScoreIncrease} />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Potential Score Increase
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By implementing these suggestions
                  </p>
                </div>
              </CardItem>

              {/* Statistics */}
              <CardItem translateZ="80" className="lg:col-span-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={6} />
                    </p>
                    <p className="text-sm text-gray-500">Suggestions</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={45} />
                    </p>
                    <p className="text-sm text-gray-500">Minutes</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={3} />
                    </p>
                    <p className="text-sm text-gray-500">High Impact</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={2} />
                    </p>
                    <p className="text-sm text-gray-500">Quick Wins</p>
                  </div>
                </div>
              </CardItem>
            </div>

            {/* Improvement Stats */}
            <CardItem translateZ="60" className="mt-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Expected Improvements
                </h3>
                <AnimatedTooltip items={improvementStats} />
              </div>
            </CardItem>

            {/* Action Buttons */}
            <CardItem translateZ="40" className="mt-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={onGenerateReport}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" onClick={onExportSuggestions}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Export Suggestions
                </Button>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      <Separator className="my-8" />

      {/* Suggestions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({suggestionsData.length})</TabsTrigger>
          <TabsTrigger value="high-impact">High Impact</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
          <TabsTrigger value="applied">Applied ({appliedSuggestions.size})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {filteredSuggestions.map((suggestion, index) => {
            const suggestionId = `${activeTab}-${index}`
            const isApplied = appliedSuggestions.has(suggestionId)
            const isDismissed = dismissedSuggestions.has(suggestionId)

            if (activeTab === "applied" && !isApplied) return null
            if (isDismissed) return null

            return (
              <SuggestionCard
                key={index}
                {...suggestion}
                delay={index * 150}
                onApply={() => handleApply(index)}
                onDismiss={() => handleDismiss(index)}
              />
            )
          })}
        </TabsContent>
      </Tabs>

      {/* Progress Summary */}
      <CardContainer className="w-full">
        <CardItem translateZ="50" className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              Implementation Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter value={appliedSuggestions.size} />
                </p>
                <p className="text-sm text-gray-500">Applied</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter value={filteredSuggestions.length - appliedSuggestions.size - dismissedSuggestions.size} />
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter value={dismissedSuggestions.size} />
                </p>
                <p className="text-sm text-gray-500">Dismissed</p>
              </div>
            </div>
          </div>
        </CardItem>
      </CardContainer>
    </div>
  )
}