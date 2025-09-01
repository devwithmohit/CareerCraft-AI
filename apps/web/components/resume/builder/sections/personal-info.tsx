"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
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

// Validation rules
const validationRules = {
  firstName: { required: true, minLength: 2, maxLength: 50 },
  lastName: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: false, pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  location: { required: false, maxLength: 100 },
  linkedin: { required: false, pattern: /^https?:\/\/(www\.)?linkedin\.com\/.*$/ },
  website: { required: false, pattern: /^https?:\/\/.*$/ },
  title: { required: true, minLength: 3, maxLength: 100 }
}

// Professional title suggestions
const titleSuggestions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Product Manager',
  'Data Scientist',
  'UX/UI Designer',
  'Marketing Manager',
  'Sales Representative',
  'Project Manager',
  'Business Analyst',
  'Technical Writer',
  'QA Engineer'
]

// Location suggestions (major cities)
const locationSuggestions = [
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'Denver, CO',
  'Miami, FL',
  'Atlanta, GA'
]

// Personal Info Form Component
const PersonalInfoForm = ({ 
  data, 
  onSave, 
  onCancel,
  isEditing = false 
}: {
  data: PersonalInfo
  onSave: (data: PersonalInfo) => void
  onCancel: () => void
  isEditing?: boolean
}) => {
  const [formData, setFormData] = useState<PersonalInfo>(data)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionType, setSuggestionType] = useState<'title' | 'location' | null>(null)

  // Validate field
  const validateField = (field: keyof PersonalInfo, value: string): string => {
    const rules = validationRules[field]
    if (!rules) return ''

    if (rules.required && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      switch (field) {
        case 'email':
          return 'Please enter a valid email address'
        case 'phone':
          return 'Please enter a valid phone number'
        case 'linkedin':
          return 'Please enter a valid LinkedIn URL'
        case 'website':
          return 'Please enter a valid website URL'
        default:
          return 'Invalid format'
      }
    }

    return ''
  }

  // Handle input change
  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Show suggestions for title and location
    if (field === 'title' && value.length > 0) {
      setSuggestionType('title')
      setShowSuggestions(true)
    } else if (field === 'location' && value.length > 0) {
      setSuggestionType('location')
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Apply suggestion
  const applySuggestion = (suggestion: string, type: 'title' | 'location') => {
    setFormData(prev => ({ ...prev, [type]: suggestion }))
    setShowSuggestions(false)
    setSuggestionType(null)
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalInfo, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field as keyof PersonalInfo, formData[field as keyof PersonalInfo])
      if (error) {
        newErrors[field as keyof PersonalInfo] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  // Get filtered suggestions
  const getFilteredSuggestions = () => {
    if (!suggestionType) return []

    const currentValue = formData[suggestionType].toLowerCase()
    const suggestions = suggestionType === 'title' ? titleSuggestions : locationSuggestions

    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(currentValue) && 
      suggestion.toLowerCase() !== currentValue
    ).slice(0, 5)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-1">
              First Name *
              {errors.firstName && <AlertCircle className="w-4 h-4 text-red-500" />}
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="John"
              className={cn(errors.firstName && "border-red-500")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-1">
              Last Name *
              {errors.lastName && <AlertCircle className="w-4 h-4 text-red-500" />}
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Doe"
              className={cn(errors.lastName && "border-red-500")}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Professional Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-1">
            Professional Title *
            {errors.title && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Senior Software Engineer"
              className={cn("pl-10", errors.title && "border-red-500")}
            />
          </div>
          {errors.title && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}

          {/* Title Suggestions */}
          {showSuggestions && suggestionType === 'title' && getFilteredSuggestions().length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
              {getFilteredSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applySuggestion(suggestion, 'title')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Email *
              {errors.email && <AlertCircle className="w-4 h-4 text-red-500" />}
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.doe@email.com"
                className={cn("pl-10", errors.email && "border-red-500")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              Phone
              {errors.phone && <AlertCircle className="w-4 h-4 text-red-500" />}
            </Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={cn("pl-10", errors.phone && "border-red-500")}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-1">
            Location
            {errors.location && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
              className={cn("pl-10", errors.location && "border-red-500")}
            />
          </div>
          {errors.location && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.location}
            </p>
          )}

          {/* Location Suggestions */}
          {showSuggestions && suggestionType === 'location' && getFilteredSuggestions().length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
              {getFilteredSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applySuggestion(suggestion, 'location')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-1">
              LinkedIn Profile
              {errors.linkedin && <AlertCircle className="w-4 h-4 text-red-500" />}
            </Label>
            <div className="relative">
              <Linkedin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
                className={cn("pl-10", errors.linkedin && "border-red-500")}
              />
            </div>
            {errors.linkedin && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.linkedin}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-1">
              Website/Portfolio
              {errors.website && <AlertCircle className="w-4 h-4 text-red-500" />}
            </Label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="johndoe.dev"
                className={cn("pl-10", errors.website && "border-red-500")}
              />
            </div>
            {errors.website && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.website}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <Separator />
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={Object.keys(errors).some(key => errors[key as keyof PersonalInfo])}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Information' : 'Save Information'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Personal Info Display Component
const PersonalInfoDisplay = ({ 
  data, 
  onEdit 
}: {
  data: PersonalInfo
  onEdit: () => void
}) => {
  const isComplete = () => {
    return data.firstName && data.lastName && data.email && data.title
  }

  const getCompletionPercentage = () => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'location', 'linkedin', 'website', 'title']
    const filledFields = fields.filter(field => data[field as keyof PersonalInfo]?.trim())
    return Math.round((filledFields.length / fields.length) * 100)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {data.firstName} {data.lastName}
                </h3>
                {isComplete() && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-3">{data.title}</p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {data.email || 'Not provided'}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {data.phone || 'Not provided'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {data.location || 'Not provided'}
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  {data.linkedin ? (
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      LinkedIn Profile
                    </a>
                  ) : 'Not provided'}
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Globe className="w-4 h-4" />
                  {data.website ? (
                    <a href={data.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {data.website}
                    </a>
                  ) : 'Not provided'}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          </div>

          {/* Completion Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Profile Completion</span>
              <span className="font-medium">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>

          {/* Tips */}
          {!isComplete() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Complete Your Profile</p>
                  <p className="text-xs text-blue-800">
                    Add your contact information and professional details to make your resume more complete and ATS-friendly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Personal Info Section Component
interface PersonalInfoSectionProps {
  data: PersonalInfo
  onUpdate: (data: PersonalInfo) => void
  className?: string
}

export default function PersonalInfoSection({
  data,
  onUpdate,
  className
}: PersonalInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (updatedData: PersonalInfo) => {
    onUpdate(updatedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-600">
            Provide your basic information and contact details for your resume.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <User className="w-4 h-4 mr-2" />
            Edit Info
          </Button>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <PersonalInfoForm
          data={data}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing
        />
      ) : (
        <PersonalInfoDisplay
          data={data}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">ATS Optimization Tips</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Use a professional email address</li>
                <li>• Include your LinkedIn profile URL</li>
                <li>• Add your location for location-based job searches</li>
                <li>• Keep your professional title clear and concise</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}