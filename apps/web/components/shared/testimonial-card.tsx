"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, Building, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  role: string
  company?: string
  quote: string
  rating: number
  image?: string
  badge?: string
  metrics?: Record<string, string>
  variant?: 'default' | 'featured' | 'compact' | 'minimal'
  className?: string
}

export function TestimonialCard({
  name,
  role,
  company,
  quote,
  rating,
  image,
  badge,
  metrics,
  variant = 'default',
  className = ""
}: TestimonialCardProps) {
  
  const renderStars = () => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )} 
        />
      ))}
    </div>
  )

  const renderAvatar = () => {
    const initials = name.split(' ').map(n => n.charAt(0)).join('')
    
    return image ? (
      <img 
        src={image} 
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
        {initials}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("text-center", className)}>
        <div className="mb-4">{renderStars()}</div>
        <p className="text-gray-700 italic mb-4">"{quote}"</p>
        <div className="flex items-center justify-center space-x-3">
          {renderAvatar()}
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-sm text-gray-600">{role}</div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {renderStars()}
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-700 mb-4 italic">"{quote}"</p>
          <div className="flex items-center space-x-3">
            {renderAvatar()}
            <div>
              <div className="font-medium text-gray-900">{name}</div>
              <div className="text-sm text-gray-600">{role}</div>
              {company && (
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-3 w-3 mr-1" />
                  {company}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className={cn("border-0 shadow-2xl bg-white overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center mb-6">
                {badge && (
                  <Badge className="mr-3 bg-blue-100 text-blue-700">
                    {badge}
                  </Badge>
                )}
                {renderStars()}
              </div>

              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed italic">
                "{quote}"
              </p>

              {/* Metrics */}
              {metrics && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="text-sm text-gray-600 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                {renderAvatar()}
                <div>
                  <div className="font-semibold text-gray-900">{name}</div>
                  <div className="text-sm text-gray-600">{role}</div>
                  {company && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Building className="h-3 w-3 mr-1" />
                      {company}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Side */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 lg:p-12 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-6 mx-auto">
                  {name.split(' ').map(n => n.charAt(0)).join('')}
                </div>
                <div className="text-xl font-semibold mb-2">{name}</div>
                <div className="text-blue-100 mb-4">{role}</div>
                {company && (
                  <div className="text-3xl font-bold">{company}</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn("border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 group", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          {renderStars()}
          {badge && (
            <Badge variant="outline" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        
        <Quote className="h-6 w-6 text-blue-600 mb-2" />
        
        <p className="text-gray-700 leading-relaxed italic">
          "{quote}"
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Metrics if provided */}
        {metrics && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-blue-600">{value}</div>
                <div className="text-xs text-gray-600 capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3">
          {renderAvatar()}
          <div className="flex-1">
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </div>
            <div className="text-sm text-gray-600">{role}</div>
            {company && (
              <div className="flex items-center text-sm text-gray-500">
                <Building className="h-3 w-3 mr-1" />
                {company}
              </div>
            )}
          </div>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      </CardContent>
    </Card>
  )
}

// Preset components for common use cases
export function QuickTestimonial({
  name,
  role,
  quote,
  rating = 5,
  className
}: {
  name: string
  role: string
  quote: string
  rating?: number
  className?: string
}) {
  return (
    <TestimonialCard
      name={name}
      role={role}
      quote={quote}
      rating={rating}
      variant="compact"
      className={className}
    />
  )
}

export function FeaturedTestimonial({
  name,
  role,
  company,
  quote,
  rating = 5,
  metrics,
  badge,
  className
}: {
  name: string
  role: string
  company: string
  quote: string
  rating?: number
  metrics?: Record<string, string>
  badge?: string
  className?: string
}) {
  return (
    <TestimonialCard
      name={name}
      role={role}
      company={company}
      quote={quote}
      rating={rating}
      metrics={metrics}
      badge={badge}
      variant="featured"
      className={className}
    />
  )
}

export function SimpleTestimonial({
  name,
  role,
  quote,
  rating = 5,
  className
}: {
  name: string
  role: string
  quote: string
  rating?: number
  className?: string
}) {
  return (
    <TestimonialCard
      name={name}
      role={role}
      quote={quote}
      rating={rating}
      variant="minimal"
      className={className}
    />
  )
}