"use client";

import React, { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ATSOptimizedTemplate from '../templates/ats-optimized';
import ClassicTemplate from '../templates/classic';
import CreativeTemplate from '../templates/creative';
import ModernTemplate from '../templates/modern';
// Sample Resume Data (this would come from props/context in real app)
const sampleResumeData = {
  template: "ats-professional",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev",
    title: "Senior Software Engineer",
  },
  summary:
    "Experienced software engineer with 8+ years of experience in full-stack development. Proven track record of leading cross-functional teams and delivering scalable solutions that drive business growth.",
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "Present",
      description:
        "• Led development of microservices architecture serving 10M+ users\n• Improved system performance by 40% through optimization initiatives\n• Mentored 5 junior developers and conducted technical interviews",
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2020-12",
      description:
        "• Built responsive web applications using React and Node.js\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Collaborated with product team to define technical requirements",
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.8",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "Agile",
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-03",
      credentialId: "AWS-ASA-123456",
    },
  ],
};

// Template Components
const ATSProfessionalTemplate = ({
  data,
  zoom,
}: {
  data: typeof sampleResumeData;
  zoom: number;
}) => {
  return (
    <div
      className="bg-white text-black p-8 min-h-full font-serif"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
    >
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-gray-600 mb-3">
          {data.personalInfo.title}
        </h2>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {data.personalInfo.email}
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {data.personalInfo.phone}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {data.personalInfo.location}
          </div>
          <div className="flex items-center gap-1">
            <Linkedin className="w-4 h-4" />
            {data.personalInfo.linkedin}
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            {data.personalInfo.website}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-200 pb-1">
          PROFESSIONAL SUMMARY
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
      </div>

      {/* Work Experience */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-200 pb-1">
          WORK EXPERIENCE
        </h3>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold text-gray-800">{exp.position}</h4>
                <p className="text-sm font-medium text-gray-600">
                  {exp.company}
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>
                  {exp.startDate} - {exp.endDate}
                </p>
                <p>{exp.location}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {exp.description}
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-200 pb-1">
          EDUCATION
        </h3>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                <p className="text-sm text-gray-600">{edu.institution}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>
                  {edu.startDate} - {edu.endDate}
                </p>
                <p>{edu.location}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-200 pb-1">
          TECHNICAL SKILLS
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={index} className="text-sm text-gray-700">
              {skill}
              {index < data.skills.length - 1 && " •"}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-200 pb-1">
            CERTIFICATIONS
          </h3>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-xs">ID: {cert.credentialId}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ModernTemplateLocal = ({
  data,
  zoom,
}: {
  data: typeof sampleResumeData;
  zoom: number;
}) => {
  return (
    <div
      className="bg-white text-black p-6 min-h-full font-sans"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
    >
      {/* Header with colored accent */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <h2 className="text-xl opacity-90 mb-4">{data.personalInfo.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {data.personalInfo.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {data.personalInfo.phone}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {data.personalInfo.location}
          </div>
        </div>
      </div>

      {/* Rest of the content similar to ATS template but with modern styling */}
      <div className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600"></div>
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600"></div>
            Work Experience
          </h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6 pl-4 border-l-2 border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    {exp.position}
                  </h4>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                  <p className="font-medium">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {exp.description}
              </div>
            </div>
          ))}
        </div>

        {/* Skills in a more visual format */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600"></div>
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Preview Component
interface ResumePreviewProps {
  resumeData?: typeof sampleResumeData;
  template?: string;
  isLoading?: boolean;
  className?: string;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
}

export default function ResumePreview({
  resumeData = sampleResumeData,
  template = "ats-professional",
  isLoading = false,
  className,
  onDownload,
  onPrint,
  onShare,
}: ResumePreviewProps) {
    // Format date consistently on the client
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US'); // Forces consistent format (MM/DD/YYYY)
  }, []);

  const [zoom, setZoom] = useState(0.75);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoom(0.75);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // const renderTemplate = () => {
  //   switch (template) {
  //     case "modern-gradient":
  //     case "modern-sidebar":
  //       return <ModernTemplate data={resumeData} zoom={zoom} />;
  //     case "ats-professional":
  //     case "ats-minimal":
  //     case "ats-executive":
  //     default:
  //       return <ATSProfessionalTemplate data={resumeData} zoom={zoom} />;
  //   }
  // };
  const renderTemplate = () => {
  switch (template) {
    case "ats-optimized":
      return <ATSOptimizedTemplate data={resumeData} zoom={zoom} />;
    case "classic":
      return <ClassicTemplate data={resumeData} zoom={zoom} />;
    case "creative":
      return <CreativeTemplate data={resumeData} zoom={zoom} />;
    case "modern":
    case "modern-gradient":
    case "modern-sidebar":
      return <ModernTemplateLocal data={resumeData} zoom={zoom} />;
    case "ats-professional":
    case "ats-minimal":
    case "ats-executive":
    default:
      return <ATSProfessionalTemplate data={resumeData} zoom={zoom} />;
  }
};

  if (isLoading) {
    return (
      <div className={cn("w-full h-full", className)}>
        <Card className="h-full">
          <CardContent className="p-6 h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500">Generating preview...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Resume Preview</span>
          <Badge variant="outline" className="text-xs">
            {template}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.3}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm px-2 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 1.5}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <Button variant="ghost" size="sm" onClick={handleFullscreen}>
            <Eye className="w-4 h-4 mr-1" />
            {isFullscreen ? "Exit" : "Fullscreen"}
          </Button>

          <Button variant="ghost" size="sm" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>

          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>

          <Button
            size="sm"
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div
        className={cn(
          "flex-1 bg-gray-100 overflow-auto",
          isFullscreen ? "fixed inset-0 z-50 bg-gray-100" : ""
        )}
      >
        <div className="p-8 flex justify-center">
          <div
            ref={previewRef}
            className="bg-white shadow-lg"
            style={{
              width: "8.5in",
              minHeight: "11in",
              maxWidth: "100%",
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Template: {template}</span>
            <span>•</span>
            <span>Last updated: {formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>ATS Score: 92/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
