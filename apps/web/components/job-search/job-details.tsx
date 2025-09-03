"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  Calendar,
  CheckCircle,
  Star,
  Share,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowLeft,
  Heart,
  Shield,
  TrendingUp,
  Award,
  Globe,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Target,
  AlertTriangle,
  Info,
  ChevronRight,
  FileText,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobDetailsProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
    salary: {
      min: number;
      max: number;
      currency: string;
      period: 'hour' | 'month' | 'year';
    };
    description: string;
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    posted: string;
    deadline?: string;
    companyLogo?: string;
    companySize?: string;
    companyWebsite?: string;
    companyDescription?: string;
    experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
    isRemote: boolean;
    isUrgent?: boolean;
    isFeatured?: boolean;
    applicants?: number;
    matchScore?: number;
    isBookmarked?: boolean;
    category: string;
    benefits?: string[];
    workType?: 'Office' | 'Remote' | 'Hybrid';
    industry: string;
    department?: string;
    reportingTo?: string;
    teamSize?: number;
    growth?: string;
    culture?: string[];
    techStack?: string[];
    perks?: string[];
    applicationProcess?: string[];
    contactPerson?: {
      name: string;
      role: string;
      email?: string;
      phone?: string;
    };
  };
  onApply?: (jobId: string) => void;
  onBookmark?: (jobId: string) => void;
  onShare?: (jobId: string) => void;
  onBack?: () => void;
  className?: string;
}

export default function JobDetails({ 
  job, 
  onApply, 
  onBookmark, 
  onShare, 
  onBack,
  className 
}: JobDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(job.id);
  };

  const formatSalary = () => {
    const { min, max, currency, period } = job.salary;
    const symbol = currency === 'USD' ? '$' : currency;
    const periodText = period === 'year' ? '/year' : period === 'month' ? '/month' : '/hour';
    
    if (min === max) {
      return `${symbol}${min.toLocaleString()} ${periodText}`;
    }
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} ${periodText}`;
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Part-time': 'bg-purple-100 text-purple-800',
      'Contract': 'bg-orange-100 text-orange-800',
      'Freelance': 'bg-green-100 text-green-800',
      'Internship': 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className={cn(isBookmarked && "bg-blue-50 border-blue-200")}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 mr-2 text-blue-600" />
            ) : (
              <Bookmark className="w-4 h-4 mr-2" />
            )}
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onShare?.(job.id)}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Job Header Card */}
      <Card className={cn(
        job.isFeatured && "ring-2 ring-blue-500",
        job.isUrgent && "ring-2 ring-red-500"
      )}>
        <CardHeader>
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={`${job.company} logo`}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <Building className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xl font-semibold text-gray-700">{job.company}</h2>
                    {job.companyWebsite && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  {/* Key Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-green-600">{formatSalary()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-2">
                  {job.isFeatured && (
                    <Badge className="bg-blue-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {job.isUrgent && (
                    <Badge className="bg-red-500 text-white">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  {job.matchScore && (
                    <Badge variant="outline" className={getMatchScoreColor(job.matchScore)}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {job.matchScore}% Match
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {job.applicants && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{job.applicants} applicants</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{job.experienceLevel} level</span>
              </div>
              {job.companySize && (
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{job.companySize} employees</span>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {job.deadline}</span>
                </div>
              )}
            </div>

            <Button 
              size="lg"
              onClick={() => onApply?.(job.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Key Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Key Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Skills Required */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              {job.techStack && job.techStack.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Tech Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.techStack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>

                  {job.applicationProcess && job.applicationProcess.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Application Process</h4>
                      <div className="space-y-2">
                        {job.applicationProcess.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    About {job.company}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.companyDescription && (
                    <p className="text-gray-700 leading-relaxed">
                      {job.companyDescription}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>Company Size: {job.companySize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>Industry: {job.industry}</span>
                      </div>
                      {job.department && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span>Department: {job.department}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {job.teamSize && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Team Size: {job.teamSize}</span>
                        </div>
                      )}
                      {job.reportingTo && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-500" />
                          <span>Reports to: {job.reportingTo}</span>
                        </div>
                      )}
                      {job.growth && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span>Growth: {job.growth}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {job.culture && job.culture.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Company Culture</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.culture.map((value, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Benefits & Perks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.benefits && job.benefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Benefits</h4>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.perks && job.perks.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Additional Perks</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {job.perks.map((perk, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-gray-700">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Apply */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Apply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => onApply?.(job.id)}
              >
                <Send className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
              
              {job.matchScore && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Profile Match</div>
                  <Progress value={job.matchScore} className="h-2" />
                  <div className={cn("text-sm font-medium mt-1", getMatchScoreColor(job.matchScore))}>
                    {job.matchScore}% Match
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          {job.contactPerson && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium">{job.contactPerson.name}</div>
                  <div className="text-sm text-gray-600">{job.contactPerson.role}</div>
                </div>
                {job.contactPerson.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${job.contactPerson.email}`} className="text-blue-600 hover:underline">
                      {job.contactPerson.email}
                    </a>
                  </div>
                )}
                {job.contactPerson.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${job.contactPerson.phone}`} className="text-blue-600 hover:underline">
                      {job.contactPerson.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Job Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience Level</span>
                <span className="font-medium">{job.experienceLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Work Type</span>
                <span className="font-medium">{job.workType || (job.isRemote ? 'Remote' : 'Office')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{job.category}</span>
              </div>
              {job.applicants && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Applicants</span>
                  <span className="font-medium">{job.applicants}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 text-center py-4">
                Similar jobs will be shown here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Job Details Skeleton
export function JobDetailsSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-32 bg-gray-200 rounded" />
        <div className="flex-1" />
        <div className="h-10 w-20 bg-gray-200 rounded" />
        <div className="h-10 w-20 bg-gray-200 rounded" />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-12 bg-gray-200 rounded" />
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}