import { title } from "process";

export const APP_CONFIG = {
  name: "CareerCraft AI",
  description:
    "AI-powered resume optimization, job matching, and career intelligence platform",
  url: "https://careercraft.ai",
  version: "1.0.0",
  author: "CareerCraft Team",
  keywords: ["resume", "AI", "career", "jobs", "ATS", "optimization"],
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
  },
  resume: {
    upload: "/api/resume/upload",
    analyze: "/api/resume/analyze",
    optimize: "/api/resume/optimize",
    templates: "/api/resume/templates",
  },
  jobs: {
    search: "/api/jobs/search",
    match: "/api/jobs/match",
    apply: "/api/jobs/apply",
    track: "/api/jobs/track",
  },
  user: {
    profile: "/api/user/profile",
    preferences: "/api/user/preferences",
    subscription: "/api/user/subscription",
  },
} as const;

export const NAVIGATION_LINKS = [
  {
    title: "Resume Analysis",
    href: "/resume-analysis",
    description: "Get AI-powered feedback on your resume",
  },
  {
    title: "Job Search",
    href: "/job-search",
    description: "Find jobs that match your skills",
  },
  {
    title: "Interview Prep",
    href: "/interview-prep",
    description: "Practice with AI mock interviews",
  },
  {
    title: "Templates",
    href: "/templates",
    description: "Professional resume templates",
  },
] as const;
//  footer links

export const FOOTER_LINKS = {
  product: [
    { title: "Resume Analysis", href: "/resume-analysis" },
    { title: "Job Matching", href: "/job-search" },
    { title: "Interview Prep", href: "/interview-prep" },
    { title: "Templates", href: "/templates" },
    { title: "Pricing", href: "/pricing" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Blog", href: "/blog" },
    { title: "Press", href: "/press" },
    { title: "Contact", href: "/contact" },
  ],
  resources: [
    { title: "Help Center", href: "/help" },
    { title: "Documentation", href: "/docs" },
    { title: "API Reference", href: "/api-docs" },
    { title: "Community", href: "/community" },
    { title: "Status", href: "/status" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" },
    { title: "GDPR", href: "/gdpr" },
  ],
} as const;
// Social Media Links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/careercraft_ai",
  linkedin: "https://linkedin.com/company/careercraft-ai",
  github: "https://github.com/careercraft-ai",
  youtube: "https://youtube.com/@careercraft-ai",
  instagram: "https://instagram.com/careercraft.ai",
  facebook: "https://facebook.com/careercraft.ai",
} as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: " FREE",
    price: 0,
    interval: "forever",
    description: "Perfect for getting started",
    features: [
      "1 Resume Analysis per month",
      "Basic ATS scoring",
      "Standard templates",
      "Email support",
    ],
    limitations: [
      "Limited analyses",
      "Basic features only",
      "Standard support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    interval: "month",
    description: "Best for active job seekers",
    features: [
      "Unlimited resume analysis",
      "Advanced AI suggestions",
      "Premium templates",
      "Job matching alerts",
      "Interview prep tools",
      "Cover letter generator",
      "Application tracker",
      "Priority support",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    interval: "custom",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Dedicated support",
      "Analytics dashboard",
      "White-label options",
      "Custom AI training",
      "SLA guarantee",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
] as const;
  
// Feature Categories
export const FEATURE_CATEGORIES = {
  analysis: {
    title: "Resume Analysis",
    description: "AI-powered resume optimization",
    icon: "brain",
    features: [
      "ATS compatibility scoring",
      "Keyword optimization",
      "Industry-specific feedback",
      "Real-time improvements"
    ]
  },
  matching: {
    title: "Job Matching",
    description: "Intelligent job recommendations",
    icon: "target",
    features: [
      "Personalized job alerts",
      "Skill gap analysis",
      "Salary insights",
      "Company culture fit"
    ]
  },
  preparation: {
    title: "Interview Prep",
    description: "AI mock interviews and coaching",
    icon: "message-square",
    features: [
      "Industry-specific questions",
      "Real-time feedback",
      "STAR method coaching",
      "Confidence building"
    ]
  },
  tracking: {
    title: "Application Tracking",
    description: "Organize your job search",
    icon: "bar-chart",
    features: [
      "Application pipeline",
      "Follow-up reminders",
      "Interview scheduling",
      "Progress analytics"
    ]
  }
} as const
// Industries Supported
export const SUPPORTED_INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Marketing",
  "Engineering",
  "Sales",
  "Education",
  "Consulting",
  "Legal",
  "Design",
  "Operations",
  "HR",
  "Customer Service",
  "Manufacturing",
  "Retail",
  "Media",
  "Real Estate",
  "Non-Profit",
  "Government",
  "Hospitality",
] as const;

//  file upload configurations

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10mb
  allowedFileTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ],
  allowedExtension: [".pdf", ".doc", ".docx", ".txt"],
}as const 

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8"
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      500: "#64748b",
      600: "#475569",
      700: "#334155"
    }
  },
  gradients: {
    primary: "from-blue-600 to-purple-600",
    secondary: "from-gray-100 to-gray-200",
    hero: "from-blue-50 via-white to-purple-50"
  }
} as const

//  Email templates 

export const EMAIL_TEMPLATES = {
     welcome : "welcome",
     passwordReset: " password-reset",
     jobAlert: "job-alert",
  resumeFeedback: "resume-feedback",
  interviewReminder: "interview-reminder"
} as const

export const ANALYTICS_EVENTS = {
  // User Actions
  RESUME_UPLOADED: "resume_uploaded",
  RESUME_ANALYZED: "resume_analyzed",
  JOB_SEARCHED: "job_searched",
  INTERVIEW_STARTED: "interview_started",
  
  // Conversions
  SIGNUP_COMPLETED: "signup_completed",
  SUBSCRIPTION_STARTED: "subscription_started",
  TRIAL_STARTED: "trial_started",
  
  // Engagement
  PAGE_VIEWED: "page_viewed",
  FEATURE_USED: "feature_used",
  HELP_ACCESSED: "help_accessed"
} as const

// Error Messages
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: "Failed to upload file. Please try again.",
  ANALYSIS_FAILED: "Analysis failed. Please check your file and try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to access this feature.",
  SUBSCRIPTION_REQUIRED: "This feature requires a Pro subscription.",
  FILE_TOO_LARGE: "File size exceeds the 10MB limit.",
  INVALID_FILE_TYPE: "Please upload a PDF, DOC, DOCX, or TXT file."
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: "File uploaded successfully!",
  ANALYSIS_COMPLETE: "Resume analysis completed!",
  PROFILE_UPDATED: "Profile updated successfully!",
  SUBSCRIPTION_ACTIVE: "Subscription activated successfully!",
  EMAIL_VERIFIED: "Email verified successfully!"
} as const


// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "careercraft_user_preferences",
  RESUME_DRAFTS: "careercraft_resume_drafts",
  JOB_SEARCHES: "careercraft_job_searches",
  INTERVIEW_PREP: "careercraft_interview_prep",
  THEME: "careercraft_theme"
} as const


// Feature Flags
export const FEATURE_FLAGS = {
  AI_INTERVIEW_COACH: true,
  ADVANCED_ANALYTICS: true,
  TEAM_COLLABORATION: false,
  API_ACCESS: false,
  CUSTOM_BRANDING: false
} as const


// Rate Limits
export const RATE_LIMITS = {
  RESUME_ANALYSIS: {
    FREE: 1, // per month
    PRO: -1, // unlimited
    ENTERPRISE: -1 // unlimited
  },
  JOB_SEARCHES: {
    FREE: 10, // per day
    PRO: 100, // per day
    ENTERPRISE: -1 // unlimited
  },
  API_REQUESTS: {
    FREE: 100, // per day
    PRO: 1000, // per day
    ENTERPRISE: 10000 // per day
  }
} as const

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  NAVIGATION_LINKS,
  FOOTER_LINKS,
  SOCIAL_LINKS,
  PRICING_PLANS,
  FEATURE_CATEGORIES,
  SUPPORTED_INDUSTRIES,
  UPLOAD_CONFIG,
  THEME_CONFIG,
  EMAIL_TEMPLATES,
  ANALYTICS_EVENTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  FEATURE_FLAGS,
  RATE_LIMITS
}