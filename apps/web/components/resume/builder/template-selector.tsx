"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Palette, 
  Star, 
  Eye, 
  Download,
  Zap,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  TrendingUp,
  Shield,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Template Data
const resumeTemplates = {
  ats: [
    {
      id: 'ats-professional',
      name: 'ATS Professional',
      description: 'Clean, professional layout optimized for ATS systems',
      category: 'ATS Optimized',
      features: ['ATS Friendly', 'Clean Layout', 'Standard Fonts'],
      rating: 4.9,
      downloads: 15420,
      preview: '/templates/ats-professional.png',
      color: 'blue',
      recommended: true,
      industry: ['Technology', 'Finance', 'Healthcare']
    },
    {
      id: 'ats-minimal',
      name: 'ATS Minimal',
      description: 'Simple, clean design that passes through any ATS',
      category: 'ATS Optimized',
      features: ['Minimal Design', 'High Compatibility', 'Easy to Read'],
      rating: 4.8,
      downloads: 12890,
      preview: '/templates/ats-minimal.png',
      color: 'gray',
      recommended: false,
      industry: ['All Industries']
    },
    {
      id: 'ats-executive',
      name: 'ATS Executive',
      description: 'Professional template for senior positions',
      category: 'ATS Optimized',
      features: ['Executive Style', 'ATS Compatible', 'Premium Look'],
      rating: 4.7,
      downloads: 8650,
      preview: '/templates/ats-executive.png',
      color: 'indigo',
      recommended: false,
      industry: ['Executive', 'Management', 'Consulting']
    }
  ],
  modern: [
    {
      id: 'modern-gradient',
      name: 'Modern Gradient',
      description: 'Contemporary design with subtle gradients',
      category: 'Modern',
      features: ['Modern Design', 'Color Accents', 'Visual Appeal'],
      rating: 4.6,
      downloads: 9870,
      preview: '/templates/modern-gradient.png',
      color: 'purple',
      recommended: false,
      industry: ['Design', 'Marketing', 'Creative']
    },
    {
      id: 'modern-sidebar',
      name: 'Modern Sidebar',
      description: 'Two-column layout with sidebar for skills',
      category: 'Modern',
      features: ['Sidebar Layout', 'Skill Highlights', 'Modern Typography'],
      rating: 4.5,
      downloads: 7650,
      preview: '/templates/modern-sidebar.png',
      color: 'green',
      recommended: false,
      industry: ['Technology', 'Design', 'Marketing']
    }
  ],
  creative: [
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      description: 'Perfect for designers and creative professionals',
      category: 'Creative',
      features: ['Portfolio Section', 'Visual Elements', 'Creative Layout'],
      rating: 4.4,
      downloads: 5430,
      preview: '/templates/creative-portfolio.png',
      color: 'pink',
      recommended: false,
      industry: ['Design', 'Art', 'Photography']
    },
    {
      id: 'creative-timeline',
      name: 'Creative Timeline',
      description: 'Timeline-based layout for career progression',
      category: 'Creative',
      features: ['Timeline Design', 'Visual Story', 'Unique Layout'],
      rating: 4.3,
      downloads: 4290,
      preview: '/templates/creative-timeline.png',
      color: 'orange',
      recommended: false,
      industry: ['Creative', 'Media', 'Entertainment']
    }
  ]
}

// Template Card Component
const TemplateCard = ({ 
  template, 
  isSelected, 
  onSelect, 
  onPreview 
}: {
  template: typeof resumeTemplates.ats[0]
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}) => {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50',
      gray: 'border-gray-500 bg-gray-50',
      indigo: 'border-indigo-500 bg-indigo-50',
      purple: 'border-purple-500 bg-purple-50',
      green: 'border-green-500 bg-green-50',
      pink: 'border-pink-500 bg-pink-50',
      orange: 'border-orange-500 bg-orange-50'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected ? `ring-2 ring-offset-2 ${getColorClasses(template.color)}` : "hover:shadow-md"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              {template.recommended && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">
              {template.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{template.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Template Preview */}
        <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] group">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onPreview()
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {template.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>

          {/* Industry Tags */}
          <div className="flex flex-wrap gap-1">
            {template.industry.slice(0, 2).map((industry) => (
              <Badge key={industry} variant="secondary" className="text-xs">
                {industry}
              </Badge>
            ))}
            {template.industry.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{template.industry.length - 2} more
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{template.downloads.toLocaleString()} downloads</span>
            </div>
            <Badge variant={template.category === 'ATS Optimized' ? 'default' : 'secondary'} className="text-xs">
              {template.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Industry Filter Component
const IndustryFilter = ({ 
  selectedIndustry, 
  onIndustryChange 
}: {
  selectedIndustry: string
  onIndustryChange: (industry: string) => void
}) => {
  const industries = [
    { name: 'All Industries', icon: Briefcase, count: 12 },
    { name: 'Technology', icon: Code, count: 8 },
    { name: 'Finance', icon: TrendingUp, count: 6 },
    { name: 'Healthcare', icon: Heart, count: 4 },
    { name: 'Design', icon: Palette, count: 5 },
    { name: 'Education', icon: GraduationCap, count: 3 },
    { name: 'Consulting', icon: Shield, count: 4 }
  ]

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-700">Filter by Industry</h3>
      <div className="space-y-1">
        {industries.map((industry) => {
          const Icon = industry.icon
          return (
            <button
              key={industry.name}
              onClick={() => onIndustryChange(industry.name)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                selectedIndustry === industry.name 
                  ? "bg-blue-100 text-blue-700" 
                  : "hover:bg-gray-100 text-gray-600"
              )}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span>{industry.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {industry.count}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface TemplateSelectorProps {
  selectedTemplate?: string
  onTemplateSelect?: (templateId: string) => void
  onPreview?: (templateId: string) => void
  onContinue?: (templateId: string) => void
  className?: string
}

export default function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
  onPreview,
  onContinue,
  className
}: TemplateSelectorProps) {
  const [activeTab, setActiveTab] = useState('ats')
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries')
  const [currentTemplate, setCurrentTemplate] = useState(selectedTemplate || '')

  const handleTemplateSelect = (templateId: string) => {
    setCurrentTemplate(templateId)
    onTemplateSelect?.(templateId)
  }

  const handlePreview = (templateId: string) => {
    onPreview?.(templateId)
  }

  const handleContinue = () => {
    if (currentTemplate) {
      onContinue?.(currentTemplate)
    }
  }

  const getFilteredTemplates = (templates: typeof resumeTemplates.ats) => {
    if (selectedIndustry === 'All Industries') return templates
    return templates.filter(template => 
      template.industry.includes(selectedIndustry)
    )
  }

  const allTemplates = Object.values(resumeTemplates).flat()
  const selectedTemplateData = allTemplates.find(t => t.id === currentTemplate)

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6 space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Resume Template</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our collection of professional resume templates. Each template is designed 
          to help you stand out while maintaining ATS compatibility.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">98%</p>
            <p className="text-sm text-gray-500">ATS Compatible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Download className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">50K+</p>
            <p className="text-sm text-gray-500">Downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">5 Min</p>
            <p className="text-sm text-gray-500">Setup Time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <IndustryFilter 
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
          />

          {/* Selected Template Info */}
          {selectedTemplateData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Template</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="font-medium">{selectedTemplateData.name}</p>
                  <p className="text-sm text-gray-600">{selectedTemplateData.description}</p>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Ready to customize</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ats">
                ATS Optimized ({getFilteredTemplates(resumeTemplates.ats).length})
              </TabsTrigger>
              <TabsTrigger value="modern">
                Modern ({getFilteredTemplates(resumeTemplates.modern).length})
              </TabsTrigger>
              <TabsTrigger value="creative">
                Creative ({getFilteredTemplates(resumeTemplates.creative).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredTemplates(resumeTemplates.ats).map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={currentTemplate === template.id}
                    onSelect={() => handleTemplateSelect(template.id)}
                    onPreview={() => handlePreview(template.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modern" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredTemplates(resumeTemplates.modern).map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={currentTemplate === template.id}
                    onSelect={() => handleTemplateSelect(template.id)}
                    onPreview={() => handlePreview(template.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="creative" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredTemplates(resumeTemplates.creative).map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={currentTemplate === template.id}
                    onSelect={() => handleTemplateSelect(template.id)}
                    onPreview={() => handlePreview(template.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Continue Button */}
      {currentTemplate && (
        <div className="flex justify-center mt-8">
          <Button 
            size="lg" 
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Continue with {selectedTemplateData?.name}
            <FileText className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}