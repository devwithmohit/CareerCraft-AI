"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  FileText,
  Send,
  Search,
  Calendar,
  Building,
  User,
  Users,
  BarChart3,
  Target,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  BookOpen,
  Award,
  Settings,
  Download,
  Upload,
  Edit,
  Eye,
  Share,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Zap,
  Sparkles,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Quick action types
interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: 'resume' | 'applications' | 'profile' | 'learning' | 'networking' | 'analytics'
  priority: 'high' | 'medium' | 'low'
  color: string
  bgColor: string
  borderColor: string
  href?: string
  onClick?: () => void
  badge?: string
  estimated_time?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  isNew?: boolean
  isRecommended?: boolean
}

// Sample quick actions data
const quickActionsData: QuickAction[] = [
  // Resume Actions
  {
    id: 'create-resume',
    title: 'Create New Resume',
    description: 'Build an ATS-optimized resume from scratch',
    icon: FileText,
    category: 'resume',
    priority: 'high',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    href: '/resume-builder',
    estimated_time: '15 min',
    difficulty: 'easy',
    isRecommended: true
  },
  {
    id: 'optimize-resume',
    title: 'Optimize Current Resume',
    description: 'Improve your resume\'s ATS score and formatting',
    icon: TrendingUp,
    category: 'resume',
    priority: 'high',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    href: '/resume-analysis',
    badge: 'Score: 85%',
    estimated_time: '10 min',
    difficulty: 'easy'
  },
  {
    id: 'download-resume',
    title: 'Download Resume',
    description: 'Export your resume as PDF or Word document',
    icon: Download,
    category: 'resume',
    priority: 'medium',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    estimated_time: '1 min',
    difficulty: 'easy'
  },

  // Application Actions
  {
    id: 'find-jobs',
    title: 'Find New Jobs',
    description: 'Search for jobs matching your skills and preferences',
    icon: Search,
    category: 'applications',
    priority: 'high',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    href: '/job-search',
    badge: '156 new',
    estimated_time: '20 min',
    difficulty: 'medium',
    isNew: true
  },
  {
    id: 'apply-job',
    title: 'Quick Apply',
    description: 'Apply to recommended jobs with one click',
    icon: Send,
    category: 'applications',
    priority: 'high',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    estimated_time: '5 min',
    difficulty: 'easy',
    isRecommended: true
  },
  {
    id: 'track-applications',
    title: 'Track Applications',
    description: 'Manage and track your job application status',
    icon: Target,
    category: 'applications',
    priority: 'medium',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    href: '/applications',
    badge: '8 pending',
    estimated_time: '10 min',
    difficulty: 'easy'
  },

  // Profile Actions
  {
    id: 'update-profile',
    title: 'Update Profile',
    description: 'Keep your professional profile current and complete',
    icon: User,
    category: 'profile',
    priority: 'medium',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    estimated_time: '15 min',
    difficulty: 'easy'
  },
  {
    id: 'linkedin-sync',
    title: 'Sync with LinkedIn',
    description: 'Import your LinkedIn profile data and connections',
    icon: Globe,
    category: 'profile',
    priority: 'medium',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    estimated_time: '5 min',
    difficulty: 'easy',
    isNew: true
  },

  // Learning Actions
  {
    id: 'skill-assessment',
    title: 'Take Skill Assessment',
    description: 'Evaluate your technical skills and get certified',
    icon: Award,
    category: 'learning',
    priority: 'medium',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    estimated_time: '30 min',
    difficulty: 'medium'
  },
  {
    id: 'interview-prep',
    title: 'Practice Interviews',
    description: 'Prepare for upcoming interviews with AI coaching',
    icon: Calendar,
    category: 'learning',
    priority: 'high',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    href: '/interview-prep',
    estimated_time: '45 min',
    difficulty: 'medium',
    isRecommended: true
  },

  // Networking Actions
  {
    id: 'connect-recruiters',
    title: 'Connect with Recruiters',
    description: 'Find and connect with recruiters in your industry',
    icon: Users,
    category: 'networking',
    priority: 'medium',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    estimated_time: '20 min',
    difficulty: 'medium'
  },

  // Analytics Actions
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Analyze your job search performance and trends',
    icon: BarChart3,
    category: 'analytics',
    priority: 'low',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    href: '/analytics',
    estimated_time: '10 min',
    difficulty: 'easy'
  }
]

// Category configuration
const categoryConfig = {
  resume: {
    name: 'Resume',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  applications: {
    name: 'Applications',
    icon: Send,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  profile: {
    name: 'Profile',
    icon: User,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  learning: {
    name: 'Learning',
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  networking: {
    name: 'Networking',
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  analytics: {
    name: 'Analytics',
    icon: BarChart3,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
}

// Individual Quick Action Card
const QuickActionCard = ({ 
  action, 
  size = 'medium',
  onClick 
}: {
  action: QuickAction
  size?: 'small' | 'medium' | 'large'
  onClick?: (action: QuickAction) => void
}) => {
  const Icon = action.icon
  
  const handleClick = () => {
    if (action.onClick) {
      action.onClick()
    } else if (onClick) {
      onClick(action)
    }
  }
  
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        action.borderColor,
        size === 'small' && "p-3",
        size === 'large' && "p-6"
      )}
      onClick={handleClick}
    >
      <CardContent className={cn(
        "p-4",
        size === 'small' && "p-3",
        size === 'large' && "p-6"
      )}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className={cn("p-2 rounded-lg", action.bgColor)}>
              <Icon className={cn("w-5 h-5", action.color)} />
            </div>
            
            <div className="flex items-center gap-1">
              {action.isNew && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  New
                </Badge>
              )}
              {action.isRecommended && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}
              {action.badge && (
                <Badge variant="outline" className="text-xs">
                  {action.badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className={cn(
              "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors",
              size === 'small' ? "text-sm" : size === 'large' ? "text-lg" : "text-base"
            )}>
              {action.title}
            </h3>
            <p className={cn(
              "text-gray-600 leading-relaxed",
              size === 'small' ? "text-xs" : "text-sm"
            )}>
              {action.description}
            </p>
          </div>

          {/* Footer */}
          {size !== 'small' && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {action.estimated_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {action.estimated_time}
                  </span>
                )}
                {action.difficulty && (
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {action.difficulty}
                  </span>
                )}
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Category Filter
const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange
}: {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('all')}
        className="flex-shrink-0"
      >
        All Actions
      </Button>
      {categories.map((category) => {
        const config = categoryConfig[category as keyof typeof categoryConfig]
        if (!config) return null
        
        const Icon = config.icon
        return (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="flex-shrink-0"
          >
            <Icon className="w-4 h-4 mr-1" />
            {config.name}
          </Button>
        )
      })}
    </div>
  )
}

// Main Quick Actions Component
interface QuickActionsProps {
  actions?: QuickAction[]
  maxItems?: number
  showCategories?: boolean
  showSearch?: boolean
  size?: 'small' | 'medium' | 'large'
  columns?: number
  onActionClick?: (action: QuickAction) => void
  className?: string
}

export default function QuickActions({
  actions = quickActionsData,
  maxItems,
  showCategories = true,
  showSearch = true,
  size = 'medium',
  columns = 2,
  onActionClick,
  className
}: QuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Get unique categories
  const categories = Array.from(new Set(actions.map(action => action.category)))
  
  // Filter actions
  const filteredActions = actions
    .filter(action => {
      const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory
      const matchesSearch = !searchTerm || 
        action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      // Sort by priority and recommendations
      if (a.isRecommended && !b.isRecommended) return -1
      if (!a.isRecommended && b.isRecommended) return 1
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .slice(0, maxItems || actions.length)
  
  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action)
    } else if (action.href) {
      // Handle navigation
      console.log('Navigating to:', action.href)
    } else if (action.onClick) {
      action.onClick()
    }
  }
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {filteredActions.length} available
          </Badge>
        </div>
        
        {/* Search */}
        {showSearch && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        
        {/* Categories */}
        {showCategories && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </CardHeader>
      
      <CardContent>
        {filteredActions.length === 0 ? (
          <div className="text-center py-8">
            <Rocket className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No actions found</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-4",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {filteredActions.map((action) => (
              <QuickActionCard
                key={action.id}
                action={action}
                size={size}
                onClick={handleActionClick}
              />
            ))}
          </div>
        )}
        
        {/* Show more button */}
        {maxItems && actions.length > maxItems && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              View All Actions
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export types for use in other components
export type { QuickAction }