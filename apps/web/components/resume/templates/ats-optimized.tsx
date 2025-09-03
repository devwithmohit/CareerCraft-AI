// "use client";

// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Download,
//   FileText,
//   Star,
//   Loader2,
//   CheckCircle,
//   AlertTriangle,
// } from "lucide-react";

// interface ATSOptimizedTemplateProps {
//   onSelect?: () => void;
//   isSelected?: boolean;
// }

// interface TemplateProps {
//   data?: typeof sampleResumeData;
//   zoom?: number;
// }
// export default function ATSOptimizedTemplate({
//   {data, zoom = 1}: TemplateProps ,{
//   onSelect,
//   isSelected,
// }: ATSOptimizedTemplateProps) {
//   const [isDownloading, setIsDownloading] = useState(false);

//   const templateInfo = {
//     name: "ATS-Optimized",
//     description: "Designed specifically for Applicant Tracking Systems",
//     downloads: 2100,
//     rating: 4.9,
//     pdfUrl: "/templates/ats-optimized-resume.pdf",
//     previewUrl: "/templates/ats-optimized-resume.png", // ← Absolute path from domain root
//     features: [
//       "ATS-friendly formatting",
//       "Keyword optimization",
//       "Clean, scannable layout",
//       "Standard fonts",
//       "No graphics or complex formatting",
//     ],
//     atsScore: 95,
//     compatibility: "High",
//   };

//   const handleDownload = async () => {
//     setIsDownloading(true);
//     try {
//       const link = document.createElement("a");
//       link.href = templateInfo.pdfUrl;
//       link.download = `ATS_Optimized_Resume_Template.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Download failed:", error);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return (
//     <Card
//       className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
//         isSelected ? "ring-2 ring-green-500 shadow-lg" : ""
//       }`}
//       onClick={onSelect}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg flex items-center gap-2">
//             <CheckCircle className="w-5 h-5 text-green-600" />
//             {templateInfo.name}
//           </CardTitle>
//           {isSelected && (
//             <Badge className="bg-green-100 text-green-800">Selected</Badge>
//           )}
//         </div>
//         <p className="text-sm text-gray-600">{templateInfo.description}</p>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {/* ATS Score */}
//         <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-green-800">
//               ATS Compatibility
//             </span>
//             <Badge className="text-green-600 bg-green-100">
//               {templateInfo.compatibility}
//             </Badge>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="flex-1 bg-green-200 rounded-full h-2">
//               <div
//                 className="bg-green-600 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${templateInfo.atsScore}%` }}
//               />
//             </div>
//             <span className="text-sm font-bold text-green-700">
//               {templateInfo.atsScore}%
//             </span>
//           </div>
//         </div>

//         {/* Template Preview - NOW SHOWS YOUR PNG */}
//         <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg overflow-hidden border-2 border-dashed border-green-200">
//           {templateInfo.previewUrl ? (
//             <img 
//               src={templateInfo.previewUrl} 
//               alt={`${templateInfo.name} preview`}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 // Fallback if PNG doesn't load
//                 e.currentTarget.style.display = 'none'
//                 e.currentTarget.parentElement!.innerHTML = `
//                   <div class="w-full h-full flex items-center justify-center text-green-600">
//                     <div class="text-center">
//                       <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
//                       </svg>
//                       <p class="text-sm font-medium">ATS-Optimized</p>
//                       <p class="text-xs">Parser-Friendly Layout</p>
//                     </div>
//                   </div>
//                 `
//               }}
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-green-600">
//               <div className="text-center">
//                 <CheckCircle className="w-16 h-16 mx-auto mb-2" />
//                 <p className="text-sm font-medium">ATS-Optimized</p>
//                 <p className="text-xs">Parser-Friendly Layout</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Stats */}
//         <div className="flex items-center justify-between text-sm text-gray-600">
//           <div className="flex items-center gap-1">
//             <Download className="w-4 h-4" />
//             {templateInfo.downloads} downloads
//           </div>
//           <div className="flex items-center gap-1">
//             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//             {templateInfo.rating}
//           </div>
//         </div>

//         {/* Features */}
//         <div className="space-y-2">
//           <h4 className="font-medium text-sm flex items-center gap-2">
//             <AlertTriangle className="w-4 h-4 text-amber-500" />
//             Features:
//           </h4>
//           <ul className="text-xs text-gray-600 space-y-1">
//             {templateInfo.features.map((feature, index) => (
//               <li key={index} className="flex items-center gap-2">
//                 <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
//                 {feature}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Download Button */}
//         <Button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDownload();
//           }}
//           className="w-full"
//           disabled={isDownloading}
//         >
//           {isDownloading ? (
//             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//           ) : (
//             <Download className="w-4 h-4 mr-2" />
//           )}
//           {isDownloading ? "Downloading..." : "Download Template"}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Star,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ATSOptimizedTemplateProps {
  onSelect?: () => void;
  isSelected?: boolean;
  data?: any; // For preview mode
  zoom?: number; // For preview mode
}

export default function ATSOptimizedTemplate({
  onSelect,
  isSelected,
  data,
  zoom = 1,
}: ATSOptimizedTemplateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const templateInfo = {
    name: "ATS-Optimized",
    description: "Designed specifically for Applicant Tracking Systems",
    downloads: 2100,
    rating: 4.9,
    pdfUrl: "/templates/ats-optimized-resume.pdf",
    previewUrl: "/templates/ats-optimized-resume.png",
    features: [
      "ATS-friendly formatting",
      "Keyword optimization",
      "Clean, scannable layout",
      "Standard fonts",
      "No graphics or complex formatting",
    ],
    atsScore: 95,
    compatibility: "High",
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = templateInfo.pdfUrl;
      link.download = `ATS_Optimized_Resume_Template.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // If data is provided, render the actual resume (preview mode)
  if (data) {
    return (
      <div
        className="bg-white text-black p-8 min-h-full font-serif"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      >
        {/* Render actual resume content here */}
        <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
          <h1 className="text-3xl font-bold mb-2">
            {data.personalInfo?.firstName} {data.personalInfo?.lastName}
          </h1>
          <h2 className="text-xl text-gray-600 mb-3">
            {data.personalInfo?.title}
          </h2>
          {/* Add more resume content based on data */}
        </div>
      </div>
    );
  }

  // Otherwise, render the template card (selector mode)
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? "ring-2 ring-green-500 shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {templateInfo.name}
          </CardTitle>
          {isSelected && (
            <Badge className="bg-green-100 text-green-800">Selected</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{templateInfo.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ATS Score */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">
              ATS Compatibility
            </span>
            <Badge className="text-green-600 bg-green-100">
              {templateInfo.compatibility}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${templateInfo.atsScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-green-700">
              {templateInfo.atsScore}%
            </span>
          </div>
        </div>

        {/* Template Preview - NOW SHOWS YOUR PNG */}
        <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg overflow-hidden border-2 border-dashed border-green-200">
          {templateInfo.previewUrl ? (
            <img
             src={templateInfo.previewUrl}            alt={`${templateInfo.name} preview`}
              className="w-full h-full object-contain max-w-full max-h-full bg-white dark:bg-black"
              style={{ maxWidth: 420, maxHeight: 560 }}
             loading="lazy"
             decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = `...`
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-green-600">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm font-medium">ATS-Optimized</p>
                <p className="text-xs">Parser-Friendly Layout</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {templateInfo.downloads} downloads
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {templateInfo.rating}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Features:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {templateInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Download Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="w-full"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? "Downloading..." : "Download Template"}
        </Button>
      </CardContent>
    </Card>
  );
}