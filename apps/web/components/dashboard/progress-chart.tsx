"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Clock,
  Award,
  Users,
  Send,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Chart data interfaces
interface ChartDataPoint {
  label: string
  value: number
  target?: number
  color?: string
  trend?: 'up' | 'down' | 'neutral'
  metadata?: Record<string, any>
}

interface ProgressChartData {
  id: string
  title: string
  description?: string
  type: 'bar' | 'line' | 'progress' | 'circular'
  data: ChartDataPoint[]
  period: '7d' | '30d' | '90d' | '1y'
  target?: number
  unit?: string
  format?: 'number' | 'percentage' | 'currency'
  showTrend?: boolean
  showTarget?: boolean
}

// Sample chart data
const sampleChartData: ProgressChartData[] = [
  {
    id: 'applications-weekly',
    title: 'Applications This Week',
    description: 'Daily application submissions',
    type: 'bar',
    period: '7d',
    target: 5,
    unit: 'applications',
    format: 'number',
    showTrend: true,
    showTarget: true,
    data: [
      { label: 'Mon', value: 3, color: 'bg-blue-500' },
      { label: 'Tue', value: 5, color: 'bg-blue-500' },
      { label: 'Wed', value: 2, color: 'bg-blue-500' },
      { label: 'Thu', value: 4, color: 'bg-blue-500' },
      { label: 'Fri', value: 6, color: 'bg-blue-500' },
      { label: 'Sat', value: 1, color: 'bg-blue-500' },
      { label: 'Sun', value: 2, color: 'bg-blue-500' }
    ]
  },
  {
    id: 'response-rate',
    title: 'Response Rate Trend',
    description: 'Monthly response rate percentage',
    type: 'line',
    period: '90d',
    target: 35,
    unit: '%',
    format: 'percentage',
    showTrend: true,
    showTarget: true,
    data: [
      { label: 'Jan', value: 25, trend: 'neutral' },
      { label: 'Feb', value: 28, trend: 'up' },
      { label: 'Mar', value: 32, trend: 'up' },
      { label: 'Apr', value: 30, trend: 'down' },
      { label: 'May', value: 35, trend: 'up' },
      { label: 'Jun', value: 38, trend: 'up' }
    ]
  },
  {
    id: 'skill-progress',
    title: 'Skill Development',
    description: 'Progress on key skills',
    type: 'progress',
    period: '30d',
    unit: '%',
    format: 'percentage',
    showTrend: false,
    showTarget: true,
    data: [
      { label: 'React', value: 85, target: 90, color: 'bg-blue-500' },
      { label: 'TypeScript', value: 75, target: 85, color: 'bg-green-500' },
      { label: 'Node.js', value: 70, target: 80, color: 'bg-purple-500' },
      { label: 'AWS', value: 60, target: 75, color: 'bg-orange-500' },
      { label: 'Python', value: 80, target: 85, color: 'bg-red-500' }
    ]
  },
  {
    id: 'interview-success',
    title: 'Interview Success Rate',
    description: 'Conversion from interview to offer',
    type: 'circular',
    period: '90d',
    target: 60,
    unit: '%',
    format: 'percentage',
    showTrend: true,
    data: [
      { label: 'Success Rate', value: 45, target: 60, color: 'bg-green-500' }
    ]
  }
]

// Bar Chart Component
const BarChart = ({ data, target, showTarget }: {
  data: ChartDataPoint[]
  target?: number
  showTarget?: boolean
}) => {
  const maxValue = Math.max(...data.map(d => d.value), target || 0)
  
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((point, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-1">
            <div className="relative w-full h-24 bg-gray-100 rounded-t flex items-end">
              {/* Target line */}
              {showTarget && target && (
                <div 
                  className="absolute w-full border-t-2 border-dashed border-red-400"
                  style={{ bottom: `${(target / maxValue) * 100}%` }}
                />
              )}
              {/* Data bar */}
              <div
                className={cn("w-full rounded-t transition-all duration-300", point.color || 'bg-blue-500')}
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              />
              {/* Value label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {point.value}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600 text-center">
              {point.label}
            </span>
          </div>
        ))}
      </div>
      
      {showTarget && target && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <div className="w-4 h-0 border-t-2 border-dashed border-red-400" />
          <span className="text-gray-600">Target: {target}</span>
        </div>
      )}
    </div>
  )
}

// Line Chart Component
const LineChart = ({ data, target, showTarget }: {
  data: ChartDataPoint[]
  target?: number
  showTarget?: boolean
}) => {
  const maxValue = Math.max(...data.map(d => d.value), target || 0)
  const minValue = Math.min(...data.map(d => d.value), 0)
  const range = maxValue - minValue
  
  return (
    <div className="space-y-3">
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          {/* Target line */}
          {showTarget && target && (
            <line
              x1="0"
              y1={100 - ((target - minValue) / range) * 100}
              x2="300"
              y2={100 - ((target - minValue) / range) * 100}
              stroke="#f87171"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          )}
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 300
              const y = 100 - ((point.value - minValue) / range) * 100
              return `${x},${y}`
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 300
            const y = 100 - ((point.value - minValue) / range) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                className="hover:r-4 transition-all"
              />
            )
          })}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2">
          {data.map((point, index) => (
            <span key={index} className="text-xs text-gray-600">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Progress Bars Component
const ProgressBars = ({ data }: { data: ChartDataPoint[] }) => {
  return (
    <div className="space-y-4">
      {data.map((point, index) => {
        const progress = point.target ? (point.value / point.target) * 100 : point.value
        const isComplete = progress >= 100
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">{point.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{point.value}%</span>
                {point.target && (
                  <span className="text-xs text-gray-400">/ {point.target}%</span>
                )}
                {isComplete && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    point.color || 'bg-blue-500',
                    isComplete && "bg-green-500"
                  )}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              {point.target && progress < 100 && (
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-gray-400"
                  style={{ left: '100%' }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Circular Progress Component
const CircularProgress = ({ data }: { data: ChartDataPoint[] }) => {
  const point = data[0] // Single value for circular
  const progress = point.target ? (point.value / point.target) * 100 : point.value
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{point.value}%</div>
            {point.target && (
              <div className="text-xs text-gray-500">of {point.target}%</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Chart renderer
const ChartRenderer = ({ chartData }: { chartData: ProgressChartData }) => {
  switch (chartData.type) {
    case 'bar':
      return (
        <BarChart
          data={chartData.data}
          target={chartData.target}
          showTarget={chartData.showTarget}
        />
      )
    case 'line':
      return (
        <LineChart
          data={chartData.data}
          target={chartData.target}
          showTarget={chartData.showTarget}
        />
      )
    case 'progress':
      return <ProgressBars data={chartData.data} />
    case 'circular':
      return <CircularProgress data={chartData.data} />
    default:
      return <div>Unsupported chart type</div>
  }
}

// Individual Progress Chart Component
interface ProgressChartProps {
  chartData: ProgressChartData
  className?: string
  size?: 'small' | 'medium' | 'large'
  showControls?: boolean
  onPeriodChange?: (period: string) => void
  onExport?: () => void
}

export default function ProgressChart({
  chartData,
  className,
  size = 'medium',
  showControls = true,
  onPeriodChange,
  onExport
}: ProgressChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(chartData.period)
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as any)
    onPeriodChange?.(period)
  }
  
  const getPeriodLabel = (period: string) => {
    const labels = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 3 months',
      '1y': 'Last year'
    }
    return labels[period as keyof typeof labels] || period
  }
  
  const getTotalValue = () => {
    if (chartData.type === 'circular' || chartData.type === 'progress') {
      return chartData.data[0]?.value || 0
    }
    return chartData.data.reduce((sum, point) => sum + point.value, 0)
  }
  
  const getAverageValue = () => {
    const total = getTotalValue()
    return chartData.type === 'circular' || chartData.type === 'progress' 
      ? total 
      : Math.round(total / chartData.data.length)
  }
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-4", size === 'small' && "pb-2")}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className={cn(
              "text-lg font-semibold",
              size === 'small' ? "text-base" : size === 'large' ? "text-xl" : "text-lg"
            )}>
              {chartData.title}
            </CardTitle>
            {chartData.description && size !== 'small' && (
              <p className="text-sm text-gray-600 mt-1">
                {chartData.description}
              </p>
            )}
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              {/* Period selector */}
              <div className="flex items-center gap-1">
                {['7d', '30d', '90d', '1y'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handlePeriodChange(period)}
                    className="h-7 px-2 text-xs"
                  >
                    {period}
                  </Button>
                ))}
              </div>
              
              {onExport && (
                <Button variant="ghost" size="sm" onClick={onExport}>
                  <Download className="w-4 h-4" />
                </Button>
              )}
              
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Summary stats */}
        {size !== 'small' && (
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Avg: {getAverageValue()}{chartData.unit}
              </span>
            </div>
            
            {chartData.target && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Target: {chartData.target}{chartData.unit}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {getPeriodLabel(selectedPeriod)}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className={cn(
        "pt-0",
        size === 'small' && "px-3"
      )}>
        <ChartRenderer chartData={chartData} />
        
        {/* Insights */}
        {size === 'large' && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Insights</h4>
            <div className="space-y-2">
              {chartData.type === 'bar' && (
                <div className="flex items-start gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Your best day was {chartData.data.reduce((max, point) => 
                      point.value > max.value ? point : max
                    ).label} with {Math.max(...chartData.data.map(d => d.value))} applications
                  </span>
                </div>
              )}
              
              {chartData.target && getAverageValue() >= chartData.target && (
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    You're meeting your target goal! Keep up the great work.
                  </span>
                </div>
              )}
              
              {chartData.target && getAverageValue() < chartData.target && (
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    You're {chartData.target - getAverageValue()}{chartData.unit} below your target. 
                    Consider increasing your daily efforts.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Progress Charts Grid Component
export function ProgressChartsGrid({
  charts = sampleChartData,
  columns = 2,
  size = 'medium',
  showControls = true,
  onChartAction,
  className
}: {
  charts?: ProgressChartData[]
  columns?: number
  size?: 'small' | 'medium' | 'large'
  showControls?: boolean
  onChartAction?: (action: string, chartId: string) => void
  className?: string
}) {
  return (
    <div className={cn(
      "grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 lg:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
      className
    )}>
      {charts.map((chart) => (
        <ProgressChart
          key={chart.id}
          chartData={chart}
          size={size}
          showControls={showControls}
          onPeriodChange={(period) => onChartAction?.('period_change', chart.id)}
          onExport={() => onChartAction?.('export', chart.id)}
        />
      ))}
    </div>
  )
}

// Export types for use in other components
export type { ProgressChartData, ChartDataPoint }