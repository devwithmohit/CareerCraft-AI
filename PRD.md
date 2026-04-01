# Project Blueprint: CareerCraft AI

## Project Name & Summary

**Project Name:** CareerCraft AI

**One-Sentence Summary:** CareerCraft AI is an AI-powered career development platform that helps job seekers optimize resumes, track applications, prepare for interviews, and find relevant job opportunities through intelligent matching.

**Elevator Pitch:** CareerCraft AI transforms the job search process by combining AI-driven resume analysis, intelligent job matching, application tracking, and interview preparation into a unified platform. Job seekers can create ATS-optimized resumes, receive personalized improvement suggestions, track their applications with timeline management, practice mock interviews with AI feedback, and generate tailored cover letters—all powered by advanced language models including Gemini, DeepSeek, and OpenAI.

---

## Core Value Proposition

CareerCraft AI solves the following critical problems for job seekers:

1. **Resume Optimization Gap:** Most resumes fail ATS (Applicant Tracking System) screening due to poor formatting, missing keywords, or weak content. CareerCraft AI provides real-time ATS scoring and AI-generated improvement suggestions.

2. **Fragmented Job Search Tools:** Job seekers typically use multiple disconnected tools for resume building, application tracking, and interview prep. CareerCraft AI consolidates these workflows into a single platform.

3. **Generic Application Approach:** Applicants often submit identical resumes for every position. The platform enables personalized, job-specific resume tailoring and cover letter generation.

4. **Lack of Interview Preparation:** Candidates struggle with interview anxiety and unpreparedness. AI-powered mock interviews provide realistic practice with actionable feedback.

5. **Application Disorganization:** Job seekers lose track of applications, follow-ups, and deadlines. The built-in application tracker with timeline events and reminders keeps everything organized.

---

## Target Audience

### Primary Users:
- **Active Job Seekers:** Professionals actively searching for new employment opportunities across all experience levels (entry-level to executive)
- **Career Changers:** Individuals transitioning to new industries who need help translating existing skills and optimizing their materials
- **Recent Graduates:** Students and new graduates entering the job market with limited resume-writing experience
- **Tech Professionals:** Software developers, engineers, and IT professionals seeking roles in competitive tech markets

### Secondary Users:
- **Career Coaches:** Professionals who assist clients with job search strategies and can use the platform as a coaching tool
- **University Career Centers:** Educational institutions providing career services to students and alumni

---

## Functional Scope

### Must-Have Features (Core Launch Requirements)

#### 1. Authentication & User Management
- Kinde OAuth integration for social login (Google, GitHub, etc.)
- Email/password registration and login as fallback
- JWT-based session management with token refresh
- User profile management (name, email, avatar, role)
- Role-based access control (USER, ADMIN)

#### 2. Resume Builder
- Multi-template resume editor (Classic, Modern, ATS-Optimized, Creative)
- Section-based editing: Personal Info, Summary, Experience, Education, Skills, Projects, Certifications
- Rich text editing with Tiptap editor integration
- Real-time preview with zoom controls
- Auto-save functionality with undo/redo history
- Resume duplication for creating variations
- Template switching without data loss

#### 3. AI Resume Analysis
- PDF resume upload and parsing (using pdf-parse, tesseract-ocr)
- ATS compatibility scoring (0-100 scale)
- Keyword extraction and matching against job descriptions
- Missing keyword identification
- Structural completeness analysis
- Prioritized improvement suggestions by category (content, keywords, formatting)
- AI-powered section enhancement recommendations

#### 4. AI Content Generation
- Cover letter generation from resume + job description
- Resume section content generation (experience bullets, summaries, skills)
- Section improvement suggestions with target role context
- Keyword optimization for specific job postings
- Tone adjustment for different industries

#### 5. Application Tracker
- Create, read, update, delete job applications
- Application status workflow: APPLIED → INTERVIEWING → OFFERED → REJECTED/ACCEPTED
- Company and position tracking
- Application date tracking
- Timeline event logging (interviews, follow-ups, decisions)
- Reminder system for follow-ups with completion tracking
- Contact management per application (recruiters, hiring managers)
- Filterable and searchable application list
- Analytics dashboard (applications by status, success rate)

#### 6. Job Search & Matching
- Save job listings manually (title, company, URL, description, salary, location)
- AI-powered job matching based on resume skills
- Match score calculation with skill gap analysis
- Salary insights by role and location
- Market trends data visualization
- Search and filter saved jobs

#### 7. Interview Preparation
- Mock interview session creation by type (behavioral, technical, system design)
- Role-specific question bank generation
- STAR method trainer for structured responses
- Video practice recording capability
- AI feedback on responses with improvement areas
- Session history and progress tracking
- Question categorization and difficulty levels

#### 8. Dashboard & Analytics
- User activity summary (resumes created, applications submitted, interviews practiced)
- Application pipeline visualization
- ATS score trends over time
- Quick action shortcuts
- Recent activity feed
- Progress metrics toward job search goals

#### 9. Subscription & Payments
- Stripe integration for payment processing
- Three-tier subscription model: FREE, PRO, PREMIUM
- Webhook handling for subscription events (created, canceled, renewed)
- Feature gating based on subscription tier
- Subscription management (cancel, resume)
- Admin view of all subscriptions

#### 10. Export Functionality
- PDF export with template fidelity (using @react-pdf/renderer, puppeteer)
- DOCX export capability
- Download with proper filename from headers
- Export progress indication

---

### Future Considerations (Nice-to-Have / Post-Launch)

1. **Job Board Integration:** Direct API integrations with LinkedIn, Indeed, Glassdoor for automated job importing
2. **Collaborative Editing:** Real-time multi-user resume editing using Yjs websockets
3. **Chrome Extension:** One-click job saving from any job board website
4. **Email Notifications:** Automated reminders for application follow-ups and interview prep
5. **Mobile App:** React Native mobile application for on-the-go access
6. **Portfolio Builder:** Extended profile with project showcases and work samples
7. **Salary Negotiation Coach:** AI-guided negotiation strategies and scripts
8. **Company Research Database:** Integrated company profiles with culture insights
9. **Referral Network:** Connection feature for requesting employee referrals
10. **Interview Scheduler:** Calendar integration for scheduling actual interviews
11. **Multi-language Support:** Resume and cover letter generation in multiple languages
12. **Custom Template Designer:** Drag-and-drop template builder for advanced users

---

### Out-of-Scope (Explicitly Not Building in This Phase)

1. **Direct Job Posting:** CareerCraft AI does not host job listings from employers (not a job board)
2. **Employer/E recruiter Accounts:** No separate portal for hiring companies to access candidate profiles
3. **Background Checks:** No integration with background verification services
4. **Visa/Immigration Services:** No legal guidance on work authorization or visa sponsorship
5. **Salary Escrow/Payroll:** No payment processing between employers and employees
6. **Video Hosting Infrastructure:** Video practice uses local storage; no cloud video hosting at scale
7. **AI Model Training:** Using pre-trained models only; no custom model training pipelines
8. **On-Premise Deployment:** Cloud-only SaaS delivery; no self-hosted enterprise option
9. **White-Label Solution:** No reseller or white-label licensing in initial phase
10. **Blockchain/Crypto Integrations:** No decentralized identity or credential verification

---

## Current State vs. Intended State

### Identified Discrepancies

Based on codebase analysis, the following gaps exist between current implementation and intended functionality:

| Feature Area | Current State | Intended State | Priority |
|--------------|---------------|----------------|----------|
| **Resume CRUD Operations** | Controller endpoints exist (`POST`, `GET`, `PATCH`, `DELETE`) but frontend store uses mock `/api/resumes` paths instead of actual backend URLs | Full end-to-end resume creation, editing, and deletion with database persistence | Critical |
| **Application Tracker Write Operations** | Backend fully implements create/update/delete with timeline events and reminders; frontend components exist but may not be connected | Users can add, edit, and manage applications with full timeline and reminder functionality | Critical |
| **AI Resume Analysis** | Service layer implemented with Gemini/DeepSeek/OpenAI integration; controller accepts file uploads; frontend has analysis UI | Upload resume PDF, receive ATS score, keyword analysis, and improvement suggestions within seconds | Critical |
| **Cover Letter Generation** | Backend service and controller ready; DTO defined; frontend page exists at `/cover-letters` | Generate personalized cover letters from resume + job description input | High |
| **Job Matching** | Backend matching service exists; frontend job-search page present; salary insights component built | AI matches user resume to job requirements with match scores and skill gap analysis | High |
| **Mock Interviews** | Interview module with session creation, question bank, and feedback endpoints; frontend components built | Start mock interview sessions, record responses, receive AI feedback using STAR method | High |
| **Authentication Flow** | Dual auth implemented (Kinde OAuth + email/password); JWT guards in place; frontend auth pages exist | Seamless login/signup with persistent sessions and proper token refresh | Critical |
| **Subscription Gating** | Stripe webhook handler, subscription entity, and role guards implemented; pricing page exists | Enforce feature limits based on subscription tier (FREE vs PRO vs PREMIUM) | Medium |
| **PDF Export** | Export service with puppeteer and @react-pdf/renderer; download endpoint defined | One-click PDF download preserving template formatting | High |
| **Dashboard Analytics** | Summary endpoint returns aggregated stats; frontend dashboard components built | Display real-time metrics on applications, resume scores, and activity | Medium |
| **Admin Features** | Role-based guards exist; admin-only subscription list endpoint | Admin dashboard for user management and subscription oversight | Low |

### Specific Read-Only Issues to Address

The user reported the app is "essentially read-only." Based on code review, the backend supports full CRUD operations. The likely issues are:

1. **API Base URL Misconfiguration:** Frontend `api-client.ts` defaults to `http://localhost:3001`; environment variable `NEXT_PUBLIC_API_URL` must be set correctly
2. **Authentication Token Not Attached:** JWT tokens stored in localStorage but may not be properly attached to requests if auth flow is broken
3. **Frontend Store Mock Paths:** `resume-store.ts` uses hardcoded `/api/resumes` instead of configurable API client base URL
4. **CORS Configuration:** Backend CORS settings may block frontend requests if origins not properly configured
5. **Database Connection:** Prisma client requires valid `DATABASE_URL`; connection failures would cause silent write operation failures
6. **Form Submission Handlers:** Some form components may have `disabled` states tied to validation that never passes

---

## Success Metrics

### Key Performance Indicators (KPIs)

#### User Engagement
- **Weekly Active Users (WAU):** Target: 500+ WAU within 3 months of launch
- **Session Duration:** Average session > 8 minutes indicating meaningful engagement
- **Feature Adoption Rate:** >60% of users utilize at least 3 core features (resume builder, analysis, applications)

#### Conversion Metrics
- **Free-to-Paid Conversion:** Target: 5-8% conversion rate from FREE to PRO/PREMIUM tiers
- **Resume Completion Rate:** >70% of started resumes are completed and saved
- **Application Tracker Activation:** >50% of users log at least 3 job applications

#### Quality Metrics
- **ATS Score Improvement:** Users achieve average 15+ point ATS score increase after AI suggestions
- **User Retention:** >40% Week-1 retention; >20% Month-1 retention
- **Net Promoter Score (NPS):** Target NPS > 30 within first 6 months

#### Technical Performance
- **API Response Time:** P95 latency < 500ms for standard endpoints; < 5s for AI operations
- **Page Load Time:** Largest Contentful Paint (LCP) < 2.5s on desktop, < 4s on mobile
- **Error Rate:** < 0.5% of API requests result in 5xx errors
- **Uptime:** 99.5% availability SLA

#### Business Metrics
- **Monthly Recurring Revenue (MRR):** Target: $10,000 MRR within 6 months
- **Customer Acquisition Cost (CAC):** Keep CAC < $30 through organic and content marketing
- **Lifetime Value (LTV):** Target LTV > $150 (assuming 12-month average subscription)
- **Churn Rate:** < 5% monthly churn for paid subscribers

---

## Constraints

### Technical Constraints

1. **Monorepo Architecture:** Turborepo monorepo structure requires coordinated builds across `apps/web`, `apps/api`, and shared packages
2. **Node.js Version Requirement:** Requires Node.js >= 18 as specified in package.json engines
3. **PostgreSQL Database:** Prisma ORM configured for PostgreSQL only; no SQLite/MySQL support without schema changes
4. **Third-Party API Dependencies:**
   - Kinde for authentication (OAuth provider required)
   - Stripe for payments (merchant account required)
   - AI providers (Gemini, DeepSeek, OpenAI) require valid API keys with rate limits
5. **Browser Compatibility:** Next.js 15 with React 19 requires modern browsers; no IE11 support
6. **File Upload Limits:** Multer configuration needed for resume PDF uploads (default size limits apply)
7. **Puppeteer Dependencies:** PDF export requires headless Chrome; deployment environment must support Chromium binaries

### Business Constraints

1. **AI API Costs:** Each resume analysis and content generation consumes API tokens; free tier users subsidized by paid subscribers
2. **Stripe Fees:** 2.9% + $0.30 per transaction reduces net revenue margin
3. **Competition:** Established competitors (Jobscan, Resume.io, Kickresume) with larger marketing budgets
4. **Time-to-Market:** Pressure to launch quickly may result in technical debt accumulation

### Timeline Constraints

1. **MVP Launch Target:** All "Must-Have" features must be functional before public launch
2. **Beta Testing Period:** Minimum 2-week closed beta recommended before public release
3. **Investor Demonstrations:** Functional demo required for potential funding discussions

### Budget Constraints

1. **Infrastructure Costs:** Monthly expenses for hosting (Vercel/railway), database (Neon/Supabase), and external APIs
2. **Marketing Budget:** Limited initial marketing spend; reliance on organic growth and content marketing
3. **Team Size:** Assumed small team (1-3 developers) based on codebase patterns; limits parallel development velocity

### Team & Resource Constraints

1. **Single Codebase Owner Risk:** Heavy reliance on AI-assisted development without documentation creates knowledge concentration risk
2. **No Dedicated QA:** Testing strategy relies on manual testing; automated test coverage appears minimal
3. **Limited DevOps Expertise:** Deployment automation and monitoring may be underdeveloped

---

## Appendix: Technology Stack Reference

*(Note: Detailed tech stack specifications will be documented in the separate Tech Stack Spec document)*

### Frontend
- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19 with TypeScript
- **State Management:** Zustand for client state, TanStack Query for server state
- **Component Library:** Radix UI primitives with Tailwind CSS 4
- **Styling:** Tailwind CSS 4 with shadcn/ui patterns
- **Charts:** Chart.js, Recharts, Plotly.js
- **Rich Text:** Tiptap editor
- **Drag & Drop:** dnd-kit

### Backend
- **Framework:** NestJS 11 with TypeScript
- **Database ORM:** Prisma 6
- **Database:** PostgreSQL
- **Authentication:** Kinde OAuth + JWT with Passport strategies
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger/OpenAPI

### AI/ML
- **Providers:** Google Generative AI (Gemini), DeepSeek, OpenAI
- **Use Cases:** Resume analysis, content generation, job matching, interview feedback

### Infrastructure
- **Monorepo Tool:** Turborepo
- **Package Manager:** pnpm
- **Payment Processing:** Stripe
- **Deployment:** Not yet configured (TBD)

---

## Document Governance

- **Version:** 1.0
- **Last Updated:** [Current Date]
- **Owner:** Senior Technical Product Manager
- **Review Cycle:** This document should be reviewed and updated at the start of each major development sprint or when scope changes occur
- **Distribution:** All development team members, stakeholders, and AI assistants must reference this document before making architectural or feature decisions

---

**FINAL RULE FOR AI SESSIONS:** This Project Blueprint serves as the single source of truth for project scope and requirements. Never start a new AI development session without re-pasting this document (along with other relevant Tier 1 documents). These documents are your memory between sessions. Any feature request not explicitly listed in "Must-Have Features" or "Future Considerations" should be flagged as potentially out-of-scope and requires stakeholder approval before implementation.
