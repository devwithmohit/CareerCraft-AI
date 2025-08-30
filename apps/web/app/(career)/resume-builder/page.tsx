"use client";
import { useState } from "react";
import TemplateSelector from "@/components/resume/builder/template-selector";
import ResumePreview from "@/components/resume/builder/preview";
import ResumeToolbar from "@/components/resume/builder/toolbar";
import ResumeEditor from "@/components/resume/builder/editor";

// Import formatting types from toolbar
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

interface ColorTheme {
  name: string
  primary: string
  secondary: string
  accent: string
}

export default function ResumeBuilderPage() {
  // State for formatting options
  const [formatting, setFormatting] = useState<FormattingOptions>({
    fontSize: 12,
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.5,
    bold: false,
    italic: false,
    underline: false,
    textAlign: 'left',
    bulletStyle: 'disc',
    spacing: 16
  });

  // State for selected theme
  const [selectedTheme, setSelectedTheme] = useState<string>('Professional Blue');

  // State for margins
  const [margins, setMargins] = useState({ top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 });

  // State for ATS score and suggestions
  const [atsScore, setAtsScore] = useState(85);
  const [atsSuggestions, setAtsSuggestions] = useState([
    "Add more relevant keywords from the job description",
    "Use standard section headings like 'Work Experience'",
    "Include quantifiable achievements with numbers"
  ]);

  // State for unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for toolbar collapse
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  // Handlers
  const handleFormattingChange = (updates: Partial<FormattingOptions>) => {
    setFormatting(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleThemeChange = (theme: ColorTheme) => {
    setSelectedTheme(theme.name);
    setHasUnsavedChanges(true);
  };

  const handleMarginsChange = (newMargins: { top: number; bottom: number; left: number; right: number }) => {
    setMargins(newMargins);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving resume...');
    setHasUnsavedChanges(false);
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading PDF...');
  };

  const handleTemplateSwitch = () => {
    // Implement template switch logic here
    console.log('Switching template...');
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
    </div>
  );
}