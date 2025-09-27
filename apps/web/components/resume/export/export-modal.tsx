'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { usePdfExport, ExportOptions } from '../../../hooks/use-pdf-export';
import { useResumeStore } from '../../../store/resume-store';
import { 
  Download, 
  FileText, 
  Image, 
  Code, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  children: React.ReactNode;
  resumeElementId?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  children, 
  resumeElementId = 'resume-preview' 
}) => {
  const { currentResume } = useResumeStore();
  const { 
    exportToPdf, 
    exportToDocx, 
    exportToHtml, 
    exportToPng,
    exportMultipleFormats,
    isExporting, 
    progress 
  } = usePdfExport();

  const [open, setOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    quality: 'high',
    includeAnalysis: false,
  });
  const [selectedFormats, setSelectedFormats] = useState<ExportOptions['format'][]>(['pdf']);
  const [customFilename, setCustomFilename] = useState('');

  const formatOptions = [
    {
      value: 'pdf' as const,
      label: 'PDF',
      description: 'Portable Document Format - Best for sharing and printing',
      icon: FileText,
      pros: ['Universal compatibility', 'Preserves formatting', 'Print-ready'],
      cons: ['Not editable'],
    },
    {
      value: 'docx' as const,
      label: 'DOCX',
      description: 'Microsoft Word Document - Editable format',
      icon: FileText,
      pros: ['Editable', 'ATS-friendly', 'Widely accepted'],
      cons: ['May lose some formatting'],
    },
    {
      value: 'html' as const,
      label: 'HTML',
      description: 'Web format - Perfect for online portfolios',
      icon: Code,
      pros: ['Web-ready', 'Interactive elements', 'Responsive'],
      cons: ['Requires web browser'],
    },
    {
      value: 'png' as const,
      label: 'PNG',
      description: 'Image format - For quick previews and social sharing',
      icon: Image,
      pros: ['High quality', 'Easy to share', 'Universal viewing'],
      cons: ['Not searchable text', 'Large file size'],
    },
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low (Fast)', description: 'Smaller file size, faster export' },
    { value: 'medium', label: 'Medium (Balanced)', description: 'Good quality and reasonable file size' },
    { value: 'high', label: 'High (Best)', description: 'Best quality, larger file size' },
  ];

  const handleSingleExport = async (format: ExportOptions['format']) => {
    if (!currentResume) {
      toast.error('No resume to export');
      return;
    }

    const filename = customFilename || currentResume.title || 'resume';

    try {
      switch (format) {
        case 'pdf':
          await exportToPdf(resumeElementId, `${filename}.pdf`, exportOptions);
          break;
        case 'docx':
          await exportToDocx(`${filename}.docx`);
          break;
        case 'html':
          await exportToHtml(resumeElementId, `${filename}.html`);
          break;
        case 'png':
          await exportToPng(resumeElementId, `${filename}.png`, exportOptions);
          break;
      }
      setOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleMultipleExport = async () => {
    if (!currentResume || selectedFormats.length === 0) {
      toast.error('Please select at least one format');
      return;
    }

    const filename = customFilename || currentResume.title || 'resume';

    try {
      await exportMultipleFormats(resumeElementId, selectedFormats, filename);
      setOpen(false);
      toast.success(`Exported ${selectedFormats.length} formats successfully!`);
    } catch (error) {
      console.error('Multiple export failed:', error);
    }
  };

  const toggleFormat = (format: ExportOptions['format']) => {
    setSelectedFormats(prev => 
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Resume
          </DialogTitle>
        </DialogHeader>

        {isExporting && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-medium">Exporting resume...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">
              {progress < 30 && "Preparing export..."}
              {progress >= 30 && progress < 70 && "Generating content..."}
              {progress >= 70 && "Finalizing export..."}
            </p>
          </div>
        )}

        <Tabs defaultValue="single" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Format</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Formats</TabsTrigger>
          </TabsList>

          {/* Single Format Export */}
          <TabsContent value="single" className="space-y-6">
            <div className="grid gap-4">
              {formatOptions.map((format) => {
                const IconComponent = format.icon;
                const isSelected = exportOptions.format === format.value;
                
                return (
                  <div
                    key={format.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: format.value }))}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 mt-0.5 text-gray-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{format.label}</h3>
                          {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-1">Pros:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {format.pros.map((pro, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-orange-600 mb-1">Cons:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {format.cons.map((con, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3 text-orange-500" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Export Options */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <h3 className="font-medium">Export Settings</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filename">Filename</Label>
                  <input
                    id="filename"
                    type="text"
                    placeholder={currentResume?.title || 'resume'}
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select 
                    value={exportOptions.quality} 
                    onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-analysis"
                  checked={exportOptions.includeAnalysis}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeAnalysis: !!checked }))
                  }
                />
                <Label htmlFor="include-analysis" className="text-sm">
                  Include ATS analysis report
                </Label>
              </div>
            </div>

            <Button
              onClick={() => handleSingleExport(exportOptions.format)}
              disabled={isExporting || !currentResume}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export as {exportOptions.format.toUpperCase()}
                </>
              )}
            </Button>
          </TabsContent>

          {/* Multiple Format Export */}
          <TabsContent value="multiple" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Select formats to export:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {formatOptions.map((format) => {
                    const IconComponent = format.icon;
                    const isSelected = selectedFormats.includes(format.value);
                    
                    return (
                      <div
                        key={format.value}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleFormat(format.value)}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{format.label}</span>
                          {isSelected && <CheckCircle className="h-4 w-4 text-blue-500 ml-auto" />}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{format.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedFormats.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Selected formats:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFormats.map((format) => (
                      <Badge key={format} variant="secondary">
                        {format.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleMultipleExport}
              disabled={isExporting || !currentResume || selectedFormats.length === 0}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting {selectedFormats.length} formats...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export {selectedFormats.length} formats
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};