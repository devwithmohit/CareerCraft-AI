"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus,
  X,
  Code,
  Zap,
  Search,
  Target,
  TrendingUp,
  Star,
  Lightbulb,
  Brain,
  Users,
  Briefcase,
  Settings,
  Database,
  Globe,
  Monitor,
  Smartphone,
  Cloud,
  Shield,
  BarChart,
  Edit,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Skill categories and suggestions
const skillCategories = {
  'Programming Languages': {
    icon: Code,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    skills: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 
      'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL'
    ]
  },
  'Frontend Development': {
    icon: Monitor,
    color: 'bg-green-100 text-green-800 border-green-200',
    skills: [
      'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Sass', 'Less', 
      'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Next.js', 'Nuxt.js', 
      'Webpack', 'Vite', 'Responsive Design', 'Progressive Web Apps'
    ]
  },
  'Backend Development': {
    icon: Database,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    skills: [
      'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 
      'Ruby on Rails', 'ASP.NET', 'FastAPI', 'GraphQL', 'REST APIs', 
      'Microservices', 'WebSockets', 'Server-side Rendering'
    ]
  },
  'Database & Storage': {
    icon: Database,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    skills: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 
      'SQLite', 'Oracle', 'SQL Server', 'Cassandra', 'DynamoDB', 
      'Firebase', 'Supabase', 'Database Design', 'Data Modeling'
    ]
  },
  'Cloud & DevOps': {
    icon: Cloud,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    skills: [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 
      'GitLab CI/CD', 'GitHub Actions', 'Terraform', 'Ansible', 'Vagrant', 
      'Nginx', 'Apache', 'Load Balancing', 'Auto Scaling'
    ]
  },
  'Mobile Development': {
    icon: Smartphone,
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    skills: [
      'React Native', 'Flutter', 'iOS Development', 'Android Development', 
      'Xamarin', 'Ionic', 'Cordova', 'Swift', 'Kotlin', 'Objective-C', 
      'Mobile UI/UX', 'App Store Optimization'
    ]
  },
  'Data Science & AI': {
    icon: Brain,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    skills: [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 
      'Pandas', 'NumPy', 'Jupyter', 'Data Visualization', 'Statistical Analysis', 
      'Natural Language Processing', 'Computer Vision', 'Big Data', 'Apache Spark'
    ]
  },
  'Design & UX': {
    icon: Edit,
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    skills: [
      'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 
      'Principle', 'Framer', 'Prototyping', 'User Research', 'Wireframing', 
      'Design Systems', 'Accessibility', 'Usability Testing'
    ]
  },
  'Security': {
    icon: Shield,
    color: 'bg-red-100 text-red-800 border-red-200',
    skills: [
      'Cybersecurity', 'Penetration Testing', 'OWASP', 'SSL/TLS', 'OAuth', 
      'JWT', 'Encryption', 'Security Auditing', 'Vulnerability Assessment', 
      'Network Security', 'Application Security', 'Compliance'
    ]
  },
  'Analytics & Marketing': {
    icon: BarChart,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    skills: [
      'Google Analytics', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 
      'Email Marketing', 'A/B Testing', 'Conversion Optimization', 'Marketing Automation', 
      'HubSpot', 'Salesforce', 'Data Analysis'
    ]
  },
  'Soft Skills': {
    icon: Users,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    skills: [
      'Leadership', 'Team Management', 'Project Management', 'Communication', 
      'Problem Solving', 'Critical Thinking', 'Agile/Scrum', 'Public Speaking', 
      'Mentoring', 'Cross-functional Collaboration', 'Time Management', 'Adaptability'
    ]
  },
  'Tools & Platforms': {
    icon: Settings,
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    skills: [
      'Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Slack', 'Discord', 
      'Notion', 'Linear', 'Postman', 'Insomnia', 'Visual Studio Code', 
      'IntelliJ IDEA', 'Vim', 'Docker Desktop', 'Figma'
    ]
  }
}

// Skill proficiency levels
const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner', description: 'Basic knowledge', color: 'bg-gray-100 text-gray-700' },
  { value: 'intermediate', label: 'Intermediate', description: '1-2 years experience', color: 'bg-blue-100 text-blue-700' },
  { value: 'advanced', label: 'Advanced', description: '3-5 years experience', color: 'bg-green-100 text-green-700' },
  { value: 'expert', label: 'Expert', description: '5+ years experience', color: 'bg-purple-100 text-purple-700' }
]

// Skill interface
interface Skill {
  id: string
  name: string
  category?: string
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience?: number
  featured?: boolean
}

// Skills management component
const SkillsManager = ({ 
  skills, 
  onUpdate 
}: {
  skills: Skill[]
  onUpdate: (skills: Skill[]) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [newSkillName, setNewSkillName] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Add skill
  const addSkill = (skillName: string, category?: string) => {
    if (skillName.trim() && !skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: skillName.trim(),
        category: category,
        proficiency: 'intermediate',
        featured: false
      }
      onUpdate([...skills, newSkill])
      setNewSkillName('')
    }
  }

  // Remove skill
  const removeSkill = (skillId: string) => {
    onUpdate(skills.filter(s => s.id !== skillId))
  }

  // Update skill
  const updateSkill = (skillId: string, updates: Partial<Skill>) => {
    onUpdate(skills.map(s => s.id === skillId ? { ...s, ...updates } : s))
  }

  // Toggle featured skill
  const toggleFeatured = (skillId: string) => {
    updateSkill(skillId, { featured: !skills.find(s => s.id === skillId)?.featured })
  }

  // Get filtered suggestions
  const getFilteredSuggestions = () => {
    if (!selectedCategory) return []
    const categorySkills = skillCategories[selectedCategory as keyof typeof skillCategories]?.skills || []
    return categorySkills.filter(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !skills.find(s => s.name.toLowerCase() === skill.toLowerCase())
    ).slice(0, 12)
  }

  // Get skills by category
  const getSkillsByCategory = () => {
    const categorized: { [key: string]: Skill[] } = {}
    const uncategorized: Skill[] = []

    skills.forEach(skill => {
      if (skill.category && skillCategories[skill.category as keyof typeof skillCategories]) {
        if (!categorized[skill.category]) {
          categorized[skill.category] = []
        }
        categorized[skill.category].push(skill)
      } else {
        uncategorized.push(skill)
      }
    })

    return { categorized, uncategorized }
  }

  const { categorized, uncategorized } = getSkillsByCategory()

  return (
    <div className="space-y-6">
      {/* Add Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Manual skill input */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Enter a skill (e.g., React, Python, Leadership)..."
                onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkillName)}
              />
            </div>
            <Button 
              onClick={() => addSkill(newSkillName)}
              disabled={!newSkillName.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Category tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="">All</TabsTrigger>
              <TabsTrigger value="Programming Languages">Code</TabsTrigger>
              <TabsTrigger value="Frontend Development">Frontend</TabsTrigger>
              <TabsTrigger value="Backend Development">Backend</TabsTrigger>
              <TabsTrigger value="Cloud & DevOps">Cloud</TabsTrigger>
              <TabsTrigger value="Soft Skills">Soft</TabsTrigger>
            </TabsList>

            {/* Skill suggestions */}
            {selectedCategory && (
              <TabsContent value={selectedCategory} className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {selectedCategory} Skills
                    </Label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search skills..."
                        className="pl-10 w-48"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {getFilteredSuggestions().map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill, selectedCategory)}
                        className="text-left p-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded border transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Current Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Your Skills ({skills.length})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Simple View' : 'Advanced Options'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {skills.length === 0 ? (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
              <p className="text-gray-600">Add your technical and soft skills to showcase your expertise.</p>
            </div>
          ) : (
            <>
              {/* Featured Skills */}
              {skills.some(s => s.featured) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <Label className="text-sm font-medium">Featured Skills</Label>
                    <Badge variant="outline" className="text-xs">
                      Shown prominently on resume
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(skill => skill.featured)
                      .map((skill) => (
                        <SkillBadge
                          key={skill.id}
                          skill={skill}
                          onRemove={() => removeSkill(skill.id)}
                          onUpdate={(updates) => updateSkill(skill.id, updates)}
                          onToggleFeatured={() => toggleFeatured(skill.id)}
                          showAdvanced={showAdvanced}
                          featured
                        />
                      ))}
                  </div>
                  <Separator />
                </div>
              )}

              {/* Categorized Skills */}
              {Object.entries(categorized).map(([category, categorySkills]) => {
                const categoryConfig = skillCategories[category as keyof typeof skillCategories]
                if (!categoryConfig) return null

                const Icon = categoryConfig.icon
                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <Label className="text-sm font-medium">{category}</Label>
                      <Badge variant="outline" className="text-xs">
                        {categorySkills.length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <SkillBadge
                          key={skill.id}
                          skill={skill}
                          onRemove={() => removeSkill(skill.id)}
                          onUpdate={(updates) => updateSkill(skill.id, updates)}
                          onToggleFeatured={() => toggleFeatured(skill.id)}
                          showAdvanced={showAdvanced}
                          categoryColor={categoryConfig.color}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Uncategorized Skills */}
              {uncategorized.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-600">Other Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {uncategorized.map((skill) => (
                      <SkillBadge
                        key={skill.id}
                        skill={skill}
                        onRemove={() => removeSkill(skill.id)}
                        onUpdate={(updates) => updateSkill(skill.id, updates)}
                        onToggleFeatured={() => toggleFeatured(skill.id)}
                        showAdvanced={showAdvanced}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Skills Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Skills Optimization Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Include both technical and soft skills relevant to your target role</li>
                <li>• Use specific technologies and tools rather than general terms</li>
                <li>• Feature your strongest skills that match job requirements</li>
                <li>• Keep the list concise - quality over quantity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Individual skill badge component
const SkillBadge = ({
  skill,
  onRemove,
  onUpdate,
  onToggleFeatured,
  showAdvanced,
  featured = false,
  categoryColor = 'bg-gray-100 text-gray-800 border-gray-200'
}: {
  skill: Skill
  onRemove: () => void
  onUpdate: (updates: Partial<Skill>) => void
  onToggleFeatured: () => void
  showAdvanced: boolean
  featured?: boolean
  categoryColor?: string
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(skill.name)

  const handleSave = () => {
    if (editedName.trim() && editedName !== skill.name) {
      onUpdate({ name: editedName.trim() })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedName(skill.name)
    setIsEditing(false)
  }

  const getProficiencyColor = (proficiency?: string) => {
    const level = proficiencyLevels.find(l => l.value === proficiency)
    return level?.color || 'bg-gray-100 text-gray-700'
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 p-1 border rounded-lg bg-white">
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          className="h-6 text-xs"
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
          <CheckCircle className="w-3 h-3 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
          <X className="w-3 h-3 text-red-600" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(
      "group flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition-all",
      featured ? "ring-2 ring-yellow-300 bg-yellow-50 text-yellow-800 border-yellow-200" : categoryColor
    )}>
      {featured && <Star className="w-3 h-3 text-yellow-600" />}
      
      <span className="font-medium">{skill.name}</span>
      
      {showAdvanced && skill.proficiency && (
        <Badge 
          variant="outline" 
          className={cn("text-xs ml-1", getProficiencyColor(skill.proficiency))}
        >
          {skill.proficiency}
        </Badge>
      )}

      <div className="hidden group-hover:flex items-center gap-1 ml-1">
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Edit className="w-3 h-3" />
        </button>
        <button
          onClick={onToggleFeatured}
          className={cn(
            "transition-colors",
            skill.featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"
          )}
        >
          <Star className="w-3 h-3" />
        </button>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

// Main Skills Section Component
interface SkillsSectionProps {
  skills: string[] | Skill[]
  onUpdate: (skills: string[] | Skill[]) => void
  className?: string
}

export default function SkillsSection({
  skills,
  onUpdate,
  className
}: SkillsSectionProps) {
  // Convert string array to Skill objects if needed
  const skillObjects: Skill[] = skills.map((skill, index) => {
    if (typeof skill === 'string') {
      return {
        id: index.toString(),
        name: skill,
        proficiency: 'intermediate',
        featured: false
      }
    }
    return skill
  })

  const handleUpdate = (newSkills: Skill[]) => {
    // If original was string array, convert back to strings
    if (skills.length > 0 && typeof skills[0] === 'string') {
      onUpdate(newSkills.map(skill => skill.name))
    } else {
      onUpdate(newSkills)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Skills & Expertise</h2>
          <p className="text-sm text-gray-600">
            Showcase your technical skills, tools, and competencies.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          ATS Optimized
        </Badge>
      </div>

      {/* Skills Manager */}
      <SkillsManager
        skills={skillObjects}
        onUpdate={handleUpdate}
      />
    </div>
  )
}