import { useState, useCallback } from 'react';
import { useResumeStore } from '../store/resume-store';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'png';
  quality?: 'low' | 'medium' | 'high';
  includeAnalysis?: boolean;
  template?: string;
}

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentResume, exportResume } = useResumeStore();

  const exportToPdf = useCallback(async (
    elementId: string, 
    filename?: string, 
    options: Partial<ExportOptions> = {}
  ) => {
    if (!currentResume) {
      toast.error('No resume to export');
      return null;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume element not found');
      }

      // Update progress
      setProgress(20);

      // Configure canvas options
      const canvas = await html2canvas(element, {
        scale: options.quality === 'high' ? 3 : options.quality === 'medium' ? 2 : 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      setProgress(50);

      // Create PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      setProgress(80);

      // Save PDF
      const finalFilename = filename || `${currentResume.title || 'resume'}.pdf`;
      pdf.save(finalFilename);

      setProgress(100);
      toast.success('Resume exported successfully!');

      return pdf.output('blob');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export resume');
      throw error;
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, [currentResume]);

  const exportToDocx = useCallback(async (filename?: string) => {
    if (!currentResume) {
      toast.error('No resume to export');
      return null;
    }

    setIsExporting(true);
    
    try {
      const blob = await exportResume('docx');
      const finalFilename = filename || `${currentResume.title || 'resume'}.docx`;
      
      // Download file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Resume exported to DOCX!');
      return blob;
    } catch (error) {
      console.error('DOCX export failed:', error);
      toast.error('Failed to export to DOCX');
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [currentResume, exportResume]);

  const exportToHtml = useCallback(async (
    elementId: string,
    filename?: string,
    includeStyles = true
  ) => {
    if (!currentResume) {
      toast.error('No resume to export');
      return null;
    }

    setIsExporting(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume element not found');
      }

      let htmlContent = element.outerHTML;

      if (includeStyles) {
        // Get all stylesheets
        const styles = Array.from(document.styleSheets)
          .map(stylesheet => {
            try {
              return Array.from(stylesheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n');

        htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>${currentResume.title || 'Resume'}</title>
              <style>${styles}</style>
            </head>
            <body>
              ${htmlContent}
            </body>
          </html>
        `;
      }

      // Create and download file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const finalFilename = filename || `${currentResume.title || 'resume'}.html`;
      
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Resume exported to HTML!');
      return blob;
    } catch (error) {
      console.error('HTML export failed:', error);
      toast.error('Failed to export to HTML');
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [currentResume]);

  const exportToPng = useCallback(async (
    elementId: string,
    filename?: string,
    options: Partial<ExportOptions> = {}
  ) => {
    if (!currentResume) {
      toast.error('No resume to export');
      return null;
    }

    setIsExporting(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume element not found');
      }

      const canvas = await html2canvas(element, {
        scale: options.quality === 'high' ? 3 : options.quality === 'medium' ? 2 : 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const finalFilename = filename || `${currentResume.title || 'resume'}.png`;
          
          link.href = url;
          link.download = finalFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('Resume exported to PNG!');
        }
      }, 'image/png');

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('PNG export failed:', error);
      toast.error('Failed to export to PNG');
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [currentResume]);

  const exportMultipleFormats = useCallback(async (
    elementId: string,
    formats: ExportOptions['format'][],
    baseFilename?: string
  ) => {
    const results = {};
    
    for (const format of formats) {
      try {
        switch (format) {
          case 'pdf':
            results[format] = await exportToPdf(elementId, `${baseFilename}.pdf`);
            break;
          case 'docx':
            results[format] = await exportToDocx(`${baseFilename}.docx`);
            break;
          case 'html':
            results[format] = await exportToHtml(elementId, `${baseFilename}.html`);
            break;
          case 'png':
            results[format] = await exportToPng(elementId, `${baseFilename}.png`);
            break;
        }
      } catch (error) {
        console.error(`Failed to export ${format}:`, error);
      }
    }

    return results;
  }, [exportToPdf, exportToDocx, exportToHtml, exportToPng]);

  return {
    // State
    isExporting,
    progress,

    // Export functions
    exportToPdf,
    exportToDocx,
    exportToHtml,
    exportToPng,
    exportMultipleFormats,

    // Utility functions
    canExport: !!currentResume,
    supportedFormats: ['pdf', 'docx', 'html', 'png'] as const,
  };
};