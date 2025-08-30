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
  Search,
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
  Hash,
  Filter,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Copy,
  ExternalLink,
  Lightbulb,
  TrendingDown
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

// Keyword Tag Component with Animation
const KeywordTag = ({ 
  keyword, 
  frequency, 
  importance, 
  status, 
  delay = 0,
  onClick 
}: {
  keyword: string
  frequency: number
  importance: 'high' | 'medium' | 'low'
  status: 'found' | 'missing' | 'suggested'
  delay?: number
  onClick?: () => void
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getStatusStyles = () => {
    switch (status) {
      case 'found':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30',
          text: 'text-green-800 dark:text-green-200',
          border: 'border-green-300 dark:border-green-700',
          icon: CheckCircle
        }
      case 'missing':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30',
          text: 'text-red-800 dark:text-red-200',
          border: 'border-red-300 dark:border-red-700',
          icon: XCircle
        }
      case 'suggested':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-200',
          border: 'border-blue-300 dark:border-blue-700',
          icon: Plus
        }
    }
  }

  const getImportanceColor = () => {
    switch (importance) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
    }
  }

  const styles = getStatusStyles()
  const StatusIcon = styles.icon

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105",
        styles.bg,
        styles.text,
        styles.border,
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      onClick={onClick}
    >
      <StatusIcon className="h-4 w-4" />
      <span className="font-medium">{keyword}</span>
      {frequency > 0 && (
        <Badge variant="secondary" className="text-xs">
          {frequency}x
        </Badge>
      )}
      <div className={cn("w-2 h-2 rounded-full", getImportanceColor())} />
    </div>
  )
}

// Keyword Category Section
const KeywordCategory = ({ 
  title, 
  icon: Icon, 
  keywords, 
  totalFound, 
  totalExpected,
  description,
  suggestions = [],
  delay = 0 
}: {
  title: string
  icon: React.ElementType
  keywords: Array<{
    word: string
    frequency: number
    importance: 'high' | 'medium' | 'low'
    status: 'found' | 'missing' | 'suggested'
  }>
  totalFound: number
  totalExpected: number
  description: string
  suggestions?: string[]
  delay?: number
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const percentage = (totalFound / totalExpected) * 100

  return (
    <CardContainer className="w-full">
      <CardBody className="w-full">
        <CardItem translateZ="50" className="w-full">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            {/* Header */}
            <div 
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter value={totalFound} delay={delay} />
                    <span className="text-sm text-gray-500">/{totalExpected}</span>
                  </div>
                  <div className="text-sm text-gray-500">Keywords</div>
                </div>
                {isExpanded ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
              </div>
            </div>

            {/* Progress Bar */}
            <CardItem translateZ="30" className="mb-4">
              <Progress value={percentage} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Match Rate: {percentage.toFixed(1)}%</span>
                <span>{totalFound} found</span>
              </div>
            </CardItem>

            {/* Keywords Grid */}
            {isExpanded && (
              <CardItem translateZ="20" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <KeywordTag
                      key={keyword.word}
                      keyword={keyword.word}
                      frequency={keyword.frequency}
                      importance={keyword.importance}
                      status={keyword.status}
                      delay={delay + index * 50}
                      onClick={() => console.log(`Clicked: ${keyword.word}`)}
                    />
                  ))}
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Suggestions to Improve
                      </h4>
                    </div>
                    <ul className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs text-yellow-700 dark:text-yellow-300 flex items-start space-x-1">
                          <span className="text-yellow-500 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardItem>
            )}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

// Sample Data
const keywordData = [
  {
    title: "Technical Skills",
    icon: Brain,
    totalFound: 12,
    totalExpected: 15,
    description: "Programming languages, frameworks, and tools",
    keywords: [
      { word: "JavaScript", frequency: 5, importance: 'high' as const, status: 'found' as const },
      { word: "React", frequency: 3, importance: 'high' as const, status: 'found' as const },
      { word: "Node.js", frequency: 2, importance: 'medium' as const, status: 'found' as const },
      { word: "Python", frequency: 0, importance: 'high' as const, status: 'missing' as const },
      { word: "TypeScript", frequency: 0, importance: 'medium' as const, status: 'missing' as const },
      { word: "Docker", frequency: 0, importance: 'low' as const, status: 'suggested' as const },
    ],
    suggestions: [
      "Add Python experience if you have any",
      "Include TypeScript in your skills section",
      "Mention specific React projects"
    ]
  },
  {
    title: "Soft Skills",
    icon: Target,
    totalFound: 8,
    totalExpected: 10,
    description: "Communication, leadership, and interpersonal skills",
    keywords: [
      { word: "Leadership", frequency: 2, importance: 'high' as const, status: 'found' as const },
      { word: "Communication", frequency: 3, importance: 'high' as const, status: 'found' as const },
      { word: "Problem Solving", frequency: 1, importance: 'medium' as const, status: 'found' as const },
      { word: "Team Collaboration", frequency: 0, importance: 'high' as const, status: 'missing' as const },
      { word: "Project Management", frequency: 0, importance: 'medium' as const, status: 'missing' as const },
    ],
    suggestions: [
      "Highlight team collaboration experiences",
      "Add examples of project management",
      "Quantify leadership achievements"
    ]
  },
  {
    title: "Industry Keywords",
    icon: Gauge,
    totalFound: 15,
    totalExpected: 18,
    description: "Domain-specific terms and buzzwords",
    keywords: [
      { word: "Agile", frequency: 4, importance: 'high' as const, status: 'found' as const },
      { word: "Scrum", frequency: 2, importance: 'medium' as const, status: 'found' as const },
      { word: "CI/CD", frequency: 1, importance: 'medium' as const, status: 'found' as const },
      { word: "DevOps", frequency: 0, importance: 'high' as const, status: 'missing' as const },
      { word: "Microservices", frequency: 0, importance: 'medium' as const, status: 'missing' as const },
      { word: "Cloud Computing", frequency: 0, importance: 'low' as const, status: 'suggested' as const },
    ],
    suggestions: [
      "Include DevOps practices you've used",
      "Mention microservices architecture experience",
      "Add cloud platform experience (AWS, Azure, GCP)"
    ]
  }
]

const competitorAnalysis = [
  {
    id: 1,
    name: "Top Performer",
    designation: "Keywords: 45/50",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Above Average",
    designation: "Keywords: 38/50",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Average",
    designation: "Keywords: 32/50",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Your Resume",
    designation: "Keywords: 35/50",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
]

interface KeywordAnalysisProps {
  fileName?: string
  jobTitle?: string
  onOptimize?: () => void
  onExportKeywords?: () => void
  onCompareWithJob?: () => void
  isLoading?: boolean
  className?: string
}

export default function KeywordAnalysis({
  fileName = "john-doe-resume.pdf",
  jobTitle = "Senior Frontend Developer",
  onOptimize,
  onExportKeywords,
  onCompareWithJob,
  isLoading = false,
  className
}: KeywordAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showSparkles, setShowSparkles] = useState(false)

  const totalKeywords = useMemo(() => {
    return keywordData.reduce((acc, category) => ({
      found: acc.found + category.totalFound,
      expected: acc.expected + category.totalExpected
    }), { found: 0, expected: 0 })
  }, [])

  const overallScore = Math.round((totalKeywords.found / totalKeywords.expected) * 100)

  useEffect(() => {
    if (overallScore >= 75) {
      setShowSparkles(true)
      const timer = setTimeout(() => setShowSparkles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [overallScore])

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Keyword Analysis
          </h1>
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={50}
                className="w-full h-full"
                particleColor="#22C55E"
              />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Analysis for <Badge variant="outline" className="mx-1">{fileName}</Badge>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Target Position: <Badge variant="secondary">{jobTitle}</Badge>
        </p>
      </div>

      {/* Overall Score Section */}
      <CardContainer className="w-full">
        <CardBody className="relative w-full">
          <div className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl p-8 overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Overall Score */}
              <CardItem translateZ="100" className="text-center">
                <div className="relative">
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    <AnimatedCounter value={overallScore} />%
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Keyword Match Rate
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <AnimatedCounter value={totalKeywords.found} /> of {totalKeywords.expected} keywords found
                  </p>
                </div>
              </CardItem>

              {/* Quick Stats */}
              <CardItem translateZ="80" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={totalKeywords.found} />
                    </p>
                    <p className="text-sm text-gray-500">Found Keywords</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={totalKeywords.expected - totalKeywords.found} />
                    </p>
                    <p className="text-sm text-gray-500">Missing Keywords</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      +<AnimatedCounter value={12} />%
                    </p>
                    <p className="text-sm text-gray-500">Improvement Potential</p>
                  </div>
                </div>
              </CardItem>
            </div>

            {/* Action Buttons */}
            <CardItem translateZ="60" className="mt-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={onOptimize}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Keywords
                </Button>
                <Button variant="outline" onClick={onExportKeywords}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Keywords
                </Button>
                <Button variant="outline" onClick={onCompareWithJob}>
                  <Search className="mr-2 h-4 w-4" />
                  Compare with Job
                </Button>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Category Breakdown</TabsTrigger>
          <TabsTrigger value="missing">Missing Keywords</TabsTrigger>
          <TabsTrigger value="comparison">Competitor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {keywordData.map((category, index) => (
            <KeywordCategory
              key={category.title}
              {...category}
              delay={index * 200}
            />
          ))}
        </TabsContent>

        <TabsContent value="missing" className="space-y-6 mt-6">
          <CardContainer className="w-full">
            <CardItem translateZ="50" className="w-full">
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div className="ml-2">
                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    High Priority Missing Keywords
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    These keywords are commonly found in job descriptions for your target role
                  </p>
                </div>
              </Alert>
            </CardItem>
          </CardContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordData.flatMap(category => 
              category.keywords.filter(k => k.status === 'missing')
            ).map((keyword, index) => (
              <div key={keyword.word} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{keyword.word}</span>
                  <Badge variant={keyword.importance === 'high' ? 'destructive' : 'secondary'}>
                    {keyword.importance}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Found in 78% of similar job postings
                </p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  <Plus className="mr-1 h-3 w-3" />
                  Add to Resume
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              How You Compare to Other Candidates
            </h3>
            <AnimatedTooltip items={competitorAnalysis} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border">
              <h4 className="font-semibold mb-4">Keyword Density Comparison</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Top 10%</span>
                  <div className="flex-1 mx-3">
                    <Progress value={90} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">45/50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Your Score</span>
                  <div className="flex-1 mx-3">
                    <Progress value={70} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-blue-600">35/50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average</span>
                  <div className="flex-1 mx-3">
                    <Progress value={64} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">32/50</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border">
              <h4 className="font-semibold mb-4">Improvement Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Add 5 more technical keywords</p>
                    <p className="text-xs text-gray-500">Move to top 25%</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Include industry buzzwords</p>
                    <p className="text-xs text-gray-500">Increase relevance score</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Optimize keyword placement</p>
                    <p className="text-xs text-gray-500">Improve ATS parsing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}