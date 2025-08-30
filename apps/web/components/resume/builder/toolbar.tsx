"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Palette,
  Eye,
  EyeOff,
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Copy,
  Trash2,
  Settings,
  Layout,
  FileText,
  Image,
  Link,
  Minus,
  Plus,
  RotateCcw,
  Check,
  X,
  Sparkles,
  Zap,
  Target,
  AlertCircle,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Font options
const fontOptions = [
  { name: 'Arial', value: 'Arial, sans-serif', category: 'Sans Serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif', category: 'Sans Serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif', category: 'Serif' },
  { name: 'Georgia', value: 'Georgia, serif', category: 'Serif' },
  { name: 'Calibri', value: 'Calibri, sans-serif', category: 'Sans Serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Sans Serif' }
]

// Color themes
const colorThemes = [
  { name: 'Professional Blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  { name: 'Classic Black', primary: '#000000', secondary: '#374151', accent: '#6b7280' },
  { name: 'Modern Purple', primary: '#7c3aed', secondary: '#5b21b6', accent: '#8b5cf6' },
  { name: 'Corporate Green', primary: '#059669', secondary: '#047857', accent: '#10b981' },
  { name: 'Creative Orange', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
  { name: 'Elegant Gray', primary: '#374151', secondary: '#1f2937', accent: '#6b7280' }
]

// Formatting options
interface FormattingOptions {
  fontSize: number
  fontFamily: string
  lineHeight: number
  bold: boolean
  italic: boolean
  underline: boolean
  textAlign: 'left' | 'center' | 'right'
  bulletStyle: 'disc' | 'square' | 'circle'
  spacing: number
}

// Quick Actions Component
const QuickActions = ({ 
  onSave, 
  onDownload, 
  onUndo, 
  onRedo,
  hasUnsavedChanges,
  canUndo,
  canRedo
}: {
  onSave?: () => void
  onDownload?: () => void
  onUndo?: () => void
  onRedo?: () => void
  hasUnsavedChanges?: boolean
  canUndo?: boolean
  canRedo?: boolean
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2"
      >
        <Redo className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        disabled={!hasUnsavedChanges}
        className="p-2"
      >
        <Save className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDownload}
        className="p-2"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  )
}

// Text Formatting Component
const TextFormatting = ({ 
  formatting, 
  onFormattingChange 
}: {
  formatting: FormattingOptions
  onFormattingChange: (updates: Partial<FormattingOptions>) => void
}) => {
  return (
    <div className="space-y-4">
      {/* Font Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Family</Label>
          <select
            value={formatting.fontFamily}
            onChange={(e) => onFormattingChange({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Size</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFormattingChange({ fontSize: Math.max(8, formatting.fontSize - 1) })}
              className="p-1 h-8 w-8"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Input
              type="number"
              value={formatting.fontSize}
              onChange={(e) => onFormattingChange({ fontSize: parseInt(e.target.value) || 12 })}
              className="w-16 text-center text-sm"
              min="8"
              max="24"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFormattingChange({ fontSize: Math.min(24, formatting.fontSize + 1) })}
              className="p-1 h-8 w-8"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Text Style Controls */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Text Style</Label>
        <div className="flex items-center space-x-2">
          <Button
            variant={formatting.bold ? "default" : "outline"}
            size="sm"
            onClick={() => onFormattingChange({ bold: !formatting.bold })}
            className="p-2"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={formatting.italic ? "default" : "outline"}
            size="sm"
            onClick={() => onFormattingChange({ italic: !formatting.italic })}
            className="p-2"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={formatting.underline ? "default" : "outline"}
            size="sm"
            onClick={() => onFormattingChange({ underline: !formatting.underline })}
            className="p-2"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Text Alignment</Label>
        <div className="flex items-center space-x-2">
          <Button
            variant={formatting.textAlign === 'left' ? "default" : "outline"}
            size="sm"
            onClick={() => onFormattingChange({ textAlign: 'left' })}
            className="p-2"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={formatting.textAlign === 'center' ? "default" : "outline"}
            size="sm"
            onClick={() => onFormattingChange({ textAlign: 'center' })}
            className="p-2"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={formatting.textAlign === 'right' ? "default" : "outline"}
            size="sm"
            onClick={() => onFormattingChange({ textAlign: 'right' })}
            className="p-2"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Line Height: {formatting.lineHeight}</Label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={formatting.lineHeight}
          onChange={(e) => onFormattingChange({ lineHeight: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Spacing */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Section Spacing: {formatting.spacing}px</Label>
        <input
          type="range"
          min="0"
          max="40"
          step="2"
          value={formatting.spacing}
          onChange={(e) => onFormattingChange({ spacing: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  )
}

// Color Theme Component
const ColorThemeSelector = ({ 
  selectedTheme, 
  onThemeChange 
}: {
  selectedTheme?: string
  onThemeChange: (theme: typeof colorThemes[0]) => void
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Color Theme</Label>
      <div className="grid grid-cols-1 gap-3">
        {colorThemes.map((theme) => (
          <Card
            key={theme.name}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedTheme === theme.name ? "ring-2 ring-blue-500" : ""
            )}
            onClick={() => onThemeChange(theme)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{theme.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                </div>
                {selectedTheme === theme.name && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ATS Optimization Component
const ATSOptimization = ({ 
  score, 
  suggestions 
}: {
  score?: number
  suggestions?: string[]
}) => {
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
    <div className="space-y-4">
      {/* ATS Score */}
      <div className="text-center">
        <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold", getScoreBg(score || 0))}>
          <span className={getScoreColor(score || 0)}>{score || 0}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">ATS Compatibility Score</p>
      </div>

      {/* Quick Tips */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4" />
          Quick Improvements
        </Label>
        {suggestions?.slice(0, 3).map((suggestion, index) => (
          <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">{suggestion}</p>
          </div>
        )) || (
          <div className="text-center py-4">
            <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Add content to get ATS suggestions</p>
          </div>
        )}
      </div>

      {/* ATS Best Practices */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">ATS Best Practices</Label>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Use standard section headings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Include relevant keywords</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-600" />
            <span>Avoid images and graphics</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-3 h-3 text-yellow-600" />
            <span>Use simple formatting</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Template Settings Component
const TemplateSettings = ({ 
  template, 
  margins, 
  onMarginsChange,
  onTemplateSwitch 
}: {
  template?: string
  margins?: { top: number; bottom: number; left: number; right: number }
  onMarginsChange?: (margins: { top: number; bottom: number; left: number; right: number }) => void
  onTemplateSwitch?: () => void
}) => {
  return (
    <div className="space-y-4">
      {/* Current Template */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Current Template</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4 text-gray-600" />
            <span className="text-sm capitalize">{template || 'ATS Professional'}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onTemplateSwitch}>
            Switch
          </Button>
        </div>
      </div>

      {/* Page Margins */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Page Margins (inches)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Top</Label>
            <Input
              type="number"
              value={margins?.top || 0.5}
              onChange={(e) => onMarginsChange?.({ ...margins!, top: parseFloat(e.target.value) })}
              step="0.1"
              min="0.25"
              max="2"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Bottom</Label>
            <Input
              type="number"
              value={margins?.bottom || 0.5}
              onChange={(e) => onMarginsChange?.({ ...margins!, bottom: parseFloat(e.target.value) })}
              step="0.1"
              min="0.25"
              max="2"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Left</Label>
            <Input
              type="number"
              value={margins?.left || 0.5}
              onChange={(e) => onMarginsChange?.({ ...margins!, left: parseFloat(e.target.value) })}
              step="0.1"
              min="0.25"
              max="2"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Right</Label>
            <Input
              type="number"
              value={margins?.right || 0.5}
              onChange={(e) => onMarginsChange?.({ ...margins!, right: parseFloat(e.target.value) })}
              step="0.1"
              min="0.25"
              max="2"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="outline" size="sm" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset to Default
      </Button>
    </div>
  )
}

// Main Toolbar Component
interface ResumeToolbarProps {
  formatting?: FormattingOptions
  onFormattingChange?: (updates: Partial<FormattingOptions>) => void
  selectedTheme?: string
  onThemeChange?: (theme: typeof colorThemes[0]) => void
  template?: string
  margins?: { top: number; bottom: number; left: number; right: number }
  onMarginsChange?: (margins: { top: number; bottom: number; left: number; right: number }) => void
  atsScore?: number
  atsSuggestions?: string[]
  hasUnsavedChanges?: boolean
  canUndo?: boolean
  canRedo?: boolean
  onSave?: () => void
  onDownload?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onTemplateSwitch?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export default function ResumeToolbar({
  formatting = {
    fontSize: 12,
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.5,
    bold: false,
    italic: false,
    underline: false,
    textAlign: 'left',
    bulletStyle: 'disc',
    spacing: 16
  },
  onFormattingChange,
  selectedTheme,
  onThemeChange,
  template,
  margins = { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
  onMarginsChange,
  atsScore = 85,
  atsSuggestions = [
    "Add more relevant keywords from the job description",
    "Use standard section headings like 'Work Experience'",
    "Include quantifiable achievements with numbers"
  ],
  hasUnsavedChanges = false,
  canUndo = false,
  canRedo = false,
  onSave,
  onDownload,
  onUndo,
  onRedo,
  onTemplateSwitch,
  isCollapsed = false,
  onToggleCollapse,
  className
}: ResumeToolbarProps) {
  const [activeTab, setActiveTab] = useState('formatting')

  const handleFormattingChange = (updates: Partial<FormattingOptions>) => {
    onFormattingChange?.(updates)
  }

  const handleThemeChange = (theme: typeof colorThemes[0]) => {
    onThemeChange?.(theme)
  }

  if (isCollapsed) {
    return (
      <div className={cn("bg-white border-r border-gray-200 w-12 flex flex-col items-center py-4 space-y-2", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Separator className="w-8" />
        <QuickActions
          onSave={onSave}
          onDownload={onDownload}
          onUndo={onUndo}
          onRedo={onRedo}
          hasUnsavedChanges={hasUnsavedChanges}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>
    )
  }

  return (
    <div className={cn("bg-white border-r border-gray-200 w-80 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Formatting Tools
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-3 border-b border-gray-200">
        <QuickActions
          onSave={onSave}
          onDownload={onDownload}
          onUndo={onUndo}
          onRedo={onRedo}
          hasUnsavedChanges={hasUnsavedChanges}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="formatting" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="w-3 h-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="ats" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              ATS
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="formatting" className="p-4 m-0">
              <TextFormatting
                formatting={formatting}
                onFormattingChange={handleFormattingChange}
              />
            </TabsContent>

            <TabsContent value="colors" className="p-4 m-0">
              <ColorThemeSelector
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
              />
            </TabsContent>

            <TabsContent value="layout" className="p-4 m-0">
              <TemplateSettings
                template={template}
                margins={margins}
                onMarginsChange={onMarginsChange}
                onTemplateSwitch={onTemplateSwitch}
              />
            </TabsContent>

            <TabsContent value="ats" className="p-4 m-0">
              <ATSOptimization
                score={atsScore}
                suggestions={atsSuggestions}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last saved: 2 min ago</span>
          <Badge variant="outline" className="text-xs">
            {hasUnsavedChanges ? 'Unsaved' : 'Saved'}
          </Badge>
        </div>
      </div>
    </div>
  )
}