"use client";

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplicationCard from './application-card';
import AddApplication from './add-application';
import { useJobStore } from '@/store/job-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import {
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings,
  Grid3X3,
  BarChart3,
  Calendar,
  Building,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  FileText,
} from 'lucide-react';
import type { JobApplication } from '@/store/job-store';

interface KanbanBoardProps {
  className?: string;
  compactMode?: boolean;
  showStats?: boolean;
}

// Column configuration matching your status system
const KANBAN_COLUMNS = [
  {
    id: 'draft',
    title: 'Draft',
    icon: FileText,
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    bgColor: 'bg-gray-50',
  },
  {
    id: 'applied',
    title: 'Applied',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'interview',
    title: 'Interview',
    icon: Users,
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-300',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'offer',
    title: 'Offer',
    icon: Star,
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50',
  },
  {
    id: 'withdrawn',
    title: 'Withdrawn',
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50',
  },
] as const;

type ColumnId = typeof KANBAN_COLUMNS[number]['id'];

// Droppable column component
function DroppableColumn({
  id,
  title,
  icon: Icon,
  color,
  borderColor,
  bgColor,
  applications,
  compactMode,
}: {
  id: ColumnId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  bgColor: string;
  applications: JobApplication[];
  compactMode?: boolean;
}) {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: `column-${id}`,
    data: {
      type: 'column',
      columnId: id,
    },
  });

  const applicationIds = applications.map(app => app.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-h-[600px] rounded-lg border-2 border-dashed transition-colors",
        isOver ? "border-blue-400 bg-blue-50" : borderColor,
        bgColor
      )}
    >
      {/* Column Header */}
      <div className={cn("p-4 border-b", borderColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <h3 className="font-semibold text-sm">{title}</h3>
            <Badge variant="outline" className={cn("text-xs", color)}>
              {applications.length}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <AddApplication defaultJobId="">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </AddApplication>

            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        <SortableContext items={applicationIds} strategy={verticalListSortingStrategy}>
          {applications.map((application) => (
            <SortableApplicationCard
              key={application.id}
              application={application}
              compactMode={compactMode}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">No applications</p>
            <AddApplication defaultJobId="">
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Add Application
              </Button>
            </AddApplication>
          </div>
        )}
      </div>
    </div>
  );
}

// Sortable application card wrapper
function SortableApplicationCard({
  application,
  compactMode,
}: {
  application: JobApplication;
  compactMode?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: {
      type: 'application',
      application,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <ApplicationCard
        application={application}
        isDragging={isDragging}
        className={cn(
          "transition-shadow hover:shadow-md",
          compactMode && "text-sm"
        )}
      />
    </div>
  );
}

export default function KanbanBoard({
  className,
  compactMode = false,
  showStats = true,
}: KanbanBoardProps) {
  const {
    applications,
    updateApplication,
    getJobById,
    searchJobs
  } = useJobStore();

  const { addNotification } = useUIStore();

  // Drag and drop state
  const [activeApplication, setActiveApplication] = useState<JobApplication | null>(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [hiddenColumns, setHiddenColumns] = useState<Set<ColumnId>>(new Set());

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter applications based on search and filters
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const job = getJobById(app.jobId);

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesJob = job?.title.toLowerCase().includes(query) ||
                          job?.company.toLowerCase().includes(query);
        const matchesNotes = app.notes?.toLowerCase().includes(query);

        if (!matchesJob && !matchesNotes) return false;
      }

      // Company filter
      if (companyFilter !== 'all' && job?.company !== companyFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const appDate = new Date(app.appliedAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case '7d':
            if (daysDiff > 7) return false;
            break;
          case '30d':
            if (daysDiff > 30) return false;
            break;
          case '90d':
            if (daysDiff > 90) return false;
            break;
        }
      }

      return true;
    });
  }, [applications, searchQuery, companyFilter, dateFilter, getJobById]);

  // Group applications by status
  const groupedApplications = useMemo(() => {
    const groups: Record<ColumnId, JobApplication[]> = {
      draft: [],
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
      withdrawn: [],
    };

    filteredApplications.forEach(app => {
      if (groups[app.status as ColumnId]) {
        groups[app.status as ColumnId].push(app);
      }
    });

    return groups;
  }, [filteredApplications]);

  // Get unique companies for filter
  const companies = useMemo(() => {
    const companySet = new Set<string>();
    applications.forEach(app => {
      const job = getJobById(app.jobId);
      if (job?.company) {
        companySet.add(job.company);
      }
    });
    return Array.from(companySet).sort();
  }, [applications, getJobById]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const statusCounts = KANBAN_COLUMNS.reduce((acc, col) => {
      acc[col.id] = groupedApplications[col.id].length;
      return acc;
    }, {} as Record<ColumnId, number>);

    const responseRate = total > 0 ?
      ((statusCounts.interview + statusCounts.offer) / total * 100) : 0;

    return {
      total,
      ...statusCounts,
      responseRate: Math.round(responseRate * 10) / 10,
    };
  }, [filteredApplications, groupedApplications]);

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === 'application') {
      setActiveApplication(active.data.current.application);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveApplication(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping on column
    if (over.data.current?.type === 'column') {
      const newStatus = over.data.current.columnId as JobApplication['status'];
      const application = filteredApplications.find(app => app.id === activeId);

      if (application && application.status !== newStatus) {
        updateApplication(activeId, {
          status: newStatus,
        });

        // Add timeline event
        const statusDescriptions = {
          draft: 'Moved to draft',
          applied: 'Application submitted',
          interview: 'Interview scheduled',
          offer: 'Offer received',
          rejected: 'Application rejected',
          withdrawn: 'Application withdrawn',
        };

        // This would be handled by the updateApplication method in a real implementation
        addNotification({
          type: 'success',
          title: 'Status Updated',
          message: `Application moved to ${newStatus}`,
          duration: 3000,
        });
      }
    }

    setActiveApplication(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle any drag over logic if needed
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: ColumnId) => {
    const newHidden = new Set(hiddenColumns);
    if (newHidden.has(columnId)) {
      newHidden.delete(columnId);
    } else {
      newHidden.add(columnId);
    }
    setHiddenColumns(newHidden);
  };

  const visibleColumns = KANBAN_COLUMNS.filter(col => !hiddenColumns.has(col.id));

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Board</h2>
          <p className="text-gray-600">Manage your job applications with drag & drop</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompactMode(!compactMode)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            {compactMode ? 'Comfortable' : 'Compact'}
          </Button>

          <AddApplication>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </AddApplication>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const Icon = col.icon;
            const count = stats[col.id] || 0;

            return (
              <Card key={col.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{col.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", col.bgColor)}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-48">
            <Building className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Column visibility toggle */}
        <Select>
          <SelectTrigger className="w-40">
            <Eye className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Columns" />
          </SelectTrigger>
          <SelectContent>
            {KANBAN_COLUMNS.map((col) => (
              <SelectItem
                key={col.id}
                value={col.id}
                onClick={() => toggleColumnVisibility(col.id)}
              >
                <div className="flex items-center gap-2">
                  {hiddenColumns.has(col.id) ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {col.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6 min-h-[600px]">
          {visibleColumns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              color={column.color}
              borderColor={column.borderColor}
              bgColor={column.bgColor}
              applications={groupedApplications[column.id]}
              compactMode={compactMode}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeApplication ? (
            <ApplicationCard
              application={activeApplication}
              isDragging={true}
              className="rotate-2 shadow-lg"
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {searchQuery || companyFilter !== 'all' || dateFilter !== 'all'
              ? "No applications match your current filters. Try adjusting your search criteria."
              : "Start tracking your job applications by adding your first application to the board."
            }
          </p>
          <div className="flex gap-3">
            {(searchQuery || companyFilter !== 'all' || dateFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setCompanyFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
            <AddApplication>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Application
              </Button>
            </AddApplication>
          </div>
        </div>
      )}
    </div>
  );
}

// Kanban Board Skeleton
export function KanbanBoardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-80" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-12" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="h-16 bg-gray-200 rounded-lg" />

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="min-h-[600px] bg-gray-100 rounded-lg p-4 space-y-4">
            <div className="h-8 bg-gray-200 rounded" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
