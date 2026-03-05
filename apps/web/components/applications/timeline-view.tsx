"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobStore } from '@/store/job-store';
import { cn } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Filter,
  ArrowUpDown as Sort,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Users,
  ExternalLink
} from 'lucide-react';
import type { JobApplication } from '@/store/job-store';

interface TimelineViewProps {
  className?: string;
}

type TimelineFilter = 'all' | 'applied' | 'interview' | 'offer' | 'rejected';
type TimelineSortBy = 'date' | 'status' | 'company' | 'title';

const statusConfig = {
  draft: {
    icon: FileText,
    color: 'bg-gray-100 text-gray-800',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  applied: {
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  interview: {
    icon: Users,
    color: 'bg-yellow-100 text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  offer: {
    icon: Star,
    color: 'bg-green-100 text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  withdrawn: {
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
};

const timelineEventConfig = {
  applied: { icon: CheckCircle, color: 'text-blue-600' },
  response: { icon: Mail, color: 'text-green-600' },
  interview: { icon: Users, color: 'text-yellow-600' },
  offer: { icon: Star, color: 'text-green-600' },
  rejection: { icon: XCircle, color: 'text-red-600' },
  'follow-up': { icon: MessageSquare, color: 'text-blue-600' },
  note: { icon: FileText, color: 'text-gray-600' }
};

export default function TimelineView({ className }: TimelineViewProps) {
  const { applications, jobs, getJobById } = useJobStore();
  const [filter, setFilter] = useState<TimelineFilter>('all');
  const [sortBy, setSortBy] = useState<TimelineSortBy>('date');
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Apply status filter
    if (filter !== 'all') {
      filtered = applications.filter(app => app.status === filter);
    }

    // Sort applications
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'company':
          const jobA = getJobById(a.jobId);
          const jobB = getJobById(b.jobId);
          return (jobA?.company || '').localeCompare(jobB?.company || '');
        case 'title':
          const titleA = getJobById(a.jobId);
          const titleB = getJobById(b.jobId);
          return (titleA?.title || '').localeCompare(titleB?.title || '');
        default:
          return 0;
      }
    });

    return sorted;
  }, [applications, filter, sortBy, getJobById]);

  const toggleExpanded = (applicationId: string) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId);
    } else {
      newExpanded.add(applicationId);
    }
    setExpandedApplications(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const renderTimelineEvent = (event: JobApplication['timeline'][0], isLast: boolean) => {
    const config = timelineEventConfig[event.type] || { icon: FileText, color: 'text-gray-600' };
    const Icon = config.icon;

    return (
      <div key={event.id} className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
            config.color === 'text-blue-600' ? 'bg-blue-100' :
              config.color === 'text-green-600' ? 'bg-green-100' :
                config.color === 'text-yellow-600' ? 'bg-yellow-100' :
                  config.color === 'text-red-600' ? 'bg-red-100' :
                    'bg-gray-100'
          )}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          {!isLast && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
        </div>
        <div className="flex-1 pb-8">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-gray-900">{event.description}</p>
            <span className="text-xs text-gray-500">{getRelativeTime(event.date)}</span>
          </div>
          {event.details && (
            <p className="text-sm text-gray-600 mt-1">{event.details}</p>
          )}
        </div>
      </div>
    );
  };

  const renderApplicationCard = (application: JobApplication) => {
    const job = getJobById(application.jobId);
    const isExpanded = expandedApplications.has(application.id);
    const statusInfo = statusConfig[application.status];
    const StatusIcon = statusInfo.icon;

    if (!job) return null;

    return (
      <Card key={application.id} className={cn(
        "transition-all duration-200 hover:shadow-md",
        statusInfo.bgColor,
        statusInfo.borderColor
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={statusInfo.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">
                  Applied {getRelativeTime(application.appliedAt)}
                </span>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {job.title}
              </h3>

              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {application.reminders.filter(r => !r.completed).length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {application.reminders.filter(r => !r.completed).length} reminder(s)
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(application.id)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Quick Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{application.timeline.length} events</span>
            </div>

            {application.contacts.length > 0 && (
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{application.contacts.length} contact(s)</span>
              </div>
            )}

            {job.url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(job.url, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Job
              </Button>
            )}
          </div>

          {/* Notes Preview */}
          {application.notes && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 line-clamp-2">
                {application.notes}
              </p>
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-6 pt-4 border-t">
              {/* Contacts */}
              {application.contacts.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Contacts
                  </h4>
                  <div className="space-y-2">
                    {application.contacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-600">{contact.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Mail className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Phone className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </h4>
                <div className="space-y-0">
                  {application.timeline
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event, index, array) =>
                      renderTimelineEvent(event, index === array.length - 1)
                    )}
                </div>
              </div>

              {/* Active Reminders */}
              {application.reminders.filter(r => !r.completed).length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Upcoming Reminders
                  </h4>
                  <div className="space-y-2">
                    {application.reminders
                      .filter(r => !r.completed)
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <div>
                            <p className="font-medium text-sm">{reminder.message}</p>
                            <p className="text-xs text-gray-600">
                              {formatDate(reminder.date)} • {reminder.type}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs">
                            Mark Done
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Timeline</h2>
          <p className="text-gray-600">Track your job applications chronologically</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <Select value={filter} onValueChange={(value) => setFilter(value as TimelineFilter)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as TimelineSortBy)}>
            <SelectTrigger className="w-40">
              <Sort className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
              <SelectItem value="company">Sort by Company</SelectItem>
              <SelectItem value="title">Sort by Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = applications.filter(app => app.status === status).length;
          const Icon = config.icon;

          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    config.bgColor
                  )}>
                    <Icon className={cn("w-6 h-6", config.color.replace('bg-', '').replace('text-', 'text-'))} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredAndSortedApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all'
                  ? "You haven't submitted any job applications yet."
                  : `No applications with status "${filter}" found.`
                }
              </p>
              <Button>Start Applying to Jobs</Button>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedApplications.map(renderApplicationCard)
        )}
      </div>
    </div>
  );
}

// Timeline View Skeleton
export function TimelineViewSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-80" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-gray-200 rounded" />
          <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-8" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-48" />
                  <div className="h-4 bg-gray-200 rounded w-64" />
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-16 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                  <div className="h-8 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
