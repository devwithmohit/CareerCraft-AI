"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText,
  Wand2,
  Target,
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  RefreshCw,
  Save,
  Eye,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Clock,
  BarChart
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Summary templates by role/industry
const summaryTemplates = {
  'Software Engineer': [
    "Experienced software engineer with {years}+ years of experience in {technologies}. Proven track record of developing scalable applications and leading cross-functional teams to deliver high-quality solutions.",
    "Full-stack developer specializing in {technologies} with expertise in building robust, user-centric applications. Strong background in {specialization} and passionate about creating efficient, maintainable code.",
    "Senior software engineer with deep expertise in {technologies}. Successfully led development of applications serving {scale} users while mentoring junior developers and driving technical excellence."
  ],
  'Product Manager': [
    "Results-driven product manager with {years}+ years of experience leading cross-functional teams to deliver innovative products. Expertise in {specialization} with a proven track record of increasing user engagement by {metric}%.",
    "Strategic product leader with deep understanding of {industry} markets. Successfully launched {number} products resulting in {metric} revenue growth through data-driven decision making and user-centric design.",
    "Experienced product manager specializing in {specialization}. Strong background in agile methodologies, user research, and stakeholder management with consistent delivery of products ahead of schedule."
  ],
  'Data Scientist': [
    "Data scientist with {years}+ years of experience leveraging {technologies} to drive business insights. Proven ability to translate complex data into actionable strategies, resulting in {metric}% improvement in key metrics.",
    "Analytical professional with expertise in machine learning and statistical modeling. Successfully developed predictive models that improved {business_outcome} by {metric}% using {technologies}.",
    "Senior data scientist with strong background in {specialization}. Expert in building end-to-end ML pipelines and collaborating with stakeholders to solve complex business problems through data-driven solutions."
  ],
  'UX Designer': [
    "Creative UX designer with {years}+ years of experience crafting user-centered digital experiences. Proven track record of improving user satisfaction by {metric}% through research-driven design solutions.",
    "User experience professional specializing in {specialization}. Successfully redesigned {number} applications resulting in increased user engagement and reduced bounce rates through intuitive design principles.",
    "Senior UX designer with expertise in design systems and user research. Passionate about creating accessible, inclusive designs that solve real user problems and drive business outcomes."
  ],
  'Marketing Manager': [
    "Strategic marketing professional with {years}+ years of experience driving brand growth and customer acquisition. Proven track record of increasing {metric} by {percentage}% through innovative digital marketing campaigns.",
    "Results-oriented marketing manager specializing in {specialization}. Successfully launched campaigns that generated {metric} leads and improved conversion rates by {percentage}% across multiple channels.",
    "Experienced marketing leader with expertise in data-driven marketing strategies. Strong background in {channels} with consistent delivery of campaigns that exceed ROI targets."
  ]
}

// Summary enhancement suggestions
const enhancementSuggestions = [
  {
    type: 'quantify',
    icon: BarChart,
    title: 'Add Quantifiable Achievements',
    description: 'Include specific numbers, percentages, or metrics to demonstrate impact',
    examples: ['Increased sales by 25%', 'Led team of 8 engineers', 'Managed $2M budget']
  },
  {
    type: 'keywords',
    icon: Target,
    title: 'Include Industry Keywords',
    description: 'Add relevant technical skills and industry terms for ATS optimization',
    examples: ['React', 'Agile', 'Machine Learning', 'Digital Marketing']
  },
  {
    type: 'impact',
    icon: TrendingUp,
    title: 'Highlight Business Impact',
    description: 'Show how your work contributed to business goals and outcomes',
    examples: ['Reduced costs', 'Improved efficiency', 'Increased revenue']
  },
  {
    type: 'leadership',
    icon: Users,
    title: 'Showcase Leadership',
    description: 'Mention team leadership, mentoring, or cross-functional collaboration',
    examples: ['Led cross-functional team', 'Mentored junior developers', 'Managed stakeholders']
  }
]

// Summary analyzer
const analyzeSummary = (summary: string) => {
  const analysis = {
    wordCount: summary.trim().split(/\s+/).length,
    hasNumbers: /\d/.test(summary),
    hasActionVerbs: /\b(led|managed|developed|created|improved|increased|reduced|achieved|delivered|implemented)\b/i.test(summary),
    hasIndustryTerms: false, // Would be customized based on role
    readabilityScore: 0,
    suggestions: [] as string[]
  }

  // Word count check
  if (analysis.wordCount < 50) {
    analysis.suggestions.push('Consider expanding your summary to 50-100 words for better impact')
  } else if (analysis.wordCount > 150) {
    analysis.suggestions.push('Consider shortening your summary to 100-150 words for better readability')
  }

  // Numbers and metrics
  if (!analysis.hasNumbers) {
    analysis.suggestions.push('Add specific numbers or percentages to quantify your achievements')
  }

  // Action verbs
  if (!analysis.hasActionVerbs) {
    analysis.suggestions.push('Include strong action verbs like "led," "developed," or "improved"')
  }

  // Calculate readability score (simplified)
  analysis.readabilityScore = Math.min(100, 
    (analysis.hasNumbers ? 25 : 0) +
    (analysis.hasActionVerbs ? 25 : 0) +
    (analysis.wordCount >= 50 && analysis.wordCount <= 150 ? 25 : 0) +
    25 // Base score
  )

  return analysis
}

// Summary form component
const SummaryForm = ({
  summary,
  onSave,
  onCancel,
  isEditing = false
}: {
  summary: string
  onSave: (summary: string) => void
  onCancel: () => void
  isEditing?: boolean
}) => {
  const [currentSummary, setCurrentSummary] = useState(summary)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [analysis, setAnalysis] = useState(analyzeSummary(summary))

  useEffect(() => {
    setAnalysis(analyzeSummary(currentSummary))
  }, [currentSummary])

  const handleTemplateUse = (template: string) => {
    setCurrentSummary(template)
    setShowTemplates(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {isEditing ? 'Edit Professional Summary' : 'Add Professional Summary'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Quick Start Templates</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <Wand2 className="w-4 h-4 mr-1" />
              {showTemplates ? 'Hide' : 'Show'} Templates
            </Button>
          </div>

          {showTemplates && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.keys(summaryTemplates).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "p-2 text-sm border rounded-lg transition-colors",
                      selectedRole === role 
                        ? "bg-blue-100 border-blue-300 text-blue-700" 
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {selectedRole && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Templates for {selectedRole}:</Label>
                  <div className="space-y-2">
                    {summaryTemplates[selectedRole as keyof typeof summaryTemplates].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateUse(template)}
                        className="w-full text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg border transition-colors"
                      >
                        {template.substring(0, 120)}...
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Summary Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Professional Summary</Label>
            <div className="flex items-center gap-2 text-sm">
              <span className={cn("font-medium", 
                analysis.wordCount < 50 ? "text-red-600" :
                analysis.wordCount > 150 ? "text-yellow-600" : "text-green-600"
              )}>
                {analysis.wordCount} words
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">50-150 recommended</span>
            </div>
          </div>
          
          <Textarea
            id="summary"
            value={currentSummary}
            onChange={(e) => setCurrentSummary(e.target.value)}
            placeholder="Write a compelling summary of your professional background, key achievements, and career goals. Focus on what makes you unique and valuable to potential employers..."
            rows={6}
            className="resize-none"
          />
          
          <div className="text-xs text-gray-500">
            Tip: Use specific metrics, action verbs, and industry keywords to make your summary stand out.
          </div>
        </div>

        {/* Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Summary Analysis</Label>
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold",
              getScoreBg(analysis.readabilityScore)
            )}>
              <span className={getScoreColor(analysis.readabilityScore)}>
                {analysis.readabilityScore}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-800">{analysis.wordCount}</div>
              <div className="text-xs text-gray-600">Words</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-800">
                {analysis.hasNumbers ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-600">Metrics</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-800">
                {analysis.hasActionVerbs ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-600">Action Verbs</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-800">{analysis.readabilityScore}%</div>
              <div className="text-xs text-gray-600">ATS Score</div>
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-orange-700">Suggestions for Improvement</Label>
              <div className="space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-800">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhancement Tips */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Enhancement Tips</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enhancementSuggestions.map((tip) => {
              const Icon = tip.icon
              return (
                <div key={tip.type} className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">{tip.title}</h4>
                      <p className="text-xs text-blue-700 mb-1">{tip.description}</p>
                      <div className="text-xs text-blue-600">
                        Examples: {tip.examples.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <Separator />
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSave(currentSummary)} 
            disabled={!currentSummary.trim() || analysis.wordCount < 20}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Summary' : 'Save Summary'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Summary display component
const SummaryDisplay = ({
  summary,
  onEdit
}: {
  summary: string
  onEdit: () => void
}) => {
  const analysis = analyzeSummary(summary)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
                <Badge className={cn(
                  "text-xs",
                  analysis.readabilityScore >= 80 ? "bg-green-100 text-green-800" :
                  analysis.readabilityScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                )}>
                  {analysis.readabilityScore}% ATS Score
                </Badge>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{summary}</p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {analysis.wordCount} words
                </span>
                {analysis.hasNumbers && (
                  <span className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    Quantified
                  </span>
                )}
                {analysis.hasActionVerbs && (
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Action-focused
                  </span>
                )}
              </div>
            </div>
            
            {/* Edit Button */}
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {/* Suggestions (if any) */}
          {analysis.suggestions.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Optimization Suggestions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {analysis.suggestions.slice(0, 2).map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Summary Section Component
interface SummarySectionProps {
  summary: string
  onUpdate: (summary: string) => void
  className?: string
}

export default function SummarySection({
  summary,
  onUpdate,
  className
}: SummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (newSummary: string) => {
    onUpdate(newSummary)
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
          <h2 className="text-xl font-semibold text-gray-900">Professional Summary</h2>
          <p className="text-sm text-gray-600">
            Write a compelling overview of your professional background and key achievements.
          </p>
        </div>
        {!isEditing && summary && (
          <Button onClick={() => setIsEditing(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Edit Summary
          </Button>
        )}
      </div>

      {/* Content */}
      {isEditing || !summary ? (
        <SummaryForm
          summary={summary}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={!!summary}
        />
      ) : (
        <SummaryDisplay
          summary={summary}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Summary Best Practices</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Keep it concise: 2-4 sentences or 50-150 words</li>
                <li>• Start with your years of experience and expertise area</li>
                <li>• Include 2-3 key achievements with specific metrics</li>
                <li>• End with your career goals or value proposition</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}