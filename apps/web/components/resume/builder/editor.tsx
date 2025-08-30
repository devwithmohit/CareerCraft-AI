"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Save,
  Undo,
  Redo,
  Plus,
  Trash2,
  Eye,
  Edit3,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Award,
  ChevronRight,
  ChevronLeft,
  Download,
  Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types for resume data
interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  title: string
}

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  credentialId?: string
  description?: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  certifications: Certification[]
}

// Default resume data
const defaultResumeData: ResumeData = {
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
  summary: 'Experienced software engineer with 8+ years of experience in full-stack development. Proven track record of leading cross-functional teams and delivering scalable solutions that drive business growth.',
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: '• Led development of microservices architecture serving 10M+ users\n• Improved system performance by 40% through optimization initiatives\n• Mentored 5 junior developers and conducted technical interviews'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      location: 'Berkeley, CA',
      startDate: '2015-08',
      endDate: '2019-05',
      gpa: '3.8'
    }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-03',
      credentialId: 'AWS-ASA-123456'
    }
  ]
}

// Section Components
const PersonalInfoSection = ({ 
  data, 
  onUpdate 
}: { 
  data: PersonalInfo
  onUpdate: (data: PersonalInfo) => void 
}) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Professional Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="City, State/Country"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/yourprofile"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website/Portfolio</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="yourwebsite.com"
          />
        </div>
      </div>
    </div>
  )
}

const SummarySection = ({ 
  summary, 
  onUpdate 
}: { 
  summary: string
  onUpdate: (summary: string) => void 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Write a compelling summary of your professional background and career goals..."
          rows={6}
        />
      </div>
      <div className="text-sm text-gray-500">
        {summary.length}/500 characters
      </div>
    </div>
  )
}

const ExperienceSection = ({ 
  experiences, 
  onUpdate 
}: { 
  experiences: Experience[]
  onUpdate: (experiences: Experience[]) => void 
}) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    onUpdate([...experiences, newExp])
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onUpdate(experiences.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    ))
  }

  const removeExperience = (id: string) => {
    onUpdate(experiences.filter(exp => exp.id !== id))
  }

  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <Card key={exp.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  disabled={exp.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { 
                  current: e.target.checked,
                  endDate: e.target.checked ? '' : exp.endDate
                })}
                className="rounded"
              />
              <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )
}

const SkillsSection = ({ 
  skills, 
  onUpdate 
}: { 
  skills: string[]
  onUpdate: (skills: string[]) => void 
}) => {
  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onUpdate([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onUpdate(skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill..."
          className="flex-1"
        />
        <Button onClick={addSkill} disabled={!newSkill.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 text-gray-500 hover:text-red-600"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-gray-500 text-sm">No skills added yet. Add your technical and soft skills.</p>
      )}
    </div>
  )
}

// Main Editor Component
interface ResumeEditorProps {
  initialData?: Partial<ResumeData>
  template?: string
  onSave?: (data: ResumeData) => void
  onPreview?: (data: ResumeData) => void
  className?: string
}

export default function ResumeEditor({
  initialData,
  template = 'ats-professional',
  onSave,
  onPreview,
  className
}: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeData>({
    ...defaultResumeData,
    ...initialData
  })
  const [activeSection, setActiveSection] = useState('personal')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [resumeData])

  const updatePersonalInfo = (personalInfo: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo }))
  }

  const updateSummary = (summary: string) => {
    setResumeData(prev => ({ ...prev, summary }))
  }

  const updateExperience = (experience: Experience[]) => {
    setResumeData(prev => ({ ...prev, experience }))
  }

  const updateEducation = (education: Education[]) => {
    setResumeData(prev => ({ ...prev, education }))
  }

  const updateSkills = (skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }))
  }

  const updateCertifications = (certifications: Certification[]) => {
    setResumeData(prev => ({ ...prev, certifications }))
  }

  const handleSave = () => {
    onSave?.(resumeData)
    setHasUnsavedChanges(false)
  }

  const handlePreview = () => {
    onPreview?.(resumeData)
    setIsPreviewMode(!isPreviewMode)
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection data={resumeData.personalInfo} onUpdate={updatePersonalInfo} />
      case 'summary':
        return <SummarySection summary={resumeData.summary} onUpdate={updateSummary} />
      case 'experience':
        return <ExperienceSection experiences={resumeData.experience} onUpdate={updateExperience} />
      case 'education':
        return <EducationSection education={resumeData.education} onUpdate={updateEducation} />
      case 'skills':
        return <SkillsSection skills={resumeData.skills} onUpdate={updateSkills} />
      case 'certifications':
        return <CertificationsSection certifications={resumeData.certifications} onUpdate={updateCertifications} />
      default:
        return null
    }
  }

  return (
    <div className={cn("w-full h-full flex flex-col bg-gray-50", className)}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Resume Editor</h1>
            <Badge variant="outline">{template}</Badge>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Unsaved Changes
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Sections</h2>
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                      activeSection === section.id 
                        ? "bg-blue-100 text-blue-700" 
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                {renderSectionContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {isPreviewMode && (
          <>
            <Separator orientation="vertical" />
            <div className="w-96 bg-white">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Preview will be shown here</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Additional section components (you can expand these)
const EducationSection = ({ 
  education, 
  onUpdate 
}: { 
  education: Education[]
  onUpdate: (education: Education[]) => void 
}) => {
   const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }
    onUpdate([...education, newEdu])
  }
    const updateEducation = (id: string, updates: Partial<Education>) => {
    onUpdate(education.map(edu => 
      edu.id === id ? { ...edu, ...updates } : edu
    ))
  }

  const removeEducation = (id: string) => {
    onUpdate(education.filter(edu => edu.id !== id))
  }

  // Similar structure to ExperienceSection
  return (
  <div className="space-y-6">
      {education.map((edu, index) => (
        <Card key={edu.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                  <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="University name"
                />
                </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder="Bachelor of Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                   onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                  placeholder="3.8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={edu.description || ''}
                onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                placeholder="Relevant coursework, honors, activities..."
                rows={3}
                />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  )
}

// ...existing code...

const CertificationsSection = ({ 
  certifications, 
  onUpdate 
}: { 
  certifications: Certification[]
  onUpdate: (certifications: Certification[]) => void 
}) => {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      description: ''
    }
    onUpdate([...certifications, newCert])
  }

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onUpdate(certifications.map(cert => 
      cert.id === id ? { ...cert, ...updates } : cert
    ))
  }

  const removeCertification = (id: string) => {
    onUpdate(certifications.filter(cert => cert.id !== id))
  }

  return (
    <div className="space-y-6">
      {certifications.map((cert, index) => (
        <Card key={cert.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Certification {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ✅ Fixed: Proper grid structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  placeholder="Certification name"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  placeholder="Issuing organization"
                />
              </div>
            </div>

            {/* ✅ Fixed: Second grid properly structured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Credential ID (Optional)</Label>
                <Input
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                  placeholder="ABC-123456"
                />
              </div>
            </div>

            {/* ✅ Fixed: Description field properly structured */}
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={cert.description || ''}
                onChange={(e) => updateCertification(cert.id, { description: e.target.value })}
                placeholder="Brief description of the certification..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addCertification} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  )
}