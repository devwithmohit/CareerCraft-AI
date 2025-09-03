"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  DollarSign,
  MapPin,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Briefcase,
  Building,
  Globe,
  Zap,
  Clock,
  Star,
  Award,
  AlertTriangle,
  Info,
  ChevronRight,
  RefreshCw,
  Download,
  Share
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketTrendData {
  industry: string;
  growth: number; // percentage
  demandLevel: 'High' | 'Medium' | 'Low';
  avgSalary: {
    min: number;
    max: number;
    currency: string;
  };
  jobCount: number;
  skillsInDemand: string[];
  locations: {
    name: string;
    jobCount: number;
    growth: number;
  }[];
  forecast: 'Growing' | 'Stable' | 'Declining';
  timeToHire: number; // days
  competitionLevel: 'Low' | 'Medium' | 'High';
}

interface SalaryTrend {
  role: string;
  experience: string;
  salary: number;
  growth: number;
  currency: string;
  demand: 'High' | 'Medium' | 'Low';
}

interface SkillTrend {
  skill: string;
  demand: number; // percentage
  growth: number;
  jobCount: number;
  avgSalary: number;
  category: string;
}

interface MarketTrendsProps {
  className?: string;
}

// Sample data - in real app this would come from API
const marketData: MarketTrendData[] = [
  {
    industry: 'Technology',
    growth: 12.5,
    demandLevel: 'High',
    avgSalary: { min: 80000, max: 150000, currency: 'USD' },
    jobCount: 15420,
    skillsInDemand: ['React', 'Python', 'AWS', 'Node.js', 'TypeScript'],
    locations: [
      { name: 'Bangalore', jobCount: 5200, growth: 15.2 },
      { name: 'Hyderabad', jobCount: 3800, growth: 11.8 },
      { name: 'Mumbai', jobCount: 3200, growth: 9.5 },
      { name: 'Delhi NCR', jobCount: 3220, growth: 8.7 }
    ],
    forecast: 'Growing',
    timeToHire: 25,
    competitionLevel: 'Medium'
  },
  {
    industry: 'Finance',
    growth: 8.3,
    demandLevel: 'Medium',
    avgSalary: { min: 60000, max: 120000, currency: 'USD' },
    jobCount: 8950,
    skillsInDemand: ['Excel', 'SQL', 'Python', 'Risk Management', 'Financial Modeling'],
    locations: [
      { name: 'Mumbai', jobCount: 3200, growth: 9.1 },
      { name: 'Delhi NCR', jobCount: 2800, growth: 7.8 },
      { name: 'Bangalore', jobCount: 1950, growth: 8.5 },
      { name: 'Chennai', jobCount: 1000, growth: 6.2 }
    ],
    forecast: 'Stable',
    timeToHire: 30,
    competitionLevel: 'High'
  },
  {
    industry: 'Healthcare',
    growth: 15.7,
    demandLevel: 'High',
    avgSalary: { min: 50000, max: 100000, currency: 'USD' },
    jobCount: 12300,
    skillsInDemand: ['Patient Care', 'EMR Systems', 'Medical Coding', 'Telehealth', 'Data Analysis'],
    locations: [
      { name: 'Delhi NCR', jobCount: 4200, growth: 18.2 },
      { name: 'Mumbai', jobCount: 3800, growth: 16.1 },
      { name: 'Bangalore', jobCount: 2300, growth: 14.8 },
      { name: 'Chennai', jobCount: 2000, growth: 12.5 }
    ],
    forecast: 'Growing',
    timeToHire: 20,
    competitionLevel: 'Low'
  }
];

const salaryTrends: SalaryTrend[] = [
  { role: 'Software Engineer', experience: 'Mid (3-5 yrs)', salary: 95000, growth: 8.5, currency: 'USD', demand: 'High' },
  { role: 'Data Scientist', experience: 'Senior (5+ yrs)', salary: 125000, growth: 12.2, currency: 'USD', demand: 'High' },
  { role: 'Product Manager', experience: 'Senior (5+ yrs)', salary: 140000, growth: 6.8, currency: 'USD', demand: 'Medium' },
  { role: 'DevOps Engineer', experience: 'Mid (3-5 yrs)', salary: 110000, growth: 15.3, currency: 'USD', demand: 'High' },
  { role: 'Financial Analyst', experience: 'Entry (0-2 yrs)', salary: 65000, growth: 4.2, currency: 'USD', demand: 'Medium' }
];

const skillTrends: SkillTrend[] = [
  { skill: 'Artificial Intelligence', demand: 95, growth: 25.8, jobCount: 8500, avgSalary: 135000, category: 'Technology' },
  { skill: 'Cloud Computing', demand: 88, growth: 18.5, jobCount: 12200, avgSalary: 115000, category: 'Technology' },
  { skill: 'Data Analysis', demand: 82, growth: 14.2, jobCount: 15800, avgSalary: 95000, category: 'Analytics' },
  { skill: 'Cybersecurity', demand: 90, growth: 22.1, jobCount: 6800, avgSalary: 125000, category: 'Security' },
  { skill: 'Digital Marketing', demand: 75, growth: 11.5, jobCount: 9200, avgSalary: 75000, category: 'Marketing' }
];
const numberFormatter = new Intl.NumberFormat('en-US');
const formatNumber = (n: number) => numberFormatter.format(n);
export default function MarketTrends({ className }: MarketTrendsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIndustry, setSelectedIndustry] = useState('Technology');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 10) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-blue-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 10) return 'text-green-600';
    if (growth > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedIndustryData = marketData.find(data => data.industry === selectedIndustry);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Trends</h2>
          <p className="text-gray-600">Latest job market insights and salary trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Job Openings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {marketData.reduce((sum, data) => sum + data.jobCount, 0).toLocaleString()} */}
                  {formatNumber(marketData.reduce((sum, data) => sum + data.jobCount, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Salary Growth</p>
                <p className="text-2xl font-bold text-gray-900">8.5%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">Year over year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                <p className="text-2xl font-bold text-gray-900">25 days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowDownRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">-3 days faster</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Skills</p>
                <p className="text-2xl font-bold text-gray-900">AI/ML</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-gray-600">Most in-demand</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Industry Overview</TabsTrigger>
          <TabsTrigger value="salaries">Salary Trends</TabsTrigger>
          <TabsTrigger value="skills">Skills Demand</TabsTrigger>
          <TabsTrigger value="locations">Location Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Industry Selector */}
          <div className="flex flex-wrap gap-2">
            {marketData.map((data) => (
              <Button
                key={data.industry}
                variant={selectedIndustry === data.industry ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedIndustry(data.industry)}
              >
                {data.industry}
              </Button>
            ))}
          </div>

          {selectedIndustryData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Industry Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {selectedIndustryData.industry} Industry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Growth Rate</p>
                      <div className="flex items-center gap-2">
                        {getGrowthIcon(selectedIndustryData.growth)}
                        <span className={cn("font-semibold", getGrowthColor(selectedIndustryData.growth))}>
                          {selectedIndustryData.growth}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Demand Level</p>
                      <Badge className={getDemandColor(selectedIndustryData.demandLevel)}>
                        {selectedIndustryData.demandLevel}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Job Openings</p>
                      <p className="font-semibold">{selectedIndustryData.jobCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                      <p className="font-semibold">{selectedIndustryData.timeToHire} days</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Salary Range</p>
                    <p className="font-semibold text-green-600">
                      {`$${formatNumber(selectedIndustryData.avgSalary.min)} - $${formatNumber(selectedIndustryData.avgSalary.max)}`}
                   </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Market Forecast</p>
                    <div className="flex items-center gap-2">
                      {selectedIndustryData.forecast === 'Growing' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {selectedIndustryData.forecast === 'Stable' && <Activity className="w-4 h-4 text-blue-600" />}
                      {selectedIndustryData.forecast === 'Declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
                      <span className="font-medium">{selectedIndustryData.forecast}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Competition Level</p>
                    <Badge className={getDemandColor(selectedIndustryData.competitionLevel)}>
                      {selectedIndustryData.competitionLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Top Skills in Demand */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Skills in High Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedIndustryData.skillsInDemand.map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <span className="font-medium">{skill}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Hot
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Industries Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Industry Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.map((data) => (
                  <div key={data.industry} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{data.industry}</p>
                        <p className="text-sm text-gray-600">{formatNumber(data.jobCount)} jobs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {getGrowthIcon(data.growth)}
                          <span className={cn("font-medium", getGrowthColor(data.growth))}>
                            {data.growth}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">growth</p>
                      </div>
                      <Badge className={getDemandColor(data.demandLevel)}>
                        {data.demandLevel}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salaries" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Salary Trends by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salaryTrends.map((trend) => (
                  <div key={`${trend.role}-${trend.experience}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{trend.role}</h4>
                      <p className="text-sm text-gray-600">{trend.experience}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                        
                           ${formatNumber(trend.salary)}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          {getGrowthIcon(trend.growth)}
                          <span className={getGrowthColor(trend.growth)}>
                            {trend.growth}%
                          </span>
                        </div>
                      </div>
                      <Badge className={getDemandColor(trend.demand)}>
                        {trend.demand} Demand
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Skills in Demand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillTrends.map((skill) => (
                  <div key={skill.skill} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">{skill.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{skill.demand}% demand</p>
                        <div className="flex items-center gap-1 text-sm">
                          {getGrowthIcon(skill.growth)}
                          <span className={getGrowthColor(skill.growth)}>
                            {skill.growth}% growth
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Job Openings</p>
                        
                         <p className="font-medium">{formatNumber(skill.jobCount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg. Salary</p>
                        <p className="font-medium text-green-600">
                          ${skill.avgSalary.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Demand Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Market Demand</span>
                        <span>{skill.demand}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.demand}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketData.map((data) => (
              <Card key={data.industry}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {data.industry} - Top Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.locations.map((location) => (
                      <div key={location.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{location.name}</p>
                          {/* <p className="text-sm text-gray-600">{location.jobCount.toLocaleString()} jobs</p> */}
                            <p className="text-sm text-gray-600">{formatNumber(location.jobCount)} jobs</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(location.growth)}
                            <span className={cn("font-medium", getGrowthColor(location.growth))}>
                              {location.growth}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">growth</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Market Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Market Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">AI/ML Skills Surge</p>
                <p className="text-sm text-green-700">
                  Demand for AI and Machine Learning skills increased by 25% this quarter.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Remote Work Trend</p>
                <p className="text-sm text-blue-700">
                  70% of new job postings now offer remote or hybrid work options.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Faster Hiring Process</p>
                <p className="text-sm text-yellow-700">
                  Average time to hire decreased by 3 days across all industries.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Market Trends Skeleton
export function MarketTrendsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-12 bg-gray-200 rounded" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}