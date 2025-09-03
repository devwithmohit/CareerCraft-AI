"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Heart, 
  Share, 
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Eye,
  Users,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobCardProps {
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
    skills: string[];
    posted: string; // e.g., "2 days ago"
    companyLogo?: string;
    companySize?: string;
    experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
    isRemote: boolean;
    isUrgent?: boolean;
    isFeatured?: boolean;
    applicants?: number;
    matchScore?: number; // 0-100
    isBookmarked?: boolean;
    category: string;
    benefits?: string[];
  };
  onApply?: (jobId: string) => void;
  onBookmark?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  onShare?: (jobId: string) => void;
  className?: string;
}

export default function JobCard({ 
  job, 
  onApply, 
  onBookmark, 
  onViewDetails, 
  onShare,
  className 
}: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(job.id);
  };

  // const formatSalary = () => {
  //   const { min, max, currency, period } = job.salary;
  //   const symbol = currency === 'USD' ? '$' : currency;
  //   const periodText = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';
    
  //   if (min === max) {
  //     return `${symbol}${min.toLocaleString()}${periodText}`;
  //   }
  //   return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}${periodText}`;
  // };
  const numberFormatter = new Intl.NumberFormat('en-US');
  const formatNumber = (n: number) => numberFormatter.format(n);

  const formatSalary = () => {
    const { min, max, currency, period } = job.salary;
    const symbol = currency === 'USD' ? '$' : currency;
    const periodText = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';

    if (min === max) {
      return `${symbol}${formatNumber(min)}${periodText}`;
    }
    return `${symbol}${formatNumber(min)} - ${symbol}${formatNumber(max)}${periodText}`;
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
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-md group cursor-pointer",
      job.isFeatured && "ring-2 ring-blue-500 shadow-lg",
      job.isUrgent && "ring-2 ring-red-500",
      className
    )}>
      {/* Featured/Urgent Badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {job.isFeatured && (
          <Badge className="bg-blue-500 text-white text-xs">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {job.isUrgent && (
          <Badge className="bg-red-500 text-white text-xs">
            Urgent
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Building className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium">{job.company}</p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark();
                  }}
                  className="h-8 w-8 p-0"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(job.id);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Location & Type */}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
                {job.isRemote && (
                  <Badge variant="outline" className="text-xs ml-1">Remote</Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.posted}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Salary & Job Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary()}</span>
          </div>
          <Badge className={getTypeColor(job.type)}>
            {job.type}
          </Badge>
        </div>

        {/* Match Score & Stats */}
        {(job.matchScore || job.applicants) && (
          <div className="flex items-center justify-between text-sm">
            {job.matchScore && (
              <div className={cn("flex items-center gap-1", getMatchScoreColor(job.matchScore))}>
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">{job.matchScore}% match</span>
              </div>
            )}
            {job.applicants && (
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-4 h-4" />
                <span>{job.applicants} applicants</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="text-sm text-gray-700">
          <p className={cn(
            "leading-relaxed",
            !isExpanded && "line-clamp-2"
          )}>
            {job.description}
          </p>
          {job.description.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>

        {/* Benefits Preview */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span className="truncate">
              {job.benefits.slice(0, 2).join(', ')}
              {job.benefits.length > 2 && ` +${job.benefits.length - 2} more`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(job.id);
            }}
            className="flex-1"
          >
            Apply Now
          </Button>
          <Button 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(job.id);
            }}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </div>

        {/* Company Info Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-2">
            <span>{job.experienceLevel} level</span>
            {job.companySize && (
              <>
                <span>•</span>
                <span>{job.companySize}</span>
              </>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {job.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Job Card Skeleton for loading states
export function JobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-6 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-12 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-18" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded flex-1" />
          <div className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </CardContent>
    </Card>
  );
}