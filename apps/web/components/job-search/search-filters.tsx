"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Search,
  MapPin,
  Building,
  DollarSign,
  Clock,
  Filter,
  X,
  SlidersHorizontal,
  Briefcase,
  Users,
  Calendar,
  Target,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  BookmarkPlus,
  Heart,
  Star,
  TrendingUp,
  Shield,
  Award,
  GraduationCap,
  Code,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchFilters {
  query: string;
  location: string;
  jobType: string[];
  experienceLevel: string[];
  salaryRange: [number, number];
  industry: string[];
  companySize: string[];
  workType: string[];
  postedWithin: string;
  skills: string[];
  benefits: string[];
  sortBy: string;
  onlyRemote: boolean;
  onlyFeatured: boolean;
  onlyUrgent: boolean;
  hasVisaSponsorship: boolean;
  minMatchScore: number;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  jobCount: number;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  savedSearches?: string[];
  onSaveSearch?: (name: string) => void;
  onLoadSearch?: (search: string) => void;
}

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary'
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
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Government',
  'Non-profit',
  'Media',
  'Real Estate',
  'Transportation'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1001-5000 employees',
  '5000+ employees'
];

const workTypes = [
  'Office',
  'Remote',
  'Hybrid',
  'Field Work'
];

const postedWithinOptions = [
  { label: 'Any time', value: 'any' },
  { label: 'Past 24 hours', value: '1d' },
  { label: 'Past week', value: '7d' },
  { label: 'Past month', value: '30d' },
  { label: 'Past 3 months', value: '90d' }
];

const sortOptions = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Most Recent', value: 'date' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
  { label: 'Company A-Z', value: 'company_asc' },
  { label: 'Match Score', value: 'match_score' }
];

const popularSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
  'TypeScript', 'Java', 'C#', '.NET', 'Angular', 'Vue.js', 'MongoDB',
  'PostgreSQL', 'Redis', 'Kubernetes', 'DevOps', 'Machine Learning',
  'Data Science', 'UI/UX Design', 'Product Management', 'Agile', 'Scrum'
];

const benefits = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  'Life Insurance',
  '401(k)',
  'Pension Plan',
  'Stock Options',
  'Flexible Hours',
  'Work from Home',
  'Paid Time Off',
  'Sick Leave',
  'Maternity/Paternity Leave',
  'Professional Development',
  'Tuition Reimbursement',
  'Gym Membership',
  'Free Meals',
  'Commuter Benefits',
  'Childcare',
  'Employee Discounts',
  'Company Car'
];

const locations = [
  'Any Location',
  'Remote',
  'Bangalore, India',
  'Mumbai, India',
  'Delhi NCR, India',
  'Hyderabad, India',
  'Chennai, India',
  'Pune, India',
  'Kolkata, India',
  'Ahmedabad, India',
  'Jaipur, India',
  'Kochi, India'
];

export default function SearchFilters({
  filters,
  onFiltersChange,
  jobCount,
  className,
  isCollapsed = false,
  onToggleCollapse,
  savedSearches = [],
  onSaveSearch,
  onLoadSearch
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    salary: true,
    company: false,
    preferences: false,
    benefits: false,
    skills: false
  });

  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = <K extends keyof SearchFilters>(
    key: K,
    value: string,
    currentArray: string[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as SearchFilters[K]);
  };

  const clearAllFilters = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      location: '',
      jobType: [],
      experienceLevel: [],
      salaryRange: [0, 200000],
      industry: [],
      companySize: [],
      workType: [],
      postedWithin: 'any',
      skills: [],
      benefits: [],
      sortBy: 'relevance',
      onlyRemote: false,
      onlyFeatured: false,
      onlyUrgent: false,
      hasVisaSponsorship: false,
      minMatchScore: 0
    };
    onFiltersChange(defaultFilters);
  };
const numberFormatter = new Intl.NumberFormat('en-US');
const formatNumber = (n: number) => numberFormatter.format(n);

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (filters.query) count++;
//     if (filters.location && filters.location !== 'Any Location') count++;
//     if (filters.jobType.length > 0) count++;
//     if (filters.experienceLevel.length > 0) count++;
//     if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++;
//     if (filters.industry.length > 0) count++;
//     if (filters.companySize.length > 0) count++;
//     if (filters.workType.length > 0) count++;
//     if (filters.postedWithin !== 'any') count++;
//     if (filters.skills.length > 0) count++;
//     if (filters.benefits.length > 0) count++;
//     if (filters.onlyRemote) count++;
//     if (filters.onlyFeatured) count++;
//     if (filters.onlyUrgent) count++;
//     if (filters.hasVisaSponsorship) count++;
//     if (filters.minMatchScore > 0) count++;
//     return count;
//   };
const getActiveFiltersCount = () => {
    const q = filters?.query;
    const location = filters?.location;
    const jobTypeLen = filters?.jobType?.length ?? 0;
    const expLen = filters?.experienceLevel?.length ?? 0;
    const salaryRange = filters?.salaryRange ?? [0, 200000];
    const industryLen = filters?.industry?.length ?? 0;
    const companySizeLen = filters?.companySize?.length ?? 0;
    const workTypeLen = filters?.workType?.length ?? 0;
    const postedWithin = filters?.postedWithin ?? 'any';
    const skillsLen = filters?.skills?.length ?? 0;
    const benefitsLen = filters?.benefits?.length ?? 0;
    const onlyRemote = !!filters?.onlyRemote;
    const onlyFeatured = !!filters?.onlyFeatured;
    const onlyUrgent = !!filters?.onlyUrgent;
    const hasVisaSponsorship = !!filters?.hasVisaSponsorship;
    const minMatchScore = filters?.minMatchScore ?? 0;

  let count = 0;
    if (q) count++;
   if (location && location !== 'Any Location') count++;
    if (jobTypeLen > 0) count++;
    if (expLen > 0) count++;
    if ((salaryRange[0] ?? 0) > 0 || (salaryRange[1] ?? 200000) < 200000) count++;
    if (industryLen > 0) count++;
    if (companySizeLen > 0) count++;
    if (workTypeLen > 0) count++;
    if (postedWithin !== 'any') count++;
    if (skillsLen > 0) count++;
    if (benefitsLen > 0) count++;
    if (onlyRemote) count++;
    if (onlyFeatured) count++;
   if (onlyUrgent) count++;
    if (hasVisaSponsorship) count++;
    if (minMatchScore > 0) count++;
    return count;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const formatSalary = (value: number) => {
    if (value >= 100000) {
      return `$${Math.round(value / 1000)}k`;
    }
    return `$${formatNumber(value)}`;
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim() && onSaveSearch) {
      onSaveSearch(saveSearchName.trim());
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  if (isCollapsed) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Filters</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{jobCount.toLocaleString()} jobs</span> */}
               <div className="flex items-center gap-2">
             <span className="text-sm text-gray-600">{formatNumber(jobCount)} jobs</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleCollapse}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-gray-600">
              {jobCount.toLocaleString()} jobs found
            </span> */}
            <span className="text-sm text-gray-600">
              {formatNumber(jobCount)} jobs found
            </span>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear All
          </Button>
          
          {savedSearches.length > 0 && (
            <Select onValueChange={onLoadSearch}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Saved searches" />
              </SelectTrigger>
              <SelectContent>
                {savedSearches.map((search, index) => (
                  <SelectItem key={index} value={search} className="text-xs">
                    {search}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {onSaveSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="text-xs"
            >
              <BookmarkPlus className="w-3 h-3 mr-1" />
              Save Search
            </Button>
          )}
        </div>

        {/* Save Search Dialog */}
        {showSaveDialog && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Save Current Search</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter search name"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={handleSaveSearch}>
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Basic Search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between cursor-pointer" 
               onClick={() => toggleSection('basic')}>
            <h3 className="font-semibold text-sm">Basic Search</h3>
            {expandedSections.basic ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {expandedSections.basic && (
            <div className="space-y-4">
              {/* Search Query */}
              <div className="space-y-2">
                <Label htmlFor="query" className="text-sm font-medium">
                  Job Title or Keywords
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="query"
                    placeholder="e.g., Software Engineer, Product Manager"
                    value={filters.query}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Select 
                  value={filters.location} 
                  onValueChange={(value) => updateFilter('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        <div className="flex items-center gap-2">
                          {location === 'Remote' ? (
                            <Globe className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {location}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Job Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {jobTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`jobtype-${type}`}
                        checked={filters.jobType.includes(type)}
                        onCheckedChange={() => toggleArrayFilter('jobType', type, filters.jobType)}
                      />
                      <Label htmlFor={`jobtype-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Experience Level</Label>
                <div className="space-y-2">
                  {experienceLevels.map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`exp-${level}`}
                        checked={filters.experienceLevel.includes(level)}
                        onCheckedChange={() => toggleArrayFilter('experienceLevel', level, filters.experienceLevel)}
                      />
                      <Label htmlFor={`exp-${level}`} className="text-sm">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Salary Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between cursor-pointer" 
               onClick={() => toggleSection('salary')}>
            <h3 className="font-semibold text-sm">Salary Range</h3>
            {expandedSections.salary ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {expandedSections.salary && (
            <div className="space-y-4">
              <div className="px-2">
                <Slider
                  value={filters.salaryRange}
                  onValueChange={(value) => updateFilter('salaryRange', value as [number, number])}
                  min={0}
                  max={300000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                  <span>{formatSalary(filters.salaryRange[0])}</span>
                  <span>{formatSalary(filters.salaryRange[1])}</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                Annual salary range: {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Company & Industry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between cursor-pointer" 
               onClick={() => toggleSection('company')}>
            <h3 className="font-semibold text-sm">Company & Industry</h3>
            {expandedSections.company ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {expandedSections.company && (
            <div className="space-y-4">
              {/* Industry */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Industry</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {industries.map(industry => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={`industry-${industry}`}
                        checked={filters.industry.includes(industry)}
                        onCheckedChange={() => toggleArrayFilter('industry', industry, filters.industry)}
                      />
                      <Label htmlFor={`industry-${industry}`} className="text-sm">
                        {industry}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company Size</Label>
                <div className="space-y-2">
                  {companySizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.companySize.includes(size)}
                        onCheckedChange={() => toggleArrayFilter('companySize', size, filters.companySize)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Work Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between cursor-pointer" 
               onClick={() => toggleSection('preferences')}>
            <h3 className="font-semibold text-sm">Work Preferences</h3>
            {expandedSections.preferences ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {expandedSections.preferences && (
            <div className="space-y-4">
              {/* Work Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Work Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {workTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`worktype-${type}`}
                        checked={filters.workType.includes(type)}
                        onCheckedChange={() => toggleArrayFilter('workType', type, filters.workType)}
                      />
                      <Label htmlFor={`worktype-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posted Within */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Posted Within</Label>
                <Select 
                  value={filters.postedWithin} 
                  onValueChange={(value) => updateFilter('postedWithin', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {postedWithinOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Preferences */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="only-remote" className="text-sm font-medium">
                    Remote Only
                  </Label>
                  <Switch
                    id="only-remote"
                    checked={filters.onlyRemote}
                    onCheckedChange={(checked) => updateFilter('onlyRemote', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="only-featured" className="text-sm font-medium">
                    Featured Jobs Only
                  </Label>
                  <Switch
                    id="only-featured"
                    checked={filters.onlyFeatured}
                    onCheckedChange={(checked) => updateFilter('onlyFeatured', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="only-urgent" className="text-sm font-medium">
                    Urgent Hiring Only
                  </Label>
                  <Switch
                    id="only-urgent"
                    checked={filters.onlyUrgent}
                    onCheckedChange={(checked) => updateFilter('onlyUrgent', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="visa-sponsorship" className="text-sm font-medium">
                    Visa Sponsorship
                  </Label>
                  <Switch
                    id="visa-sponsorship"
                    checked={filters.hasVisaSponsorship}
                    onCheckedChange={(checked) => updateFilter('hasVisaSponsorship', checked)}
                  />
                </div>
              </div>

              {/* Minimum Match Score */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Minimum Match Score: {filters.minMatchScore}%
                </Label>
                <Slider
                  value={[filters.minMatchScore]}
                  onValueChange={(value) => updateFilter('minMatchScore', value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between cursor-pointer" 
               onClick={() => toggleSection('skills')}>
            <h3 className="font-semibold text-sm">Skills & Technologies</h3>
            {expandedSections.skills ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {expandedSections.skills && (
            <div className="space-y-4">
              {/* Selected Skills */}
              {filters.skills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Skills</Label>
                  <div className="flex flex-wrap gap-1">
                    {filters.skills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-red-100"
                        onClick={() => toggleArrayFilter('skills', skill, filters.skills)}
                      >
                        {skill}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Skills */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Popular Skills</Label>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {popularSkills.map(skill => (
                    <Badge 
                      key={skill}
                      variant={filters.skills.includes(skill) ? "default" : "outline"}
                      className="text-xs cursor-pointer hover:bg-blue-50"
                      onClick={() => toggleArrayFilter('skills', skill, filters.skills)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Custom Skill Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Add Custom Skill</Label>
                <div className="flex gap-2">
                  {/* <Input
                    placeholder="Enter skill name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const skill = e.currentTarget.value.trim();
                        if (!filters.skills.includes(skill)) {
                          updateFilter('skills', [...filters.skills, skill]);
                        }
                        e.currentTarget.value = '';
                      }
                    }}
                    className="text-sm"
                  /> */}
                   <Input
                    placeholder="Enter skill name"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget as HTMLInputElement;
                        const skill = input.value.trim();
                        if (skill) {
                          if (!filters.skills.includes(skill)) {
                            updateFilter('skills', [...filters.skills, skill]);
                          }
                          input.value = '';
                        }
                      }
                    }}
                    className="text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">Press Enter to add</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Benefits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between cursor-pointer" 
               onClick={() => toggleSection('benefits')}>
            <h3 className="font-semibold text-sm">Benefits & Perks</h3>
            {expandedSections.benefits ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {expandedSections.benefits && (
            <div className="space-y-4">
              {/* Selected Benefits */}
              {filters.benefits.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Benefits</Label>
                  <div className="flex flex-wrap gap-1">
                    {filters.benefits.map(benefit => (
                      <Badge 
                        key={benefit} 
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-red-100"
                        onClick={() => toggleArrayFilter('benefits', benefit, filters.benefits)}
                      >
                        {benefit}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Benefits */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Available Benefits</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {benefits.map(benefit => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={`benefit-${benefit}`}
                        checked={filters.benefits.includes(benefit)}
                        onCheckedChange={() => toggleArrayFilter('benefits', benefit, filters.benefits)}
                      />
                      <Label htmlFor={`benefit-${benefit}`} className="text-xs">
                        {benefit}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Active Filters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.query && (
                <Badge variant="outline" className="text-xs">
                  Query: "{filters.query}"
                </Badge>
              )}
              {filters.location && filters.location !== 'Any Location' && (
                <Badge variant="outline" className="text-xs">
                  Location: {filters.location}
                </Badge>
              )}
              {filters.jobType.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Type: {filters.jobType.join(', ')}
                </Badge>
              )}
              {filters.experienceLevel.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Experience: {filters.experienceLevel.length} selected
                </Badge>
              )}
              {(filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) && (
                <Badge variant="outline" className="text-xs">
                  Salary: {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
                </Badge>
              )}
              {filters.skills.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Skills: {filters.skills.length} selected
                </Badge>
              )}
              {filters.onlyRemote && (
                <Badge variant="outline" className="text-xs">
                  Remote Only
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Search Filters Skeleton
export function SearchFiltersSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
        
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}