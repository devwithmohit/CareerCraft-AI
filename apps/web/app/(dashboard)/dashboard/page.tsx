"use client"
import React from 'react'
import ActivityFeed from '@/components/dashboard/activity-feed'
import { MetricsGrid } from '@/components/dashboard/metric-card'
import { ProgressChartsGrid } from '@/components/dashboard/progress-chart'
import QuickActions from '@/components/dashboard/quick-actions'

// Define proper types
interface MetricData {
  id: string
  type: string
  title: string
  value: number | string
  // Add other properties as needed
}

interface QuickActionData {
  id: string
  title: string
  href?: string
  // Add other properties as needed
}

export default function DashboardPage(): JSX.Element {
  // Handle metric clicks
  const handleMetricClick = (metric: MetricData) => {
    console.log('Clicked metric:', metric)
    // Add your navigation or modal logic here
    switch (metric.type) {
      case 'applications':
        // Navigate to applications page
        break
      case 'ats_score':
        // Navigate to resume builder
        break
      case 'interviews':
        // Navigate to interviews page
        break
      default:
        console.log('Unknown metric type:', metric.type)
    }
  }

  // Handle metric actions
  const handleMetricAction = (action: string, metric: MetricData) => {
    console.log('Metric action:', action, metric)
    // Handle specific actions like 'view_details', 'new_application', etc.
  }

  // Handle quick action clicks
  const handleQuickActionClick = (action: QuickActionData) => {
    console.log('Quick action clicked:', action)
    // Add navigation logic here based on action.href or action.id
    if (action.href) {
      // Navigate to action.href
      console.log('Navigate to:', action.href)
    }
  }

  // Handle chart actions
  const handleChartAction = (action: string, chartId: string) => {
    console.log('Chart action:', action, chartId)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your job search progress and activities</p>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsGrid 
        columns={3}
        showTrend={true}
        showTarget={true}
        showActions={true}
        onMetricClick={handleMetricClick}
        onMetricAction={handleMetricAction}
      />
      
      {/* Progress Charts */}
      <ProgressChartsGrid 
        columns={2} 
        size="medium" 
        onChartAction={handleChartAction}
      />
      
      {/* Activity Feed and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed maxItems={8} />
        
        <QuickActions 
          maxItems={6} 
          columns={1}
          showCategories={true}
          showSearch={false}
          onActionClick={handleQuickActionClick}
        />
      </div>
    </div>

  
)
                  
         
          
  
}