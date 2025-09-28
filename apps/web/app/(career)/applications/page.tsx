"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KanbanBoard from '@/components/applications/kanban-board';
import TimelineView from '@/components/applications/timeline-view';
import ApplicationAnalytics from '@/components/applications/application-analytics';
import AddApplication from '@/components/applications/add-application';
import { useJobStore } from '@/store/job-store';
import { useUIStore } from '@/store/ui-store';
import {
  Plus,
  BarChart3,
  Calendar,
  Grid3X3,
  List,
  Filter,
  Download,
  Settings,
  Bell,
  Search
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications, applicationStats } = useJobStore();
  const { setPageTitle } = useUIStore();
  const [activeView, setActiveView] = useState<'kanban' | 'timeline' | 'analytics'>('kanban');

  React.useEffect(() => {
    setPageTitle('Job Applications');
  }, [setPageTitle]);

  const quickStats = [
    {
      title: 'Total Applications',
      value: applicationStats.total,
      icon: Grid3X3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Applications',
      value: applicationStats.applied,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Interviews Scheduled',
      value: applicationStats.interviews,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Offers Received',
      value: applicationStats.offers,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your job applications across different stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <AddApplication>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </AddApplication>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Timeline View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <KanbanBoard showStats={false} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <TimelineView />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <ApplicationAnalytics />
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {applications.length === 0 && (
        <Card className="mt-8">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start tracking your job applications to see your progress and stay organized
                throughout your job search journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <AddApplication>
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Application
                  </Button>
                </AddApplication>
                <Button variant="outline" size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
