"use client";
import ScoreDisplay from "@/components/resume/analyzer/score-display";
// Update your resume-analysis/page.tsx:
import UploadZone from "@/components/resume/analyzer/upload-zone";
import KeywordAnalysis from "@/components/resume/analyzer/keyword-analysis";
import ImprovementSuggestions from "@/components/resume/analyzer/improvement-suggestions";
export default function ResumeAnalysisPage() {
    const formattedDate = new Date().toLocaleDateString('en-US');
  const handleFileUpload = (files: File[]) => {
    // console.log('Files uploaded:', files)
  };

  const handleAnalysisStart = (file: File) => {
    // console.log('Starting analysis for:', file.name)
    // Navigate to analysis results or trigger analysis
  };

  return (
    <div className="container mx-auto py-8">
      <UploadZone
        onFileUpload={handleFileUpload}
        onAnalysisStart={handleAnalysisStart}
        maxFileSize={10}
        acceptedFileTypes={[".pdf", ".doc", ".docx"]}
      />
      <ScoreDisplay
        overallScore={84}
        fileName="john-doe-resume.pdf"
        // analysisDate={new Date().toLocaleDateString()}
        analysisDate={formattedDate}
        onReanalyze={() => console.log("Reanalyze")}
        onDownloadReport={() => console.log("Download")}
        onShareReport={() => console.log("Share")}
      />
      // In your resume-analysis page:
      <KeywordAnalysis
        fileName="john-doe-resume.pdf"
        jobTitle="Senior Frontend Developer"
        onOptimize={() => console.log("Optimize")}
        onExportKeywords={() => console.log("Export")}
        onCompareWithJob={() => console.log("Compare")}
      />
      <ImprovementSuggestions
  fileName="john-doe-resume.pdf"
  currentScore={75}
  targetScore={90}
  onApplySuggestion={(id) => console.log('Applied:', id)}
  onDismissSuggestion={(id) => console.log('Dismissed:', id)}
  onGenerateReport={() => console.log('Generate Report')}
  onExportSuggestions={() => console.log('Export Suggestions')}
/>
    </div>
  );
}
