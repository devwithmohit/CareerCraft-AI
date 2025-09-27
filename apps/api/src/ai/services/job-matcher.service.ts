import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JobMatchDto } from '../dto/job-match.dto';
import { JobMatch } from '../interfaces/ai-response.interface';

@Injectable()
export class JobMatcherService {
  private readonly logger = new Logger(JobMatcherService.name);
  private genAI: GoogleGenerativeAI;

  // Sample job database - In production, this would be from a real job API
  private readonly jobDatabase = [
    {
      jobId: 'tech-001',
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salaryRange: '$120,000 - $160,000',
      description: 'We are seeking a Senior React Developer with 5+ years of experience in building scalable web applications. Must have expertise in React, TypeScript, Node.js, and modern frontend technologies.',
      requirements: [
        'React', 'TypeScript', 'Node.js', 'JavaScript', 'HTML/CSS', 'Git', 'Agile',
        'Redux', 'REST APIs', 'Testing', 'AWS', 'Docker'
      ],
      benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options'],
      postedDate: '2024-01-15',
      url: 'https://techcorp.com/jobs/senior-react-developer',
      industry: 'Technology',
      companySize: 'Large',
      remote: true,
      experienceLevel: 'Senior'
    },
    {
      jobId: 'fintech-002',
      title: 'Full Stack Engineer',
      company: 'FinanceFlow',
      location: 'New York, NY',
      salaryRange: '$100,000 - $140,000',
      description: 'Join our fintech team to build cutting-edge financial applications. Experience with Python, React, and financial systems preferred.',
      requirements: [
        'Python', 'React', 'Django', 'PostgreSQL', 'JavaScript', 'Git',
        'Financial APIs', 'Security', 'Microservices', 'Docker', 'Kubernetes'
      ],
      benefits: ['Health Insurance', 'Bonus', 'Learning Budget'],
      postedDate: '2024-01-20',
      url: 'https://financeflow.com/careers/full-stack-engineer',
      industry: 'Finance',
      companySize: 'Medium',
      remote: false,
      experienceLevel: 'Mid-Senior'
    },
    {
      jobId: 'startup-003',
      title: 'Frontend Developer',
      company: 'InnovateLab',
      location: 'Austin, TX',
      salaryRange: '$80,000 - $110,000',
      description: 'Early-stage startup looking for a passionate Frontend Developer to help build our MVP. Great opportunity for growth and equity.',
      requirements: [
        'JavaScript', 'React', 'Vue.js', 'HTML/CSS', 'Git', 'Responsive Design',
        'UI/UX', 'Testing', 'Webpack', 'npm'
      ],
      benefits: ['Equity', 'Flexible Hours', 'Learning Budget', 'Health Insurance'],
      postedDate: '2024-01-18',
      url: 'https://innovatelab.com/jobs/frontend-developer',
      industry: 'Technology',
      companySize: 'Startup',
      remote: true,
      experienceLevel: 'Mid-Level'
    },
    {
      jobId: 'health-004',
      title: 'Software Engineer - Healthcare',
      company: 'MedTech Solutions',
      location: 'Boston, MA',
      salaryRange: '$95,000 - $130,000',
      description: 'Help us build life-saving healthcare software. Experience with HIPAA compliance and medical systems is a plus.',
      requirements: [
        'Java', 'Spring Boot', 'React', 'PostgreSQL', 'HIPAA', 'Security',
        'Healthcare APIs', 'Microservices', 'Docker', 'Git', 'Agile'
      ],
      benefits: ['Health Insurance', 'Purpose-driven work', '401k', 'PTO'],
      postedDate: '2024-01-22',
      url: 'https://medtech.com/careers/software-engineer',
      industry: 'Healthcare',
      companySize: 'Medium',
      remote: false,
      experienceLevel: 'Mid-Level'
    },
    {
      jobId: 'ai-005',
      title: 'Machine Learning Engineer',
      company: 'AI Dynamics',
      location: 'Seattle, WA',
      salaryRange: '$130,000 - $180,000',
      description: 'Build and deploy ML models at scale. Experience with Python, TensorFlow, and cloud platforms required.',
      requirements: [
        'Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'AWS', 'Docker',
        'Kubernetes', 'Data Science', 'Statistics', 'Git', 'SQL', 'MLOps'
      ],
      benefits: ['Stock Options', 'Health Insurance', 'Research Time', 'Conference Budget'],
      postedDate: '2024-01-25',
      url: 'https://aidynamics.com/jobs/ml-engineer',
      industry: 'AI/ML',
      companySize: 'Large',
      remote: true,
      experienceLevel: 'Senior'
    },
    {
      jobId: 'ecom-006',
      title: 'Backend Developer',
      company: 'ShopSmart',
      location: 'Los Angeles, CA',
      salaryRange: '$90,000 - $125,000',
      description: 'Scale our e-commerce platform to handle millions of transactions. Node.js and microservices experience required.',
      requirements: [
        'Node.js', 'Express', 'MongoDB', 'Microservices', 'REST APIs', 'GraphQL',
        'Docker', 'Kubernetes', 'AWS', 'Git', 'Testing', 'Redis'
      ],
      benefits: ['Health Insurance', 'Employee Discount', 'Stock Options', 'Flexible PTO'],
      postedDate: '2024-01-12',
      url: 'https://shopsmart.com/careers/backend-developer',
      industry: 'E-commerce',
      companySize: 'Large',
      remote: true,
      experienceLevel: 'Mid-Level'
    }
  ];

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ai.geminiApiKey');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async findJobMatches(jobMatchDto: JobMatchDto): Promise<JobMatch[]> {
    try {
      this.logger.log('Starting job matching process...');

      // Extract skills and experience from resume
      const resumeAnalysis = await this.analyzeResumeForMatching(jobMatchDto.resumeText);
      
      // Filter jobs based on basic criteria
      let filteredJobs = this.filterJobsByPreferences(jobMatchDto);
      
      // Calculate match scores for each job
      const jobsWithScores = await Promise.all(
        filteredJobs.map(async (job) => {
          const matchScore = await this.calculateJobMatchScore(
            resumeAnalysis,
            job,
            jobMatchDto
          );
          
          const matchingSkills = this.findMatchingSkills(resumeAnalysis.skills, job.requirements);
          const missingSkills = this.findMissingSkills(resumeAnalysis.skills, job.requirements);

          return {
            jobId: job.jobId,
            title: job.title,
            company: job.company,
            location: job.location,
            salaryRange: job.salaryRange,
            matchScore,
            matchingSkills,
            missingSkills: missingSkills.slice(0, 5), // Top 5 missing skills
            description: job.description,
            url: job.url,
            postedDate: job.postedDate,
            requirements: job.requirements,
            benefits: job.benefits,
          } as JobMatch;
        })
      );

      // Sort by match score and filter by threshold
      const matchedJobs = jobsWithScores
        .filter(job => job.matchScore >= (jobMatchDto.matchThreshold || 0.7))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, jobMatchDto.limit || 20);

      this.logger.log(`Found ${matchedJobs.length} matching jobs`);
      return matchedJobs;

    } catch (error) {
      this.logger.error('Job matching failed:', error);
      throw error;
    }
  }

  private filterJobsByPreferences(jobMatchDto: JobMatchDto) {
    let jobs = [...this.jobDatabase];

    // Filter by preferred titles
    if (jobMatchDto.preferredTitles && jobMatchDto.preferredTitles.length > 0) {
      jobs = jobs.filter(job => 
        jobMatchDto.preferredTitles!.some(title => 
          job.title.toLowerCase().includes(title.toLowerCase())
        )
      );
    }

    // Filter by preferred locations
    if (jobMatchDto.preferredLocations && jobMatchDto.preferredLocations.length > 0) {
      jobs = jobs.filter(job => 
        jobMatchDto.preferredLocations!.some(location => 
          job.location.toLowerCase().includes(location.toLowerCase()) ||
          (location.toLowerCase() === 'remote' && job.remote)
        )
      );
    }

    // Filter by salary range
    if (jobMatchDto.minSalary || jobMatchDto.maxSalary) {
      jobs = jobs.filter(job => {
        const salaryMatch = job.salaryRange.match(/\$?([\d,]+)/g);
        if (salaryMatch && salaryMatch.length >= 2) {
          const minSalary = parseInt(salaryMatch[0].replace(/[$,]/g, ''));
          const maxSalary = parseInt(salaryMatch[1].replace(/[$,]/g, ''));
          
          if (jobMatchDto.minSalary && maxSalary < jobMatchDto.minSalary) return false;
          if (jobMatchDto.maxSalary && minSalary > jobMatchDto.maxSalary) return false;
        }
        return true;
      });
    }

    // Filter by experience level
    if (jobMatchDto.experienceLevel) {
      jobs = jobs.filter(job => 
        job.experienceLevel.toLowerCase().includes(jobMatchDto.experienceLevel!.toLowerCase())
      );
    }

    // Filter by remote work preference
    if (jobMatchDto.remoteWork !== undefined) {
      jobs = jobs.filter(job => job.remote === jobMatchDto.remoteWork);
    }

    // Filter by industries
    if (jobMatchDto.industries && jobMatchDto.industries.length > 0) {
      jobs = jobs.filter(job => 
        jobMatchDto.industries!.some(industry => 
          job.industry.toLowerCase().includes(industry.toLowerCase())
        )
      );
    }

    // Filter by company size
    if (jobMatchDto.companySize) {
      jobs = jobs.filter(job => 
        job.companySize.toLowerCase().includes(jobMatchDto.companySize!.toLowerCase())
      );
    }

    return jobs;
  }

  private async analyzeResumeForMatching(resumeText: string) {
    try {
      // Use AI to extract structured data from resume
      if (this.genAI) {
        const model = this.genAI.getGenerativeModel({ 
          model: this.configService.get('ai.geminiModel') 
        });

        const prompt = `
          Analyze this resume and extract structured information for job matching.
          
          Resume: ${resumeText}
          
          Return only a JSON object with:
          {
            "skills": ["skill1", "skill2", ...],
            "experience": {
              "years": number,
              "level": "Entry|Mid|Senior|Lead",
              "roles": ["role1", "role2", ...]
            },
            "education": {
              "degree": "string",
              "field": "string"
            },
            "industries": ["industry1", "industry2", ...],
            "keywords": ["keyword1", "keyword2", ...]
          }
        `;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        try {
          return JSON.parse(response.replace(/```json|```/g, ''));
        } catch {
          return this.fallbackResumeAnalysis(resumeText);
        }
      }
      
      return this.fallbackResumeAnalysis(resumeText);
    } catch (error) {
      this.logger.error('Resume analysis for matching failed:', error);
      return this.fallbackResumeAnalysis(resumeText);
    }
  }

  private async calculateJobMatchScore(
    resumeAnalysis: any,
    job: any,
    preferences: JobMatchDto
  ): Promise<number> {
    try {
      let score = 0;
      const weights = {
        skills: 0.4,
        experience: 0.2,
        title: 0.15,
        industry: 0.1,
        location: 0.1,
        requirements: 0.05
      };

      // Skills matching (40% weight)
      const skillsMatch = this.calculateSkillsMatch(resumeAnalysis.skills, job.requirements);
      score += skillsMatch * weights.skills;

      // Experience level matching (20% weight)
      const experienceMatch = this.calculateExperienceMatch(
        resumeAnalysis.experience,
        job.experienceLevel
      );
      score += experienceMatch * weights.experience;

      // Title relevance (15% weight)
      const titleMatch = this.calculateTitleMatch(resumeAnalysis.experience.roles, job.title);
      score += titleMatch * weights.title;

      // Industry match (10% weight)
      const industryMatch = this.calculateIndustryMatch(resumeAnalysis.industries, job.industry);
      score += industryMatch * weights.industry;

      // Location preference (10% weight)
      const locationMatch = this.calculateLocationMatch(preferences, job);
      score += locationMatch * weights.location;

      // Special requirements match (5% weight)
      const requirementsMatch = this.calculateRequirementsMatch(resumeAnalysis, job);
      score += requirementsMatch * weights.requirements;

      // Bonus for AI-enhanced matching
      if (this.genAI) {
        const aiBonus = await this.getAIMatchingBonus(resumeAnalysis, job);
        score += aiBonus * 0.1; // 10% bonus potential
      }

      return Math.min(1, Math.max(0, score)); // Clamp between 0 and 1

    } catch (error) {
      this.logger.error('Match score calculation failed:', error);
      return 0.5; // Default neutral score
    }
  }

  private calculateSkillsMatch(resumeSkills: string[], jobRequirements: string[]): number {
    if (!resumeSkills || !jobRequirements || jobRequirements.length === 0) return 0;

    const matches = jobRequirements.filter(requirement =>
      resumeSkills.some(skill => 
        skill.toLowerCase().includes(requirement.toLowerCase()) ||
        requirement.toLowerCase().includes(skill.toLowerCase())
      )
    );

    return matches.length / jobRequirements.length;
  }

  private calculateExperienceMatch(resumeExperience: any, jobLevel: string): number {
    if (!resumeExperience) return 0.5;

    const levelMap = {
      'Entry': 1,
      'Mid-Level': 2,
      'Mid': 2,
      'Mid-Senior': 2.5,
      'Senior': 3,
      'Lead': 4,
      'Principal': 5
    };

    const resumeLevel = levelMap[resumeExperience.level] || 2;
    const jobLevelValue = levelMap[jobLevel] || 2;

    // Perfect match = 1.0, one level off = 0.8, two levels = 0.6, etc.
    const difference = Math.abs(resumeLevel - jobLevelValue);
    return Math.max(0, 1 - (difference * 0.2));
  }

  private calculateTitleMatch(resumeRoles: string[], jobTitle: string): number {
    if (!resumeRoles || resumeRoles.length === 0) return 0;

    const titleWords = jobTitle.toLowerCase().split(/\s+/);
    let maxMatch = 0;

    resumeRoles.forEach(role => {
      const roleWords = role.toLowerCase().split(/\s+/);
      const commonWords = titleWords.filter(word => roleWords.includes(word));
      const match = commonWords.length / titleWords.length;
      maxMatch = Math.max(maxMatch, match);
    });

    return maxMatch;
  }

  private calculateIndustryMatch(resumeIndustries: string[], jobIndustry: string): number {
    if (!resumeIndustries || resumeIndustries.length === 0) return 0.5;

    return resumeIndustries.some(industry =>
      industry.toLowerCase().includes(jobIndustry.toLowerCase()) ||
      jobIndustry.toLowerCase().includes(industry.toLowerCase())
    ) ? 1 : 0;
  }

  private calculateLocationMatch(preferences: JobMatchDto, job: any): number {
    if (!preferences.preferredLocations || preferences.preferredLocations.length === 0) {
      return 1; // No preference = perfect match
    }

    return preferences.preferredLocations.some(location =>
      job.location.toLowerCase().includes(location.toLowerCase()) ||
      (location.toLowerCase() === 'remote' && job.remote)
    ) ? 1 : 0.3; // Partial credit for non-preferred locations
  }

  private calculateRequirementsMatch(resumeAnalysis: any, job: any): number {
    // Additional matching for specific requirements like certifications, tools, etc.
    let score = 0.5; // Base score

    // Check for education match
    if (resumeAnalysis.education && job.requirements.some(req => 
      req.toLowerCase().includes('degree') || req.toLowerCase().includes('bachelor')
    )) {
      score += 0.3;
    }

    // Check for certification mentions
    const certKeywords = ['certified', 'certification', 'aws', 'azure', 'google cloud'];
    if (job.requirements.some(req => 
      certKeywords.some(cert => req.toLowerCase().includes(cert))
    )) {
      if (resumeAnalysis.keywords.some(keyword =>
        certKeywords.some(cert => keyword.toLowerCase().includes(cert))
      )) {
        score += 0.2;
      }
    }

    return Math.min(1, score);
  }

  private async getAIMatchingBonus(resumeAnalysis: any, job: any): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = `
        Analyze the compatibility between this candidate and job opportunity.
        Rate the overall fit on a scale of 0.0 to 1.0 considering cultural fit,
        growth potential, and unique qualifications.

        Candidate Profile: ${JSON.stringify(resumeAnalysis)}
        Job Description: ${job.description}
        
        Return only a number between 0.0 and 1.0 representing the compatibility bonus.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      
      const bonus = parseFloat(response);
      return isNaN(bonus) ? 0 : Math.min(1, Math.max(0, bonus));
    } catch (error) {
      this.logger.error('AI matching bonus calculation failed:', error);
      return 0;
    }
  }

  private findMatchingSkills(resumeSkills: string[], jobRequirements: string[]): string[] {
    if (!resumeSkills || !jobRequirements) return [];

    return jobRequirements.filter(requirement =>
      resumeSkills.some(skill => 
        skill.toLowerCase().includes(requirement.toLowerCase()) ||
        requirement.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  private findMissingSkills(resumeSkills: string[], jobRequirements: string[]): string[] {
    if (!resumeSkills || !jobRequirements) return jobRequirements || [];

    return jobRequirements.filter(requirement =>
      !resumeSkills.some(skill => 
        skill.toLowerCase().includes(requirement.toLowerCase()) ||
        requirement.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  private fallbackResumeAnalysis(resumeText: string) {
    // Simple keyword extraction fallback
    const text = resumeText.toLowerCase();
    
    const commonTechSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git',
      'html', 'css', 'typescript', 'angular', 'vue', 'docker', 'aws',
      'mongodb', 'postgresql', 'express', 'spring', 'django', 'flask'
    ];

    const foundSkills = commonTechSkills.filter(skill => text.includes(skill));

    // Estimate experience level based on keywords
    let experienceLevel = 'Mid-Level'; // Default
    if (text.includes('senior') || text.includes('lead') || text.includes('architect')) {
      experienceLevel = 'Senior';
    } else if (text.includes('junior') || text.includes('entry') || text.includes('graduate')) {
      experienceLevel = 'Entry';
    }

    return {
      skills: foundSkills,
      experience: {
        years: 3, // Default assumption
        level: experienceLevel,
        roles: ['Developer', 'Engineer'] // Generic roles
      },
      education: {
        degree: 'Bachelor',
        field: 'Computer Science'
      },
      industries: ['Technology'],
      keywords: foundSkills
    };
  }

  // Method to get job statistics
  async getJobMatchingStats(): Promise<any> {
    return {
      totalJobs: this.jobDatabase.length,
      jobsByIndustry: this.getJobsByIndustry(),
      jobsByLocation: this.getJobsByLocation(),
      jobsByExperienceLevel: this.getJobsByExperienceLevel(),
      averageSalaryRanges: this.getAverageSalaryRanges(),
      remoteJobsCount: this.jobDatabase.filter(job => job.remote).length,
    };
  }

  private getJobsByIndustry() {
    const industries = {};
    this.jobDatabase.forEach(job => {
      industries[job.industry] = (industries[job.industry] || 0) + 1;
    });
    return industries;
  }

  private getJobsByLocation() {
    const locations = {};
    this.jobDatabase.forEach(job => {
      const city = job.location.split(',')[0].trim();
      locations[city] = (locations[city] || 0) + 1;
    });
    return locations;
  }

  private getJobsByExperienceLevel() {
    const levels = {};
    this.jobDatabase.forEach(job => {
      levels[job.experienceLevel] = (levels[job.experienceLevel] || 0) + 1;
    });
    return levels;
  }

  private getAverageSalaryRanges() {
    const salaries = this.jobDatabase.map(job => {
      const match = job.salaryRange.match(/\$?([\d,]+)/g);
      if (match && match.length >= 2) {
        const min = parseInt(match[0].replace(/[$,]/g, ''));
        const max = parseInt(match[1].replace(/[$,]/g, ''));
        return { min, max, avg: (min + max) / 2 };
      }
      return null;
    }).filter(Boolean);

    const avgMin = salaries.reduce((sum, s) => sum + s.min, 0) / salaries.length;
    const avgMax = salaries.reduce((sum, s) => sum + s.max, 0) / salaries.length;
    const avgOverall = salaries.reduce((sum, s) => sum + s.avg, 0) / salaries.length;

    return {
      averageMin: Math.round(avgMin),
      averageMax: Math.round(avgMax),
      averageOverall: Math.round(avgOverall)
    };
  }
}