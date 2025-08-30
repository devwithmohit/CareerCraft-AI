"use client"

import React, { useState, useEffect } from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { SparklesCore } from '@/components/ui/sparkles'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Trophy, 
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
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Animated Score Ring Component
const AnimatedScoreRing = ({ score, size = 120, strokeWidth = 8, className }: {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500'
    if (score >= 60) return 'stroke-yellow-500'
    if (score >= 40) return 'stroke-orange-500'
    return 'stroke-red-500'
  }

  const getScoreGlow = (score: number) => {
    if (score >= 80) return 'drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]'
    if (score >= 60) return 'drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]'
    if (score >= 40) return 'drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]'
    return 'drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]'
  }

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-2000 ease-out",
            getScoreColor(score),
            getScoreGlow(score)
          )}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {animatedScore}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ATS Score
          </div>
        </div>
      </div>
    </div>
  )
}

// Score Category Component
const ScoreCategory = ({ 
  icon: Icon, 
  title, 
  score, 
  maxScore = 100, 
  description,
  suggestions = [],
  delay = 0 
}: {
  icon: React.ElementType
  title: string
  score: number
  maxScore?: number
  description: string
  suggestions?: string[]
  delay?: number
}) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const percentage = (score / maxScore) * 100

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, delay)
    return () => clearTimeout(timer)
  }, [score, delay])

  const getScoreStatus = () => {
    if (percentage >= 80) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle }
    if (percentage >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: AlertTriangle }
    return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', icon: XCircle }
  }

  const status = getScoreStatus()
  const StatusIcon = status.icon

  return (
    <CardContainer className="w-full">
      <CardBody className="w-full">
        <CardItem translateZ="50" className="w-full">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-lg", status.bg)}>
                  <Icon className={cn("h-5 w-5", status.color)} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon className={cn("h-5 w-5", status.color)} />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {animatedScore}
                </span>
                <span className="text-sm text-gray-500">/{maxScore}</span>
              </div>
            </div>
            
            <CardItem translateZ="30">
              <Progress 
                value={percentage} 
                className="h-2 mb-4"
              />
            </CardItem>

            {suggestions.length > 0 && (
              <CardItem translateZ="20">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggestions:</h4>
                  <ul className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-1">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardItem>
            )}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

// Score Breakdown Data
const scoreBreakdown = [
  {
    icon: Target,
    title: "Keywords Match",
    score: 85,
    maxScore: 100,
    description: "How well your resume matches job requirements",
    suggestions: [
      "Add more industry-specific keywords",
      "Include technical skills mentioned in job description",
      "Use action verbs from the job posting"
    ]
  },
  {
    icon: Eye,
    title: "Formatting",
    score: 92,
    maxScore: 100,
    description: "Resume structure and readability",
    suggestions: [
      "Excellent formatting detected",
      "Consistent spacing and fonts used",
      "Clear section headers present"
    ]
  },
  {
    icon: Brain,
    title: "Content Quality",
    score: 78,
    maxScore: 100,
    description: "Quality and relevance of content",
    suggestions: [
      "Add quantifiable achievements",
      "Include more specific accomplishments",
      "Expand on technical skills"
    ]
  },
  {
    icon: Zap,
    title: "ATS Compatibility",
    score: 88,
    maxScore: 100,
    description: "How well ATS systems can parse your resume",
    suggestions: [
      "Great ATS compatibility",
      "Standard section headers used",
      "No complex formatting detected"
    ]
  }
]

// Industry Benchmarks
const industryBenchmarks = [
  {
    id: 1,
    name: "Technology",
    designation: "Industry Average: 75",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Finance", 
    designation: "Industry Average: 82",
    image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Healthcare",
    designation: "Industry Average: 79",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Marketing",
    designation: "Industry Average: 71",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
  }
]

interface ScoreDisplayProps {
  overallScore?: number
  fileName?: string
  analysisDate?: string
  onReanalyze?: () => void
  onDownloadReport?: () => void
  onShareReport?: () => void
  isLoading?: boolean
  className?: string
}

export default function ScoreDisplay({
  overallScore = 84,
  fileName = "john-doe-resume.pdf",
  analysisDate = "",
  onReanalyze,
  onDownloadReport,
  onShareReport,
  isLoading = false,
  className
}: ScoreDisplayProps) {
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    // Show sparkles for high scores
    if (overallScore >= 80) {
      setShowSparkles(true)
      const timer = setTimeout(() => setShowSparkles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [overallScore])

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Excellent!' }
    if (score >= 80) return { grade: 'A', color: 'text-green-600', message: 'Great job!' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', message: 'Good work!' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', message: 'Needs improvement' }
    return { grade: 'D', color: 'text-red-600', message: 'Requires attention' }
  }

  const scoreGrade = getScoreGrade(overallScore)

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Resume Analysis Results
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Analysis for <Badge variant="outline" className="mx-1">{fileName}</Badge>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Analyzed on {analysisDate}
        </p>
      </div>

      {/* Overall Score Section */}
      <CardContainer className="w-full">
        <CardBody className="relative w-full">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 overflow-hidden">
            {/* Sparkles Effect */}
            {showSparkles && (
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={50}
                  className="w-full h-full"
                  particleColor="#3B82F6"
                />
              </div>
            )}

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Score Ring */}
              <CardItem translateZ="100" className="flex justify-center">
                <div className="relative">
                  <AnimatedScoreRing score={overallScore} size={200} strokeWidth={12} />
                  {overallScore >= 80 && (
                    <div className="absolute -top-4 -right-4">
                      <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
                    </div>
                  )}
                </div>
              </CardItem>

              {/* Score Details */}
              <CardItem translateZ="80" className="space-y-6">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                    <span className={cn("text-6xl font-bold", scoreGrade.color)}>
                      {scoreGrade.grade}
                    </span>
                    <div>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {scoreGrade.message}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your resume scores higher than 78% of candidates
                      </p>
                    </div>
                  </div>

                  {/* Industry Comparison */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Industry Benchmarks
                    </h3>
                    <AnimatedTooltip items={industryBenchmarks} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <Button 
                      onClick={onDownloadReport}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    <Button variant="outline" onClick={onShareReport}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Results
                    </Button>
                    <Button variant="outline" onClick={onReanalyze}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reanalyze
                    </Button>
                  </div>
                </div>
              </CardItem>
            </div>
          </div>
        </CardBody>
      </CardContainer>

      <Separator className="my-8" />

      {/* Score Breakdown */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Detailed Score Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scoreBreakdown.map((category, index) => (
            <ScoreCategory
              key={index}
              {...category}
              delay={index * 200}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <CardContainer className="w-full">
        <CardItem translateZ="50" className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              Quick Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-sm text-gray-500">Keywords Found</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
                <p className="text-sm text-gray-500">Skills Match</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gauge className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3s</p>
                <p className="text-sm text-gray-500">Read Time</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7.8</p>
                <p className="text-sm text-gray-500">Impact Score</p>
              </div>
            </div>
          </div>
        </CardItem>
      </CardContainer>
    </div>
  )
}