
"use client";
import React, { useState } from "react";
import JobCard, { JobCardSkeleton } from "@/components/job-search/job-card";
import JobDetails from "@/components/job-search/job-details";
import MarketTrends from '@/components/job-search/market-trends';
import SalaryInsights from '@/components/job-search/salary-insights';

const sampleJobs = [  {
    id: "job-1",
    title: "Senior Data Analyst",
    company: "Acme Analytics",
    location: "Bangalore, India",
    type: "Full-time",
    salary: { min: 80000, max: 120000, currency: "USD", period: "year" },
    description:
      "Lead analytics initiatives, build dashboards and deliver insights to stakeholders. Experience with SQL, Python and visualization tools required.",
    requirements: ["SQL", "Python", "Looker"],
    skills: ["SQL", "Python", "Power BI", "ETL"],
    posted: "2 days ago",
    companyLogo: undefined,
    companySize: "200-500",
    experienceLevel: "Senior",
    isRemote: false,
    isUrgent: false,
    isFeatured: true,
    applicants: 36,
    matchScore: 88,
    isBookmarked: false,
    category: "Technology",
    benefits: ["Health insurance", "Stock options"],
  },
  {
    id: "job-2",
    title: "Frontend Engineer",
    company: "Pixel Labs",
    location: "Remote",
    type: "Contract",
    salary: { min: 40, max: 60, currency: "USD", period: "hour" },
    description:
      "Work on UI components and product features using React, TypeScript and TailwindCSS. Strong component design and testing experience preferred.",
    requirements: ["React", "TypeScript", "Testing"],
    skills: ["React", "TypeScript", "TailwindCSS"],
    posted: "5 days ago",
    companyLogo: undefined,
    companySize: "50-100",
    experienceLevel: "Mid",
    isRemote: true,
    isUrgent: false,
    isFeatured: false,
    applicants: 12,
    matchScore: 72,
    isBookmarked: true,
    category: "Technology",
    benefits: ["Flexible hours"],
  }, ];

export default function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState<typeof sampleJobs[0] | null>(null);

  const handleApply = (id: string) => console.log("Apply clicked:", id);
  const handleBookmark = (id: string) => console.log("Bookmark toggled:", id);
  const handleShare = (id: string) => console.log("Share:", id);

  // used by JobCard to open details view
  const handleViewDetails = (id: string) => {
    const job = sampleJobs.find((j) => j.id === id) || null;
    setSelectedJob(job);
  };

  return (
    <main className="w-full max-w-7xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Job Search</h1>
        <p className="text-sm text-gray-600">Explore matching job opportunities</p>
      </header>

      {selectedJob ? (
        <JobDetails
          job={selectedJob}
          onApply={(id) => handleApply(id)}
          onBookmark={(id) => handleBookmark(id)}
          onShare={(id) => handleShare(id)}
          onBack={() => setSelectedJob(null)}
        />
      ) : (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleJobs.length === 0 ? (
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : (
              sampleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onBookmark={handleBookmark}
                  onViewDetails={(id) => handleViewDetails(id)}
                  onShare={handleShare}
                />
              ))
            )}
          </div>
          <div className="mt-6">
          <MarketTrends className="mt-6" />
        </div>
        <div className="mt-6">
<SalaryInsights className="mt-6" />
        </div>
        </section>
      )}
    </main>
  );
}
