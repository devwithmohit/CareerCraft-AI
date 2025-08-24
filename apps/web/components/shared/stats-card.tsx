"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  description?: string
  gradient?: string
  animated?: boolean
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  description,
  gradient = "from-blue-500 to-purple-500",
  animated = false,
  trend,
  trendValue,
  className = ""
}: StatsCardProps) {
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden",
      animated && "hover:scale-105",
      className
    )}>
      <CardContent className="p-8 text-center">
        <div className={cn(
          "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-transform duration-300",
          `bg-gradient-to-r ${gradient}`,
          "group-hover:scale-110"
        )}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <div className={cn(
          "text-4xl md:text-5xl font-bold text-gray-900 mb-2 transition-colors",
          "group-hover:text-blue-600"
        )}>
          {value}
        </div>
        
        <div className="text-lg font-semibold text-gray-800 mb-2">
          {label}
        </div>
        
        {description && (
          <div className="text-sm text-gray-600 mb-4">
            {description}
          </div>
        )}

        {trend && trendValue && (
          <Badge className={cn(
            "text-xs font-medium",
            getTrendColor()
          )}>
            {getTrendIcon()} {trendValue}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

// Preset variants for common use cases
export function MetricCard({
  icon,
  value,
  label,
  change,
  changeType = 'neutral',
  className
}: {
  icon: LucideIcon
  value: string | number
  label: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  className?: string
}) {
  return (
    <StatsCard
      icon={icon}
      value={value}
      label={label}
      trend={changeType === 'positive' ? 'up' : changeType === 'negative' ? 'down' : 'neutral'}
      trendValue={change}
      gradient="from-blue-500 to-cyan-500"
      animated
      className={className}
    />
  )
}

export function KPICard({
  icon,
  value,
  label,
  target,
  className
}: {
  icon: LucideIcon
  value: string | number
  label: string
  target?: string
  className?: string
}) {
  return (
    <Card className={cn("border-0 shadow-lg bg-white", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          {target && (
            <Badge variant="outline" className="text-xs">
              Target: {target}
            </Badge>
          )}
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        
        <div className="text-sm font-medium text-gray-600">
          {label}
        </div>
      </CardContent>
    </Card>
  )
}

export function SimpleStatsCard({
  icon,
  value,
  label,
  className
}: {
  icon: LucideIcon
  value: string | number
  label: string
  className?: string
}) {
  return (
    <div className={cn("text-center", className)}>
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4 group-hover:bg-blue-100 transition-colors">
        <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
    </div>
  )
}

export function AnimatedStatsCard({
  icon,
  value,
  label,
  description,
  delay = 0,
  className
}: {
  icon: LucideIcon
  value: string | number
  label: string
  description?: string
  delay?: number
  className?: string
}) {
  return (
    <div 
      className={cn(
        "transition-all duration-700 opacity-0 translate-y-10",
        "animate-[fadeInUp_0.7s_ease-out_forwards]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <StatsCard
        icon={icon}
        value={value}
        label={label}
        description={description}
        animated
        gradient="from-purple-500 to-pink-500"
      />
    </div>
  )
}