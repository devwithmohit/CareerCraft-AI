"use client";
import { useState } from "react";
import TemplateSelector from "@/components/resume/builder/template-selector";
import ResumePreview from "@/components/resume/builder/preview";
import ResumeToolbar from "@/components/resume/builder/toolbar";
import ResumeEditor from "@/components/resume/builder/editor";
import ExperienceSection from "@/components/resume/builder/sections/experience";
import PersonalInfoSection from "@/components/resume/builder/sections/personal-info"
// Import formatting types from toolbar
interface FormattingOptions {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textAlign: "left" | "center" | "right";
  bulletStyle: "disc" | "square" | "circle";
  spacing: number;
}

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

// Resume data interface (matching your editor.tsx)
interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    title: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements?: string[];
    technologies?: string[];
    teamSize?: number;
    salary?: string;
    workType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
    remote?: boolean;
  }[];
  education: any[];
  skills: string[];
  certifications: any[];
}

export default function ResumeBuilderPage() {
  // State for formatting options
  const [formatting, setFormatting] = useState<FormattingOptions>({
    fontSize: 12,
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.5,
    bold: false,
    italic: false,
    underline: false,
    textAlign: "left",
    bulletStyle: "disc",
    spacing: 16,
  });

  // State for selected theme
  const [selectedTheme, setSelectedTheme] =
    useState<string>("Professional Blue");

  // State for margins
  const [margins, setMargins] = useState({
    top: 0.5,
    bottom: 0.5,
    left: 0.5,
    right: 0.5,
  });

  // State for ATS score and suggestions
  const [atsScore, setAtsScore] = useState(85);
  const [atsSuggestions, setAtsSuggestions] = useState([
    "Add more relevant keywords from the job description",
    "Use standard section headings like 'Work Experience'",
    "Include quantifiable achievements with numbers",
  ]);

  // State for unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for toolbar collapse
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  // ✅ Add resume data state
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev',
      title: 'Senior Software Engineer'
    },
    summary: 'Experienced software engineer with 8+ years of experience in full-stack development.',
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: '• Led development of microservices architecture serving 10M+ users',
        achievements: ['Led development of microservices architecture serving 10M+ users'],
        technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        teamSize: 8,
        salary: '$120k - $150k',
        workType: 'full-time',
        remote: false
      }
    ],
    education: [],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
    certifications: []
  });

  // Handlers
  const handleFormattingChange = (updates: Partial<FormattingOptions>) => {
    setFormatting((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleThemeChange = (theme: ColorTheme) => {
    setSelectedTheme(theme.name);
    setHasUnsavedChanges(true);
  };

  const handleMarginsChange = (newMargins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }) => {
    setMargins(newMargins);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving resume...", resumeData);
    setHasUnsavedChanges(false);
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log("Downloading PDF...");
  };

  const handleTemplateSwitch = () => {
    // Implement template switch logic here
    console.log("Switching template...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Template Selector (Full Width) */}
      <div className="w-full">
        <TemplateSelector
          selectedTemplate="ats-professional"
          onTemplateSelect={(id) => console.log("Selected:", id)}
          onPreview={(id) => console.log("Preview:", id)}
          onContinue={(id) => console.log("Continue with:", id)}
        />
      </div>

      {/* Main Builder Layout */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Toolbar */}
        <ResumeToolbar
          formatting={formatting}
          onFormattingChange={handleFormattingChange}
          selectedTheme={selectedTheme}
          onThemeChange={handleThemeChange}
          template="ats-professional"
          margins={margins}
          onMarginsChange={handleMarginsChange}
          atsScore={atsScore}
          atsSuggestions={atsSuggestions}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
          onDownload={handleDownload}
          onTemplateSwitch={handleTemplateSwitch}
          isCollapsed={isToolbarCollapsed}
          onToggleCollapse={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
        />

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <ResumeEditor
            template="ats-professional"
            onSave={(data) => {
              console.log("Saved:", data);
              setResumeData(data); // ✅ Update resumeData when saved
              setHasUnsavedChanges(false);
            }}
            onPreview={(data) => console.log("Preview:", data)}
          />
        </div>

        {/* Preview */}
        <div className="w-96 border-l border-gray-200">
          <ResumePreview
            template="ats-professional"
            onDownload={handleDownload}
            onPrint={() => console.log("Print")}
            onShare={() => console.log("Share")}
          />
        </div>
      </div>

      {/* ✅ Move ExperienceSection inside the editor or create a proper layout */}
      {/* For now, you can either:
          1. Remove this and integrate ExperienceSection into ResumeEditor
          2. Keep it here but ensure proper styling
      */}
      <div className="p-6">
        <PersonalInfoSection
    data={resumeData.personalInfo}
    onUpdate={(personalInfo) => setResumeData(prev => ({ ...prev, personalInfo }))}
  />
        <ExperienceSection
          experiences={resumeData.experience}
          onUpdate={(experiences) =>
            setResumeData((prev) => ({ ...prev, experience: experiences }))
          }
        />
      </div>
    </div>
  );
}