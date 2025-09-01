"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Activity,
  FileText,
  Send,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Building,
  User,
  Mail,
  Phone,
  TrendingUp,
  Download,
  Edit,
  Plus,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Activity types
type ActivityType = 
  | 'resume_created' 
  | 'resume_updated' 
  | 'application_submitted' 
  | 'application_viewed' 
  | 'interview_scheduled' 
  | 'interview_completed' 
  | 'job_saved' 
  | 'profile_updated'
  | 'cover_letter_created'
  | 'skill_assessment_completed'
  | 'certification_added'

// Activity item interface
interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  metadata?: {
    company?: string
    position?: string
    status?: 'pending' | 'completed' | 'rejected' | 'in_progress'
    score?: number
    file_name?: string
    interview_date?: Date
    location?: string
  }
  priority?: 'low' | 'medium' | 'high'
  read?: boolean
}

// Sample activity data
const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'application_submitted',
    title: 'Application Submitted',
    description: 'Applied for Senior Software Engineer at Google',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    metadata: {
      company: 'Google',
      position: 'Senior Software Engineer',
      status: 'pending'
    },
    priority: 'high',
    read: false
  },
  {
    id: '2',
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    description: 'Technical interview with Microsoft for Software Engineer II',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    metadata: {
      company: 'Microsoft',
      position: 'Software Engineer II',
      interview_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'in_progress'
    },
    priority: 'high',
    read: false
  },
  {
    id: '3',
    type: 'resume_updated',
    title: 'Resume Updated',
    description: 'Updated your ATS-optimized resume with new skills',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    metadata: {
      file_name: 'John_Doe_Resume_2025.pdf'
    },
    priority: 'medium',
    read: true
  },
  {
    id: '4',
    type: 'application_viewed',
    title: 'Application Viewed',
    description: 'Your application was viewed by Amazon recruiters',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    metadata: {
      company: 'Amazon',
      position: 'Full Stack Developer',
      status: 'in_progress'
    },
    priority: 'medium',
    read: true
  },
  {
    id: '5',
    type: 'job_saved',
    title: 'Job Saved',
    description: 'Saved Product Manager position at Stripe',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    metadata: {
      company: 'Stripe',
      position: 'Product Manager'
    },
    priority: 'low',
    read: true
  },
  {
    id: '6',
    type: 'skill_assessment_completed',
    title: 'Skill Assessment Completed',
    description: 'Completed JavaScript assessment with 95% score',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    metadata: {
      score: 95
    },
    priority: 'medium',
    read: true
  }
]

// Activity icon mapping
const getActivityIcon = (type: ActivityType) => {
  const iconMap = {
    resume_created: FileText,
    resume_updated: Edit,
    application_submitted: Send,
    application_viewed: Eye,
    interview_scheduled: Calendar,
    interview_completed: CheckCircle,
    job_saved: Star,
    profile_updated: User,
    cover_letter_created: Mail,
    skill_assessment_completed: TrendingUp,
    certification_added: Plus
  }
  
  return iconMap[type] || Activity
}

// Activity color mapping
const getActivityColor = (type: ActivityType, priority: string = 'medium') => {
  const baseColors = {
    resume_created: 'text-blue-600 bg-blue-100',
    resume_updated: 'text-blue-600 bg-blue-100',
    application_submitted: 'text-green-600 bg-green-100',
    application_viewed: 'text-purple-600 bg-purple-100',
    interview_scheduled: 'text-orange-600 bg-orange-100',
    interview_completed: 'text-green-600 bg-green-100',
    job_saved: 'text-yellow-600 bg-yellow-100',
    profile_updated: 'text-gray-600 bg-gray-100',
    cover_letter_created: 'text-indigo-600 bg-indigo-100',
    skill_assessment_completed: 'text-teal-600 bg-teal-100',
    certification_added: 'text-pink-600 bg-pink-100'
  }
  
  if (priority === 'high') {
    return 'text-red-600 bg-red-100'
  }
  
  return baseColors[type] || 'text-gray-600 bg-gray-100'
}

// Status badge component
const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null
  
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null
  
  return (
    <Badge variant="outline" className={cn("text-xs", config.color)}>
      {config.label}
    </Badge>
  )
}

// Time formatting
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Individual activity item component
const ActivityItemComponent = ({ 
  activity, 
  onMarkAsRead,
  onAction
}: {
  activity: ActivityItem
  onMarkAsRead: (id: string) => void
  onAction?: (action: string, activity: ActivityItem) => void
}) => {
  const Icon = getActivityIcon(activity.type)
  const iconColor = getActivityColor(activity.type, activity.priority)
    // Consistent date formatting function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  return (
    <div className={cn(
      "flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-50",
      !activity.read && "bg-blue-50/50 border border-blue-200"
    )}>
      {/* Activity Icon */}
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", iconColor)}>
        <Icon className="w-4 h-4" />
      </div>
      
      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn(
                "text-sm font-medium text-gray-900",
                !activity.read && "font-semibold"
              )}>
                {activity.title}
              </h4>
              {!activity.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              {activity.priority === 'high' && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  High
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            
            {/* Metadata */}
            {activity.metadata && (
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {activity.metadata.company && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Building className="w-3 h-3" />
                    {activity.metadata.company}
                  </span>
                )}
                {activity.metadata.status && (
                  <StatusBadge status={activity.metadata.status} />
                )}
                {activity.metadata.score && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    {activity.metadata.score}% Score
                  </Badge>
                )}
                {activity.metadata.interview_date && (
                  <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                    <Calendar className="w-3 h-3" />
                    {formatDate(activity.metadata.interview_date)}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(activity.timestamp)}
              </span>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-1">
                {!activity.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(activity.id)}
                    className="h-6 px-2 text-xs"
                  >
                    Mark as read
                  </Button>
                )}
                
                {activity.type === 'application_submitted' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAction?.('view_application', activity)}
                    className="h-6 px-2 text-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
                
                {activity.type === 'interview_scheduled' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAction?.('add_to_calendar', activity)}
                    className="h-6 px-2 text-xs"
                  >
                    <Calendar className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Activity Feed Component
interface ActivityFeedProps {
  className?: string
  maxItems?: number
  showFilters?: boolean
  compact?: boolean
}

export default function ActivityFeed({
  className,
  maxItems = 10,
  showFilters = true,
  compact = false
}: ActivityFeedProps) {
  const [activities, setActivities] = useState(sampleActivities)
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all')

  // Filter activities
  const filteredActivities = activities
    .filter(activity => {
      if (filter === 'unread') return !activity.read
      if (filter === 'important') return activity.priority === 'high'
      return true
    })
    .filter(activity => {
      if (typeFilter === 'all') return true
      return activity.type === typeFilter
    })
    .slice(0, maxItems)

  // Mark activity as read
  const markAsRead = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, read: true } : activity
      )
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setActivities(prev => 
      prev.map(activity => ({ ...activity, read: true }))
    )
  }

  // Handle activity actions
  const handleAction = (action: string, activity: ActivityItem) => {
    switch (action) {
      case 'view_application':
        console.log('Viewing application:', activity.metadata?.company)
        break
      case 'add_to_calendar':
        console.log('Adding to calendar:', activity.metadata?.interview_date)
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const unreadCount = activities.filter(a => !a.read).length

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className={cn("text-lg font-semibold", compact && "text-base")}>
              Recent Activity
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showFilters && !compact && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                className="h-7 px-2 text-xs"
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
                className="h-7 px-2 text-xs"
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'important' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('important')}
                className="h-7 px-2 text-xs"
              >
                Important
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className={cn("pt-0", compact && "px-3")}>
        <div className="space-y-1">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No activities found</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div key={activity.id}>
                <ActivityItemComponent
                  activity={activity}
                  onMarkAsRead={markAsRead}
                  onAction={handleAction}
                />
                {index < filteredActivities.length - 1 && !compact && (
                  <Separator className="my-2" />
                )}
              </div>
            ))
          )}
        </div>
        
        {!compact && activities.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" className="text-sm">
              View all activities
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export activity types for use in other components
export type { ActivityItem, ActivityType }