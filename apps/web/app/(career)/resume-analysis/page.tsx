"use client";

// import { useState } from "react";
// import UploadZone from '@/components/resume/analyzer/upload-zone'
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Upload, FileText, Brain } from "lucide-react";

// export default function ResumeAnalysisPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const uploadedFile = event.target.files?.[0];
//     if (uploadedFile) {
//       setFile(uploadedFile);
//     }
//   };

//   const analyzeResume = async () => {
//     if (!file) return;

//     setIsAnalyzing(true);
//     // TODO: Implement AI analysis
//     setTimeout(() => {
//       setIsAnalyzing(false);
//     }, 3000);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-4">AI Resume Analysis</h1>
//           <p className="text-xl text-gray-600">
//             Get instant feedback and optimize your resume for ATS systems
//           </p>
//         </div>

//         {/* Upload Section */}
//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Upload className="h-5 w-5" />
//               Upload Your Resume
//             </CardTitle>
//             <CardDescription>
//               Upload a PDF or DOCX file to get AI-powered analysis and
//               suggestions
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <input
//                 type="file"
//                 accept=".pdf,.docx"
//                 onChange={handleFileUpload}
//                 className="hidden"
//                 id="resume-upload"
//               />
//               <label htmlFor="resume-upload" className="cursor-pointer">
//                 <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-lg font-medium mb-2">
//                   {file ? file.name : "Click to upload your resume"}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Supports PDF and DOCX files up to 10MB
//                 </p>
//               </label>
//             </div>

//             {file && (
//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={analyzeResume}
//                   disabled={isAnalyzing}
//                   className="px-8"
//                 >
//                   <Brain className="h-4 w-4 mr-2" />
//                   {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Results Section (Placeholder) */}
//         {isAnalyzing && (
//           <Card>
//             <CardContent className="p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-lg">AI is analyzing your resume...</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

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
