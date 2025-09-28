"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobStore } from '@/store/job-store';
import { cn } from '@/lib/utils';
import {
  Building,
  MapPin,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { JobApplication } from '@/store/job-store';

interface ApplicationCardProps {
  application: JobApplication;
  className?: string;
  onEdit?: (application: JobApplication) => void;
  onDelete?: (applicationId: string) => void;
  onViewDetails?: (application: JobApplication) => void;
  onStatusChange?: (applicationId: string, status: JobApplication['status']) => void;
  isDragging?: boolean;
}

const statusConfig = {
  draft: {
    icon: FileText,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    dotColor: 'bg-gray-400'
  },
  applied: {
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500'
  },
  interview: {
    icon: Users,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotColor: 'bg-yellow-500'
  },
  offer: {
    icon: Star,
    color: 'bg-green-100 text-green-800 border-green-200',
    dotColor: 'bg-green-500'
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    dotColor: 'bg-red-500'
  },
  withdrawn: {
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    dotColor: 'bg-orange-500'
  }
};

export default function ApplicationCard({
  application,
  className,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
  isDragging = false
}: ApplicationCardProps) {
  const { getJobById } = useJobStore();
  const [isHovered, setIsHovered] = useState(false);

  const job = getJobById(application.jobId);
  const statusInfo = statusConfig[application.status];
  const StatusIcon = statusInfo.icon;

  if (!job) {
    return (
      <Card className={cn("opacity-50", className)}>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-500">Job not found</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const getUpcomingReminders = () => {
    return application.reminders
      .filter(r => !r.completed && new Date(r.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getLatestTimelineEvent = () => {
    return application.timeline
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const upcomingReminders = getUpcomingReminders();
  const latestEvent = getLatestTimelineEvent();

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 rotate-3 shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(application)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", statusInfo.dotColor)} />
              <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
              <span className="text-xs text-gray-500">
                {getRelativeTime(application.appliedAt)}
              </span>
            </div>

            {/* Job Title */}
            <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>

            {/* Company & Location */}
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span className="truncate">{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isHovered && "opacity-100"
          )}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails?.(application)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(application)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Application
                </DropdownMenuItem>
                {job.url && (
                  <DropdownMenuItem onClick={() => window.open(job.url, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Job Posting
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(application.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{application.timeline.length} events</span>
          </div>

          {application.contacts.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{application.contacts.length} contact{application.contacts.length > 1 ? 's' : ''}</span>
            </div>
          )}

          {upcomingReminders.length > 0 && (
            <div className="flex items-center gap-1 text-amber-600">
              <Clock className="w-3 h-3" />
              <span>{upcomingReminders.length} reminder{upcomingReminders.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Latest Activity */}
        {latestEvent && (
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-medium">Latest Activity</p>
            <p className="text-xs text-gray-800 mt-1">
              {latestEvent.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getRelativeTime(latestEvent.date)}
            </p>
          </div>
        )}

        {/* Upcoming Reminder */}
        {upcomingReminders.length > 0 && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-medium">Next Reminder</p>
            <p className="text-xs text-amber-700 mt-1">
              {upcomingReminders[0].message}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {formatDate(upcomingReminders[0].date)}
            </p>
          </div>
        )}

        {/* Notes Preview */}
        {application.notes && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Notes</p>
            <p className="text-xs text-blue-800 mt-1 line-clamp-2">
              {application.notes}
            </p>
          </div>
        )}

        {/* Primary Contact */}
        {application.contacts.length > 0 && (
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <div>
              <p className="text-xs text-green-800 font-medium">
                {application.contacts[0].name}
              </p>
              <p className="text-xs text-green-600">
                {application.contacts[0].role}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-green-600 hover:bg-green-100"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle email action
                }}
              >
                <Mail className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-green-600 hover:bg-green-100"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle phone action
                }}
              >
                <Phone className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Status-specific Actions */}
        <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
          {application.status === 'draft' && (
            <Button
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onStatusChange?.(application.id, 'applied')}
            >
              Submit Application
            </Button>
          )}

          {application.status === 'applied' && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onStatusChange?.(application.id, 'interview')}
            >
              Mark Interview
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="px-3 text-xs"
            onClick={() => onEdit?.(application)}
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Application Card Skeleton
export function ApplicationCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-48" />
            <div className="flex gap-3">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-18" />
        </div>
        <div className="h-16 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1" />
          <div className="h-8 w-12 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
