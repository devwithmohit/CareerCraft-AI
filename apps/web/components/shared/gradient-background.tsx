"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientBackgroundProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'hero' | 'feature' | 'testimonial' | 'cta'
  intensity?: 'light' | 'medium' | 'strong'
  animated?: boolean
  className?: string
}

export function GradientBackground({
  children,
  variant = 'primary',
  intensity = 'medium',
  animated = false,
  className = ''
}: GradientBackgroundProps) {
  
  const getGradientClass = () => {
    const baseGradients = {
      primary: {
        light: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        medium: 'bg-gradient-to-br from-blue-100 via-white to-purple-100',
        strong: 'bg-gradient-to-br from-blue-200 via-indigo-50 to-purple-200'
      },
      secondary: {
        light: 'bg-gradient-to-br from-gray-50 to-white',
        medium: 'bg-gradient-to-br from-gray-100 to-gray-50',
        strong: 'bg-gradient-to-br from-gray-200 to-gray-100'
      },
      hero: {
        light: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        medium: 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100',
        strong: 'bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200'
      },
      feature: {
        light: 'bg-gradient-to-b from-white to-gray-50',
        medium: 'bg-gradient-to-b from-gray-50 to-white',
        strong: 'bg-gradient-to-b from-gray-100 to-gray-50'
      },
      testimonial: {
        light: 'bg-gradient-to-b from-blue-50 to-white',
        medium: 'bg-gradient-to-b from-blue-100 to-blue-50',
        strong: 'bg-gradient-to-b from-blue-200 to-blue-100'
      },
      cta: {
        light: 'bg-gradient-to-r from-blue-600 to-purple-600',
        medium: 'bg-gradient-to-r from-blue-700 to-purple-700',
        strong: 'bg-gradient-to-r from-blue-800 to-purple-800'
      }
    }
    
    return baseGradients[variant][intensity]
  }

  const getFloatingElements = () => {
    if (!animated) return null

    return (
      <>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-10 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-blue-500/20 rounded-full animate-bounce delay-3000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-500/30 rounded-full animate-bounce delay-4000"></div>
      </>
    )
  }

  return (
    <div className={cn(
      "relative overflow-hidden",
      getGradientClass(),
      className
    )}>
      {getFloatingElements()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Preset components for common use cases
export function HeroGradient({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <GradientBackground
      variant="hero"
      intensity="medium"
      animated={true}
      className={className}
    >
      {children}
    </GradientBackground>
  )
}

export function FeatureGradient({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <GradientBackground
      variant="feature"
      intensity="light"
      className={className}
    >
      {children}
    </GradientBackground>
  )
}

export function TestimonialGradient({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <GradientBackground
      variant="testimonial"
      intensity="light"
      className={className}
    >
      {children}
    </GradientBackground>
  )
}

export function CTAGradient({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <GradientBackground
      variant="cta"
      intensity="medium"
      className={cn("text-white", className)}
    >
      {children}
    </GradientBackground>
  )
}