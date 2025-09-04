"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Users,
  MapPin,
  Building,
  Clock,
  Award,
  Target,
  Calculator,
  Filter,
  Info,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Share,
  Zap,
  Globe,
  Briefcase,
  GraduationCap,
  Search,
  BookOpen,
  Star,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 
interface SalaryRange {
  percentile25: number;
  percentile50: number; // median
  percentile75: number;
  min: number;
  max: number;
  currency: string;
}

interface SalaryData {
  role: string;
  company?: string;
  location: string;
  experience: string;
  industry: string;
  skills: string[];
  salary: SalaryRange;
  growth: number; // percentage
  demand: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  sampleSize: number;
  remote: boolean;
  education?: string;
  certifications?: string[];
}

interface SalaryCalculatorInputs {
  role: string;
  experience: string;
  location: string;
  industry: string;
  education: string;
  skills: string[];
  remote: boolean;
}

interface SalaryInsightsProps {
  className?: string;
}

// Sample salary data
const salaryData: SalaryData[] = [
  {
    role: 'Software Engineer',
    location: 'Bangalore, India',
    experience: 'Mid Level (3-5 years)',
    industry: 'Technology',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    salary: {
      percentile25: 85000,
      percentile50: 105000,
      percentile75: 130000,
      min: 70000,
      max: 150000,
      currency: 'USD'
    },
    growth: 12.5,
    demand: 'High',
    lastUpdated: '2024-03-15',
    sampleSize: 1250,
    remote: true,
    education: 'Bachelor\'s Degree',
    certifications: ['AWS Certified', 'React Certified']
  },
  {
    role: 'Data Scientist',
    location: 'Mumbai, India',
    experience: 'Senior Level (5+ years)',
    industry: 'Technology',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    salary: {
      percentile25: 120000,
      percentile50: 145000,
      percentile75: 175000,
      min: 100000,
      max: 200000,
      currency: 'USD'
    },
    growth: 18.3,
    demand: 'High',
    lastUpdated: '2024-03-14',
    sampleSize: 890,
    remote: true,
    education: 'Master\'s Degree',
    certifications: ['Google AI', 'AWS ML']
  },
  {
    role: 'Product Manager',
    location: 'Delhi NCR, India',
    experience: 'Senior Level (5+ years)',
    industry: 'Technology',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'SQL'],
    salary: {
      percentile25: 140000,
      percentile50: 165000,
      percentile75: 195000,
      min: 120000,
      max: 220000,
      currency: 'USD'
    },
    growth: 8.7,
    demand: 'Medium',
    lastUpdated: '2024-03-13',
    sampleSize: 650,
    remote: true,
    education: 'MBA',
    certifications: ['PMP', 'Scrum Master']
  },
  {
    role: 'DevOps Engineer',
    location: 'Hyderabad, India',
    experience: 'Mid Level (3-5 years)',
    industry: 'Technology',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    salary: {
      percentile25: 95000,
      percentile50: 115000,
      percentile75: 140000,
      min: 80000,
      max: 160000,
      currency: 'USD'
    },
    growth: 15.2,
    demand: 'High',
    lastUpdated: '2024-03-12',
    sampleSize: 720,
    remote: true,
    education: 'Bachelor\'s Degree',
    certifications: ['AWS DevOps', 'Kubernetes']
  },
  {
    role: 'Financial Analyst',
    location: 'Mumbai, India',
    experience: 'Entry Level (0-2 years)',
    industry: 'Finance',
    skills: ['Excel', 'Financial Modeling', 'SQL', 'Python'],
    salary: {
      percentile25: 55000,
      percentile50: 68000,
      percentile75: 82000,
      min: 45000,
      max: 95000,
      currency: 'USD'
    },
    growth: 6.4,
    demand: 'Medium',
    lastUpdated: '2024-03-11',
    sampleSize: 480,
    remote: false,
    education: 'Bachelor\'s Degree',
    certifications: ['CFA Level 1', 'FRM']
  }
];

const experienceLevels = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (5+ years)',
  'Lead/Principal (8+ years)',
  'Executive (10+ years)'
];

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Education',
  'Government'
];

const locations = [
  'Bangalore, India',
  'Mumbai, India',
  'Delhi NCR, India',
  'Hyderabad, India',
  'Chennai, India',
  'Pune, India',
  'Kolkata, India',
  'Remote'
];

const educationLevels = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'MBA',
  'PhD',
  'Professional Certification'
];

export default function SalaryInsights({ className }: SalaryInsightsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculator state
  const [calculatorInputs, setCalculatorInputs] = useState<SalaryCalculatorInputs>({
    role: '',
    experience: '',
    location: '',
    industry: '',
    education: '',
    skills: [],
    remote: false
  });

  const [calculatedSalary, setCalculatedSalary] = useState<SalaryRange | null>(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock calculation based on inputs
    const baseSalary = 80000;
    const experienceMultiplier = calculatorInputs.experience.includes('Senior') ? 1.4 : 
                                calculatorInputs.experience.includes('Mid') ? 1.2 : 1.0;
    const remoteBonus = calculatorInputs.remote ? 1.1 : 1.0;
    const skillsBonus = 1 + (calculatorInputs.skills.length * 0.05);

    const median = Math.round(baseSalary * experienceMultiplier * remoteBonus * skillsBonus);
    
    setCalculatedSalary({
      percentile25: Math.round(median * 0.8),
      percentile50: median,
      percentile75: Math.round(median * 1.25),
      min: Math.round(median * 0.7),
      max: Math.round(median * 1.5),
      currency: 'USD'
    });
    
    setIsCalculating(false);
  };

  const filteredSalaries = salaryData.filter(salary => {
    const matchesSearch = salary.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salary.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All' || salary.industry === selectedIndustry;
    const matchesExperience = selectedExperience === 'All' || salary.experience === selectedExperience;
    const matchesLocation = selectedLocation === 'All' || salary.location === selectedLocation;
    
    return matchesSearch && matchesIndustry && matchesExperience && matchesLocation;
  });
const numberFormatter = new Intl.NumberFormat('en-US');
const formatNumber = (n: number) => numberFormatter.format(n);
const formatIsoDate = (d: string) => new Date(d).toISOString().slice(0, 10);
  // const formatSalary = (amount: number, currency: string = 'USD') => {
  //   const symbol = currency === 'USD' ? '$' : currency;
  //   return `${symbol}${amount.toLocaleString()}`;
  // };
  const formatSalary = (amount: number, currency: string = 'USD') => {
    const symbol = currency === 'USD' ? '$' : currency;
    return `${symbol}${formatNumber(amount)}`;
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

  const averageSalary = filteredSalaries.reduce((sum, salary) => sum + salary.salary.percentile50, 0) / filteredSalaries.length || 0;
  const averageGrowth = filteredSalaries.reduce((sum, salary) => sum + salary.growth, 0) / filteredSalaries.length || 0;

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salary Insights</h2>
          <p className="text-gray-600">Comprehensive salary data and compensation trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatSalary(Math.round(averageSalary))}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+8.5% from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Growth</p>
                <p className="text-2xl font-bold text-gray-900">{averageGrowth.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-blue-600">Year over year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Demand Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSalaries.filter(s => s.demand === 'High').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <Target className="w-4 h-4 text-orange-600 mr-1" />
              <span className="text-orange-600">Hot opportunities</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                {/* <p className="text-2xl font-bold text-gray-900">
                  {filteredSalaries.reduce((sum, s) => sum + s.sampleSize, 0).toLocaleString()}
                </p> */}
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(filteredSalaries.reduce((sum, s) => sum + s.sampleSize, 0))}
               </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <CheckCircle className="w-4 h-4 text-purple-600 mr-1" />
              <span className="text-purple-600">Verified data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Salary Overview</TabsTrigger>
          <TabsTrigger value="calculator">Salary Calculator</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="compare">Compare Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Role/Skills</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="e.g., Software Engineer, Python"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Industries</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Levels</SelectItem>
                      {experienceLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Data List */}
          <div className="space-y-4">
            {filteredSalaries.map((salary, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{salary.role}</h3>
                        <Badge className={getDemandColor(salary.demand)}>
                          {salary.demand} Demand
                        </Badge>
                        {salary.remote && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Remote
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span>{salary.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{salary.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          <span>{salary.industry}</span>
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Salary Range</span>
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(salary.growth)}
                            <span className={cn("text-sm font-medium", getGrowthColor(salary.growth))}>
                              {salary.growth}% growth
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">25th Percentile</p>
                            <p className="font-semibold">{formatSalary(salary.salary.percentile25)}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-600">Median</p>
                            <p className="font-semibold text-blue-700">{formatSalary(salary.salary.percentile50)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">75th Percentile</p>
                            <p className="font-semibold">{formatSalary(salary.salary.percentile75)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {salary.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {/* <span>{salary.sampleSize.toLocaleString()} data points</span> */}
                             <span>{formatNumber(salary.sampleSize)} data points</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {/* <span>Updated {new Date(salary.lastUpdated).toLocaleDateString()}</span> */}
                             <span>Updated {formatIsoDate(salary.lastUpdated)}</span>
                          </div>
                          {salary.education && (
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              <span>{salary.education}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSalaries.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Salary Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-role">Job Role</Label>
                  <Input
                    id="calc-role"
                    placeholder="e.g., Software Engineer"
                    value={calculatorInputs.role}
                    onChange={(e) => setCalculatorInputs(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={calculatorInputs.experience} onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={calculatorInputs.location} onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={calculatorInputs.industry} onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Education</Label>
                  <Select value={calculatorInputs.education} onValueChange={(value) => setCalculatorInputs(prev => ({ ...prev, education: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map(education => (
                        <SelectItem key={education} value={education}>{education}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calc-skills">Skills (comma separated)</Label>
                  <Input
                    id="calc-skills"
                    placeholder="e.g., React, Python, AWS"
                    value={calculatorInputs.skills.join(', ')}
                    onChange={(e) => setCalculatorInputs(prev => ({ 
                      ...prev, 
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="calc-remote"
                    checked={calculatorInputs.remote}
                    onChange={(e) => setCalculatorInputs(prev => ({ ...prev, remote: e.target.checked }))}
                  />
                  <Label htmlFor="calc-remote">Open to Remote Work</Label>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  className="w-full"
                  disabled={isCalculating || !calculatorInputs.role || !calculatorInputs.experience}
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Salary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Calculator Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Estimated Salary Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculatedSalary ? (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Estimated Annual Salary</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatSalary(calculatedSalary.percentile50)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Range: {formatSalary(calculatedSalary.min)} - {formatSalary(calculatedSalary.max)}
                      </p>
                    </div>

                    {/* Percentile Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Salary Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">25th Percentile</span>
                          <span className="font-medium">{formatSalary(calculatedSalary.percentile25)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">50th Percentile (Median)</span>
                          <span className="font-medium text-blue-600">{formatSalary(calculatedSalary.percentile50)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">75th Percentile</span>
                          <span className="font-medium">{formatSalary(calculatedSalary.percentile75)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Factors */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Factors Considered</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Experience Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Industry</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Skills ({calculatorInputs.skills.length})</span>
                        </div>
                        {calculatorInputs.remote && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Remote Work</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="text-xs text-yellow-800">
                          <p className="font-medium mb-1">Disclaimer</p>
                          <p>This estimate is based on market data and may vary based on company size, specific requirements, and negotiation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Calculate</h3>
                    <p className="text-gray-600">Fill in your details to get a personalized salary estimate.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salary Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Salary Growth by Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salaryData.map((salary, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{salary.role}</p>
                        <p className="text-sm text-gray-600">{salary.experience}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {getGrowthIcon(salary.growth)}
                          <span className={cn("font-medium", getGrowthColor(salary.growth))}>
                            {salary.growth}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">YoY growth</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industry Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Average Salary by Industry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industries.slice(0, 5).map((industry) => {
                    const industrySalaries = salaryData.filter(s => s.industry === industry);
                    const avgSalary = industrySalaries.reduce((sum, s) => sum + s.salary.percentile50, 0) / industrySalaries.length || 0;
                    const percentage = industrySalaries.length > 0 ? (avgSalary / 200000) * 100 : 0;
                    
                    return (
                      <div key={industry} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{industry}</span>
                          <span className="text-sm font-medium">
                            {avgSalary > 0 ? formatSalary(Math.round(avgSalary)) : 'No data'}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Role Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Role</th>
                      <th className="text-left p-3">Experience</th>
                      <th className="text-left p-3">Median Salary</th>
                      <th className="text-left p-3">Growth</th>
                      <th className="text-left p-3">Demand</th>
                      <th className="text-left p-3">Remote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryData.map((salary, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{salary.role}</p>
                            <p className="text-xs text-gray-600">{salary.industry}</p>
                          </div>
                        </td>
                        <td className="p-3">{salary.experience}</td>
                        <td className="p-3 font-medium text-green-600">
                          {formatSalary(salary.salary.percentile50)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {getGrowthIcon(salary.growth)}
                            <span className={getGrowthColor(salary.growth)}>
                              {salary.growth}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getDemandColor(salary.demand)}>
                            {salary.demand}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {salary.remote ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Salary Insights Skeleton
export function SalaryInsightsSkeleton() {
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
      
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-18" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}