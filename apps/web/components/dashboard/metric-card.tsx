"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye,
  Send,
  Calendar,
  FileText,
  Users,
  Target,
  Award,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  MoreHorizontal,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Metric types
type MetricType = 
  | 'applications' 
  | 'interviews' 
  | 'responses' 
  | 'offers' 
  | 'profile_views'
  | 'resume_downloads'
  | 'skill_score'
  | 'ats_score'
  | 'response_rate'
  | 'interview_rate'

// Trend direction
type TrendDirection = 'up' | 'down' | 'neutral'

// Time period
type TimePeriod = '7d' | '30d' | '90d' | '1y'

// Metric data interface
interface MetricData {
  id: string
  type: MetricType
  title: string
  value: number | string
  previousValue?: number
  change?: number
  changePercent?: number
  trend: TrendDirection
  period: TimePeriod
  target?: number
  format: 'number' | 'percentage' | 'currency' | 'duration'
  description?: string
  lastUpdated?: Date
  status?: 'good' | 'warning' | 'danger' | 'neutral'
  actionable?: boolean
}

// Sample metric data
const sampleMetrics: MetricData[] = [
  {
    id: '1',
    type: 'applications',
    title: 'Applications Sent',
    value: 24,
    previousValue: 18,
    change: 6,
    changePercent: 33.3,
    trend: 'up',
    period: '30d',
    target: 30,
    format: 'number',
    description: 'Job applications submitted this month',
    lastUpdated: new Date(),
    status: 'good',
    actionable: true
  },
  {
    id: '2',
    type: 'interviews',
    title: 'Interviews Scheduled',
    value: 8,
    previousValue: 5,
    change: 3,
    changePercent: 60,
    trend: 'up',
    period: '30d',
    format: 'number',
    description: 'Interview invitations received',
    lastUpdated: new Date(),
    status: 'good'
  },
  {
    id: '3',
    type: 'response_rate',
    title: 'Response Rate',
    value: '33%',
    previousValue: 28,
    change: 5,
    changePercent: 17.9,
    trend: 'up',
    period: '30d',
    format: 'percentage',
    description: 'Percentage of applications that received responses',
    lastUpdated: new Date(),
    status: 'good'
  },
  {
    id: '4',
    type: 'ats_score',
    title: 'ATS Score',
    value: '85%',
    previousValue: 78,
    change: 7,
    changePercent: 9,
    trend: 'up',
    period: '7d',
    target: 90,
    format: 'percentage',
    description: 'Resume optimization score',
    lastUpdated: new Date(),
    status: 'good'
  },
  {
    id: '5',
    type: 'profile_views',
    title: 'Profile Views',
    value: 156,
    previousValue: 142,
    change: 14,
    changePercent: 9.9,
    trend: 'up',
    period: '7d',
    format: 'number',
    description: 'LinkedIn profile views this week',
    lastUpdated: new Date(),
    status: 'good'
  },
  {
    id: '6',
    type: 'offers',
    title: 'Job Offers',
    value: 2,
    previousValue: 1,
    change: 1,
    changePercent: 100,
    trend: 'up',
    period: '90d',
    format: 'number',
    description: 'Job offers received',
    lastUpdated: new Date(),
    status: 'good'
  }
]

// Get metric icon
const getMetricIcon = (type: MetricType) => {
  const iconMap = {
    applications: Send,
    interviews: Calendar,
    responses: Eye,
    offers: Award,
    profile_views: Users,
    resume_downloads: FileText,
    skill_score: Target,
    ats_score: CheckCircle,
    response_rate: TrendingUp,
    interview_rate: Briefcase
  }
  
  return iconMap[type] || Target
}

// Get status color
const getStatusColor = (status: string = 'neutral') => {
  const colorMap = {
    good: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    danger: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }
  
  return colorMap[status as keyof typeof colorMap] || colorMap.neutral
}

// Get trend icon and color
const getTrendIcon = (trend: TrendDirection) => {
  switch (trend) {
    case 'up':
      return { icon: TrendingUp, color: 'text-green-600' }
    case 'down':
      return { icon: TrendingDown, color: 'text-red-600' }
    default:
      return { icon: Minus, color: 'text-gray-600' }
  }
}

// Format value based on type
const formatValue = (value: number | string, format: string) => {
  if (typeof value === 'string') return value
  
  switch (format) {
    case 'percentage':
      return `${value}%`
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    case 'duration':
      return `${value}d`
    default:
      return value.toLocaleString()
  }
}

// Format change
const formatChange = (change: number, changePercent: number, format: string) => {
  const sign = change > 0 ? '+' : ''
  const formattedChange = format === 'percentage' ? `${sign}${change}%` : `${sign}${change}`
  const formattedPercent = `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`
  
  return `${formattedChange} (${formattedPercent})`
}

// Get period label
const getPeriodLabel = (period: TimePeriod) => {
  const periodMap = {
    '7d': 'vs last week',
    '30d': 'vs last month',
    '90d': 'vs last quarter',
    '1y': 'vs last year'
  }
  
  return periodMap[period]
}

// Individual metric card component
interface MetricCardProps {
  metric: MetricData
  size?: 'small' | 'medium' | 'large'
  showTrend?: boolean
  showTarget?: boolean
  showActions?: boolean
  onClick?: (metric: MetricData) => void
  onAction?: (action: string, metric: MetricData) => void
  className?: string
}

export default function MetricCard({
  metric,
  size = 'medium',
  showTrend = true,
  showTarget = true,
  showActions = false,
  onClick,
  onAction,
  className
}: MetricCardProps) {
  const Icon = getMetricIcon(metric.type)
  const statusColor = getStatusColor(metric.status)
  const { icon: TrendIcon, color: trendColor } = getTrendIcon(metric.trend)
  
  const isClickable = !!onClick
  
  // Calculate target progress
  const getTargetProgress = () => {
    if (!metric.target || typeof metric.value === 'string') return null
    return Math.min(100, (metric.value / metric.target) * 100)
  }
  
  const targetProgress = getTargetProgress()
  
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        isClickable && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
        size === 'small' && "p-3",
        size === 'large' && "p-6",
        className
      )}
      onClick={() => onClick?.(metric)}
    >
      <CardContent className={cn(
        "p-4",
        size === 'small' && "p-3",
        size === 'large' && "p-6"
      )}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", statusColor)}>
                <Icon className={cn(
                  "w-4 h-4",
                  size === 'large' && "w-5 h-5"
                )} />
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium text-gray-900",
                  size === 'small' ? "text-sm" : size === 'large' ? "text-base" : "text-sm"
                )}>
                  {metric.title}
                </h3>
                {metric.description && size !== 'small' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                )}
              </div>
            </div>
            
            {showActions && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Value and Trend */}
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(metric.value, metric.format)}
              </div>
              
              {showTrend && metric.change !== undefined && metric.changePercent !== undefined && (
                <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="font-medium">
                    {formatChange(metric.change, metric.changePercent, metric.format)}
                  </span>
                </div>
              )}
            </div>
            
            {showTrend && metric.period && (
              <p className="text-xs text-gray-500">
                {getPeriodLabel(metric.period)}
              </p>
            )}
          </div>

          {/* Target Progress */}
          {showTarget && targetProgress !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Target: {formatValue(metric.target!, metric.format)}</span>
                <span className="font-medium text-gray-700">{targetProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    targetProgress >= 100 ? "bg-green-500" :
                    targetProgress >= 75 ? "bg-blue-500" :
                    targetProgress >= 50 ? "bg-yellow-500" : "bg-gray-400"
                  )}
                  style={{ width: `${Math.min(100, targetProgress)}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {metric.actionable && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction?.('view_details', metric)
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
              
              {metric.type === 'applications' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction?.('new_application', metric)
                  }}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Apply Now
                </Button>
              )}
              
              {metric.type === 'ats_score' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction?.('optimize_resume', metric)
                  }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Optimize
                </Button>
              )}
            </div>
          )}

          {/* Last Updated */}
          {metric.lastUpdated && size === 'large' && (
            <div className="text-xs text-gray-400 pt-2 border-t">
              Updated {metric.lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Metrics grid component for dashboard
export function MetricsGrid({
  metrics = sampleMetrics,
  columns = 3,
  size = 'medium',
  showTrend = true,
  showTarget = true,
  showActions = false,
  onMetricClick,
  onMetricAction,
  className
}: {
  metrics?: MetricData[]
  columns?: number
  size?: 'small' | 'medium' | 'large'
  showTrend?: boolean
  showTarget?: boolean
  showActions?: boolean
  onMetricClick?: (metric: MetricData) => void
  onMetricAction?: (action: string, metric: MetricData) => void
  className?: string
}) {
  return (
    <div className={cn(
      "grid gap-4",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          size={size}
          showTrend={showTrend}
          showTarget={showTarget}
          showActions={showActions}
          onClick={onMetricClick}
          onAction={onMetricAction}
        />
      ))}
    </div>
  )
}

// Export types for use in other components
export type { MetricData, MetricType, TrendDirection, TimePeriod }