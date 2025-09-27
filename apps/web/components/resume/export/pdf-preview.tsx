'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Slider } from '../../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import { ExportModal } from './export-modal';
import { useResumeStore } from '../../../store/resume-store';
import { usePdfExport } from '../../../hooks/use-pdf-export';
import { cn } from '../../../lib/utils';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Eye,
  Monitor,
  Smartphone,
  Printer,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Import template components
import ATSOptimizedTemplate from '../templates/ats-optimized';
import ModernTemplate from '../templates/modern';
import ClassicTemplate from '../templates/classic';
import CreativeTemplate from '../templates/creative';

interface PdfPreviewProps {
  className?: string;
  showControls?: boolean;
  defaultZoom?: number;
  enableFullscreen?: boolean;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile' | 'print';
type PreviewMode = 'interactive' | 'static' | 'pdf';

const TEMPLATE_COMPONENTS = {
  'ats-optimized': ATSOptimizedTemplate,
  'modern': ModernTemplate,
  'classic': ClassicTemplate,
  'creative': CreativeTemplate,
};

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  className,
  showControls = true,
  defaultZoom = 100,
  enableFullscreen = true,
}) => {
  const { currentResume, selectedTemplate } = useResumeStore();
  const { exportToPdf, isExporting } = usePdfExport();
  
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(defaultZoom);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('interactive');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });

  // Template component selection
  const TemplateComponent = TEMPLATE_COMPONENTS[selectedTemplate as keyof typeof TEMPLATE_COMPONENTS] || ATSOptimizedTemplate;

  // View mode configurations
  const viewModeConfig = {
    desktop: { width: '100%', maxWidth: '8.5in', aspectRatio: '8.5/11' },
    tablet: { width: '768px', maxWidth: '768px', aspectRatio: '8.5/11' },
    mobile: { width: '375px', maxWidth: '375px', aspectRatio: '8.5/11' },
    print: { width: '8.5in', height: '11in', maxWidth: 'none' },
  };

  // Update preview dimensions when zoom or view mode changes
  useEffect(() => {
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      setPreviewDimensions({ width: rect.width, height: rect.height });
    }
  }, [zoom, viewMode]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 10));
  const handleZoomReset = () => setZoom(100);
  const handleZoomFit = () => {
    if (previewRef.current) {
      const container = previewRef.current.parentElement;
      if (container) {
        const containerWidth = container.clientWidth - 40; // Account for padding
        const previewWidth = 612; // 8.5 inches at 72 DPI
        const fitZoom = Math.floor((containerWidth / previewWidth) * 100);
        setZoom(Math.min(150, Math.max(50, fitZoom)));
      }
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Refresh preview
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Quick export
  const handleQuickExport = async () => {
    try {
      await exportToPdf('pdf-preview-content');
    } catch (error) {
      setError('Failed to export PDF');
    }
  };

  // Format resume data for template
  const formatResumeData = () => {
    if (!currentResume) return null;

    const personalSection = currentResume.sections.find(s => s.type === 'personal');
    const summarySection = currentResume.sections.find(s => s.type === 'summary');
    const experienceSection = currentResume.sections.find(s => s.type === 'experience');
    const educationSection = currentResume.sections.find(s => s.type === 'education');
    const skillsSection = currentResume.sections.find(s => s.type === 'skills');

    return {
      personalInfo: personalSection?.content || {},
      summary: summarySection?.content?.text || '',
      experience: experienceSection?.content?.jobs || [],
      education: educationSection?.content?.degrees || [],
      skills: [
        ...(skillsSection?.content?.technical || []),
        ...(skillsSection?.content?.soft || []),
      ],
    };
  };

  const resumeData = formatResumeData();

  if (!currentResume) {
    return (
      <Card className={cn('flex items-center justify-center min-h-[400px]', className)}>
        <div className="text-center space-y-3">
          <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">No Resume Selected</h3>
          <p className="text-gray-500">Please select or create a resume to preview</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Controls */}
      {showControls && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">PDF Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedTemplate?.replace('-', ' ').toUpperCase()}
                </Badge>
                {currentResume.atsScore && (
                  <Badge 
                    variant={currentResume.atsScore >= 80 ? 'default' : currentResume.atsScore >= 60 ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    ATS: {currentResume.atsScore}%
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as PreviewMode)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="interactive" className="text-xs">Interactive</TabsTrigger>
                <TabsTrigger value="static" className="text-xs">Static</TabsTrigger>
                <TabsTrigger value="pdf" className="text-xs">PDF View</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center justify-between gap-4">
              {/* View Mode Selection */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View:</span>
                <div className="flex rounded-lg border">
                  {[
                    { mode: 'desktop', icon: Monitor, label: 'Desktop' },
                    { mode: 'tablet', icon: Smartphone, label: 'Tablet' },
                    { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
                    { mode: 'print', icon: Printer, label: 'Print' },
                  ].map(({ mode, icon: Icon, label }) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'ghost'}
                      size="sm"
                      className="rounded-none first:rounded-l-lg last:rounded-r-lg px-3"
                      onClick={() => setViewMode(mode as ViewMode)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={50}
                    max={200}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono min-w-[45px]">{zoom}%</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomFit}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                </Button>
                {enableFullscreen && (
                  <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                )}
                <Separator orientation="vertical" className="h-6" />
                <ExportModal resumeElementId="pdf-preview-content">
                  <Button size="sm" disabled={isExporting}>
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export
                  </Button>
                </ExportModal>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Area */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          {error && (
            <div className="flex items-center justify-center h-32 text-red-600 bg-red-50">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading preview...
            </div>
          )}

          {!error && !isLoading && (
            <div 
              className="h-full overflow-auto bg-gray-100 p-4"
              style={{
                background: viewMode === 'print' ? 'white' : 'rgb(243 244 246)',
              }}
            >
              <div
                ref={previewRef}
                className="mx-auto bg-white shadow-lg"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center top',
                  transition: 'transform 0.2s ease-in-out',
                  ...viewModeConfig[viewMode],
                  minHeight: viewMode === 'print' ? '11in' : 'auto',
                }}
              >
                <div id="pdf-preview-content" className="w-full h-full">
                  {resumeData && (
                    <TemplateComponent
                      data={resumeData}
                      zoom={zoom / 100}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview Info */}
          {showControls && (
            <div className="border-t bg-gray-50 px-4 py-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>Template: {selectedTemplate?.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>Zoom: {zoom}%</span>
                  <span>•</span>
                  <span>View: {viewMode}</span>
                </div>
                <div className="flex items-center gap-2">
                  {previewDimensions.width > 0 && (
                    <span>
                      {Math.round(previewDimensions.width)} × {Math.round(previewDimensions.height)}px
                    </span>
                  )}
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ready for export</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions (Mobile) */}
      <div className="md:hidden mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleZoomFit}>
          <Eye className="h-4 w-4 mr-2" />
          Fit to Screen
        </Button>
        <Button className="flex-1" onClick={handleQuickExport} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default PdfPreview;