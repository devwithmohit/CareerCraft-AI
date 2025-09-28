"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobStore } from '@/store/job-store';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Calendar,
  Building,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Briefcase,
  DollarSign,
  Percent
} from 'lucide-react';
import type { JobApplication } from '@/store/job-store';

interface ApplicationAnalyticsProps {
  className?: string;
}

type TimeRange = '7d' | '30d' | '90d' | '6m' | '1y' | 'all';
type ChartType = 'status' | 'timeline' | 'companies' | 'locations' | 'conversion';

// Color schemes for charts
const STATUS_COLORS = {
  draft: '#6B7280',
  applied: '#3B82F6',
  interview: '#F59E0B',
  offer: '#10B981',
  rejected: '#EF4444',
  withdrawn: '#F97316'
};

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export default function ApplicationAnalytics({ className }: ApplicationAnalyticsProps) {
  const { applications, jobs, getJobById } = useJobStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeChart, setActiveChart] = useState<ChartType>('status');

  // Filter applications based on time range
  const filteredApplications = useMemo(() => {
    if (timeRange === 'all') return applications;

    const now = new Date();
    const ranges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '6m': 180 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    };

    const cutoffTime = now.getTime() - ranges[timeRange];

    return applications.filter(app =>
      new Date(app.appliedAt).getTime() >= cutoffTime
    );
  }, [applications, timeRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const total = filteredApplications.length;
    const statusCounts = filteredApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const responseRate = total > 0 ?
      ((statusCounts.interview || 0) + (statusCounts.offer || 0)) / total * 100 : 0;

    const offerRate = total > 0 ? (statusCounts.offer || 0) / total * 100 : 0;

    const avgResponseTime = filteredApplications
      .filter(app => app.timeline.length > 1)
      .reduce((acc, app) => {
        const firstEvent = new Date(app.timeline[0].date);
        const lastEvent = new Date(app.timeline[app.timeline.length - 1].date);
        return acc + (lastEvent.getTime() - firstEvent.getTime());
      }, 0) / Math.max(1, filteredApplications.filter(app => app.timeline.length > 1).length);

    const avgResponseDays = Math.round(avgResponseTime / (1000 * 60 * 60 * 24));

    return {
      total,
      applied: statusCounts.applied || 0,
      interviews: statusCounts.interview || 0,
      offers: statusCounts.offer || 0,
      rejected: statusCounts.rejected || 0,
      responseRate: Math.round(responseRate * 10) / 10,
      offerRate: Math.round(offerRate * 10) / 10,
      avgResponseDays: isNaN(avgResponseDays) ? 0 : avgResponseDays,
    };
  }, [filteredApplications]);

  // Prepare chart data
  const chartData = useMemo(() => {
    switch (activeChart) {
      case 'status': {
        const statusData = Object.entries(STATUS_COLORS).map(([status, color]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: filteredApplications.filter(app => app.status === status).length,
          color,
          percentage: metrics.total > 0 ?
            Math.round((filteredApplications.filter(app => app.status === status).length / metrics.total) * 100) : 0
        })).filter(item => item.value > 0);

        return statusData;
      }

      case 'timeline': {
        const timelineData = [];
        const now = new Date();
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayApplications = filteredApplications.filter(app =>
            app.appliedAt.startsWith(dateStr)
          );

          timelineData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            applied: dayApplications.length,
            responses: dayApplications.filter(app =>
              app.timeline.some(event =>
                event.type === 'response' && event.date.startsWith(dateStr)
              )
            ).length,
          });
        }

        return timelineData;
      }

      case 'companies': {
        const companyData = filteredApplications.reduce((acc, app) => {
          const job = getJobById(app.jobId);
          if (job) {
            const company = job.company;
            acc[company] = (acc[company] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        return Object.entries(companyData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([company, count], index) => ({
            name: company,
            value: count,
            color: CHART_COLORS[index % CHART_COLORS.length]
          }));
      }

      case 'locations': {
        const locationData = filteredApplications.reduce((acc, app) => {
          const job = getJobById(app.jobId);
          if (job) {
            const location = job.location.split(',')[0].trim(); // Take city only
            acc[location] = (acc[location] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        return Object.entries(locationData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([location, count], index) => ({
            name: location,
            value: count,
            color: CHART_COLORS[index % CHART_COLORS.length]
          }));
      }

      case 'conversion': {
        const conversionData = [
          { stage: 'Applied', value: metrics.applied, color: STATUS_COLORS.applied },
          { stage: 'Interview', value: metrics.interviews, color: STATUS_COLORS.interview },
          { stage: 'Offer', value: metrics.offers, color: STATUS_COLORS.offer },
        ];

        return conversionData;
      }

      default:
        return [];
    }
  }, [activeChart, filteredApplications, timeRange, metrics, getJobById]);

  const renderChart = () => {
    switch (activeChart) {
      case 'status':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} (${chartData.find(d => d.name === name)?.percentage}%)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'timeline':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="applied"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                name="Applications"
              />
              <Area
                type="monotone"
                dataKey="responses"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                name="Responses"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'companies':
      case 'locations':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'conversion':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={chartData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RadialBar>
              <Tooltip />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Analytics</h2>
          <p className="text-gray-600">Track your job application performance and insights</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-36">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {timeRange === 'all' ? 'All time' : `Last ${timeRange}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.responseRate}%</p>
                <div className="flex items-center mt-1">
                  {metrics.responseRate > 20 ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <p className="text-xs text-gray-500">
                    {metrics.interviews + metrics.offers} responses
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offer Rate</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.offerRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.offers} offers received
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.avgResponseDays}</p>
                <p className="text-xs text-gray-500 mt-1">
                  days to first response
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(STATUS_COLORS).map(([status, color]) => {
          const count = filteredApplications.filter(app => app.status === status).length;
          const percentage = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;

          const StatusIcon = status === 'draft' ? Clock :
                           status === 'applied' ? CheckCircle :
                           status === 'interview' ? Users :
                           status === 'offer' ? Star :
                           status === 'rejected' ? XCircle : AlertCircle;

          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon className={cn("w-5 h-5",
                    status === 'applied' ? 'text-blue-600' :
                    status === 'interview' ? 'text-yellow-600' :
                    status === 'offer' ? 'text-green-600' :
                    status === 'rejected' ? 'text-red-600' :
                    'text-gray-600'
                  )} />
                  <Badge variant="secondary" style={{ backgroundColor: color + '20', color }}>
                    {percentage}%
                  </Badge>
                </div>
                <p className="text-xs font-medium text-gray-600 capitalize">{status}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Application Analytics</CardTitle>
            <Tabs value={activeChart} onValueChange={(value) => setActiveChart(value as ChartType)}>
              <TabsList>
                <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
                <TabsTrigger value="companies" className="text-xs">Companies</TabsTrigger>
                <TabsTrigger value="locations" className="text-xs">Locations</TabsTrigger>
                <TabsTrigger value="conversion" className="text-xs">Conversion</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No data available</p>
                <p className="text-sm">Try adjusting your time range or add more applications</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.responseRate > 25 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Great Response Rate!</p>
                  <p className="text-sm text-green-700">
                    Your {metrics.responseRate}% response rate is above average. Keep up the good work!
                  </p>
                </div>
              </div>
            )}

            {metrics.responseRate < 15 && metrics.total > 10 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Low Response Rate</p>
                  <p className="text-sm text-yellow-700">
                    Consider optimizing your resume or targeting different types of positions.
                  </p>
                </div>
              </div>
            )}

            {metrics.avgResponseDays > 14 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Slow Response Times</p>
                  <p className="text-sm text-blue-700">
                    Average response time is {metrics.avgResponseDays} days. Consider following up earlier.
                  </p>
                </div>
              </div>
            )}

            {metrics.total < 5 && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Increase Application Volume</p>
                  <p className="text-sm text-gray-700">
                    Apply to more positions to improve your chances and gather more data.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Briefcase className="w-4 h-4 mr-2" />
              Find More Jobs to Apply
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Follow Up on Pending Applications
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Optimize Resume Based on Data
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Analytics Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Analytics Skeleton
export function ApplicationAnalyticsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-80" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-gray-200 rounded" />
          <div className="h-10 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-12 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-8 bg-gray-200 rounded w-12" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="w-8 h-5 bg-gray-200 rounded" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-10 w-80 bg-gray-200 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}
