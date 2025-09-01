"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Edit3,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Copy,
  Star,
  TrendingUp,
  Target,
  Award,
  Users,
  DollarSign,
  Clock,
  Lightbulb,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements?: string[]
  technologies?: string[]
  teamSize?: number
  salary?: string
  workType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance'
  remote?: boolean
}

interface ExperienceFormData extends Omit<Experience, 'id'> {
  id?: string
}

// Achievement suggestions
const achievementSuggestions = [
  "Led development of microservices architecture serving 10M+ users",
  "Improved system performance by 40% through optimization initiatives", 
  "Mentored 5 junior developers and conducted technical interviews",
  "Reduced deployment time by 60% through CI/CD pipeline implementation",
  "Increased user engagement by 25% through UX improvements",
  "Managed cross-functional team of 8 engineers",
  "Delivered project 2 weeks ahead of schedule",
  "Reduced server costs by 30% through cloud optimization",
  "Implemented security measures that prevented data breaches",
  "Built RESTful APIs handling 1M+ daily requests"
]

// Technology suggestions by role
const techSuggestionsByRole = {
  'software engineer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  'data scientist': ['Python', 'R', 'SQL', 'TensorFlow', 'Pandas', 'Jupyter', 'AWS'],
  'product manager': ['Jira', 'Confluence', 'Figma', 'Analytics', 'A/B Testing', 'SQL'],
  'designer': ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Principle', 'Framer'],
  'marketing': ['Google Analytics', 'HubSpot', 'Salesforce', 'Facebook Ads', 'Google Ads']
}

// Experience Form Component
const ExperienceForm = ({ 
  experience, 
  onSave, 
  onCancel,
  isEditing = false 
}: {
  experience?: Partial<Experience>
  onSave: (data: ExperienceFormData) => void
  onCancel: () => void
  isEditing?: boolean
}) => {
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: experience?.company || '',
    position: experience?.position || '',
    location: experience?.location || '',
    startDate: experience?.startDate || '',
    endDate: experience?.endDate || '',
    current: experience?.current || false,
    description: experience?.description || '',
    achievements: experience?.achievements || [],
    technologies: experience?.technologies || [],
    teamSize: experience?.teamSize || undefined,
    salary: experience?.salary || '',
    workType: experience?.workType || 'full-time',
    remote: experience?.remote || false,
    ...experience
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [newAchievement, setNewAchievement] = useState('')
  const [newTechnology, setNewTechnology] = useState('')

  const handleInputChange = (field: keyof ExperienceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addAchievement = (achievement: string) => {
    if (achievement.trim() && !formData.achievements?.includes(achievement.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), achievement.trim()]
      }))
      setNewAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }))
  }

  const addTechnology = (tech: string) => {
    if (tech.trim() && !formData.technologies?.includes(tech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), tech.trim()]
      }))
      setNewTechnology('')
    }
  }

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const getSuggestedTechnologies = () => {
    const role = formData.position.toLowerCase()
    for (const [key, techs] of Object.entries(techSuggestionsByRole)) {
      if (role.includes(key)) {
        return techs.filter(tech => !formData.technologies?.includes(tech))
      }
    }
    return []
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          {isEditing ? 'Edit Experience' : 'Add New Experience'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company *</Label>
            <Input
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="e.g., Google, Microsoft, Startup Inc."
            />
          </div>
          <div className="space-y-2">
            <Label>Job Title *</Label>
            <Input
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Input
              type="month"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="month"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={formData.current}
              placeholder={formData.current ? 'Present' : ''}
            />
          </div>
        </div>

        {/* Work Type and Current */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Employment Type</Label>
            <select
              value={formData.workType}
              onChange={(e) => handleInputChange('workType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div className="flex items-center space-x-4 pt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => handleInputChange('current', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Currently work here</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.remote}
                onChange={(e) => handleInputChange('remote', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Remote work</span>
            </label>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label>Job Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your role, responsibilities, and day-to-day activities..."
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Use bullet points (•) to list your responsibilities and achievements.
          </p>
        </div>

        {/* Key Achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Key Achievements
            </Label>
            <Badge variant="outline" className="text-xs">
              Recommended for ATS
            </Badge>
          </div>
          
          {/* Achievement Input */}
          <div className="flex space-x-2">
            <Input
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="Add a quantified achievement..."
              onKeyPress={(e) => e.key === 'Enter' && addAchievement(newAchievement)}
            />
            <Button 
              onClick={() => addAchievement(newAchievement)}
              disabled={!newAchievement.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Achievement Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {achievementSuggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addAchievement(suggestion)}
                className="text-left p-2 text-xs text-gray-600 hover:bg-gray-50 rounded border"
                disabled={formData.achievements?.includes(suggestion)}
              >
                <Lightbulb className="w-3 h-3 inline mr-1" />
                {suggestion}
              </button>
            ))}
          </div>

          {/* Current Achievements */}
          {formData.achievements && formData.achievements.length > 0 && (
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-800">{achievement}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technologies Used */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Technologies & Tools
          </Label>
          
          <div className="flex space-x-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="Add technology or tool..."
              onKeyPress={(e) => e.key === 'Enter' && addTechnology(newTechnology)}
            />
            <Button 
              onClick={() => addTechnology(newTechnology)}
              disabled={!newTechnology.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Technology Suggestions */}
          {getSuggestedTechnologies().length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Suggested for {formData.position}:</p>
              <div className="flex flex-wrap gap-1">
                {getSuggestedTechnologies().slice(0, 6).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => addTechnology(tech)}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    + {tech}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Technologies */}
          {formData.technologies && formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {tech}
                  <button
                    onClick={() => removeTechnology(index)}
                    className="ml-1 text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Options
          </Button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label>Team Size</Label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="number"
                    value={formData.teamSize || ''}
                    onChange={(e) => handleInputChange('teamSize', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 5"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Salary Range (Optional)</Label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    value={formData.salary || ''}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g., $80k - $120k"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Separator />
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.company || !formData.position || !formData.startDate}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Experience' : 'Add Experience'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Experience Card Component
const ExperienceCard = ({ 
  experience, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: {
  experience: Experience
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getDuration = () => {
    const start = new Date(experience.startDate + '-01')
    const end = experience.current ? new Date() : new Date(experience.endDate + '-01')
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{experience.position}</h3>
                {experience.current && (
                  <Badge className="bg-green-100 text-green-800">Current</Badge>
                )}
                {experience.remote && (
                  <Badge variant="outline">Remote</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building className="w-4 h-4" />
                <span className="font-medium">{experience.company}</span>
                {experience.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {experience.location}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{getDuration()}</span>
                <span>•</span>
                <span className="capitalize">{experience.workType}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDuplicate}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {experience.description && (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {experience.description}
            </div>
          )}

          {/* Achievements */}
          {experience.achievements && experience.achievements.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                Key Achievements
              </Label>
              <div className="space-y-1">
                {experience.achievements.map((achievement, index) => (
                  <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded flex items-start gap-2">
                    <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Technologies & Tools</Label>
              <div className="flex flex-wrap gap-1">
                {experience.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {(experience.teamSize || experience.salary) && (
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
              {experience.teamSize && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Team of {experience.teamSize}
                </span>
              )}
              {experience.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {experience.salary}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Experience Section Component
interface ExperienceSectionProps {
  experiences: Experience[]
  onUpdate: (experiences: Experience[]) => void
  className?: string
}

export default function ExperienceSection({
  experiences,
  onUpdate,
  className
}: ExperienceSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  const handleAddExperience = (data: ExperienceFormData) => {
    const newExperience: Experience = {
      ...data,
      id: Date.now().toString(),
      achievements: data.achievements || [],
      technologies: data.technologies || []
    }
    onUpdate([...experiences, newExperience])
    setShowForm(false)
  }

  const handleEditExperience = (data: ExperienceFormData) => {
    if (!editingExperience) return
    
    const updatedExperience: Experience = {
      ...data,
      id: editingExperience.id,
      achievements: data.achievements || [],
      technologies: data.technologies || []
    }
    
    onUpdate(experiences.map(exp => 
      exp.id === editingExperience.id ? updatedExperience : exp
    ))
    setEditingExperience(null)
  }

  const handleDeleteExperience = (id: string) => {
    onUpdate(experiences.filter(exp => exp.id !== id))
  }

  const handleDuplicateExperience = (experience: Experience) => {
    const duplicated: Experience = {
      ...experience,
      id: Date.now().toString(),
      company: `${experience.company} (Copy)`,
      current: false
    }
    onUpdate([...experiences, duplicated])
  }

  const sortedExperiences = [...experiences].sort((a, b) => {
    // Current positions first, then by start date (newest first)
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-600">
            Add your professional experience, starting with your most recent position.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm || !!editingExperience}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <ExperienceForm
          onSave={handleAddExperience}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingExperience && (
        <ExperienceForm
          experience={editingExperience}
          onSave={handleEditExperience}
          onCancel={() => setEditingExperience(null)}
          isEditing
        />
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {sortedExperiences.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work experience added</h3>
              <p className="text-gray-600 mb-4">Add your professional experience to showcase your career journey.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onEdit={() => setEditingExperience(experience)}
              onDelete={() => handleDeleteExperience(experience.id)}
              onDuplicate={() => handleDuplicateExperience(experience)}
            />
          ))
        )}
      </div>

      {/* Tips */}
      {experiences.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">ATS Optimization Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use action verbs and quantify your achievements with numbers</li>
                  <li>• Include relevant keywords from job descriptions</li>
                  <li>• List technologies and tools you've used</li>
                  <li>• Keep descriptions concise but comprehensive</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}