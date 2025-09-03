"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star, Loader2, Zap } from "lucide-react";

interface ModernTemplateProps {
  onSelect?: () => void;
  isSelected?: boolean;
  data?: any; // For preview mode
  zoom?: number; // For preview mode
}

export default function ModernTemplate({
  onSelect,
  isSelected,
  data,
  zoom = 1,
}: ModernTemplateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const templateInfo = {
    name: "Modern Tech",
    description: "Contemporary design perfect for tech and startup roles",
    downloads: 2350,
    rating: 4.8,
    pdfUrl: "/templates/Software-Engineer-Editable.pdf",
    previewUrl: "/templates/Software-Engineer-Editable-Resume-Template-Download-in-docx-20.png", // ← PNG preview path
    features: [
      "Contemporary design",
      "Tech-focused layout",
      "Modern typography",
      "Clean sections",
      "Startup-friendly style",
    ],
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = templateInfo.pdfUrl;
      link.download = `Modern_Tech_Resume_Template.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // If data is provided, render the actual resume (preview mode)
  if (data) {
    return (
      <div
        className="bg-white text-black p-8 min-h-full font-sans"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      >
        {/* Modern Tech Resume Layout */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 -m-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {data.personalInfo?.firstName} {data.personalInfo?.lastName}
          </h1>
          <h2 className="text-xl opacity-90 mb-4">{data.personalInfo?.title}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span>📧</span>
              {data.personalInfo?.email}
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span>
              {data.personalInfo?.phone}
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              {data.personalInfo?.location}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-purple-600 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-600"></div>
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-600 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-600"></div>
              Work Experience
            </h3>
            {data.experience?.map((exp: any) => (
              <div key={exp.id} className="mb-6 pl-4 border-l-2 border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">
                      {exp.position}
                    </h4>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded">
                    <p className="font-medium">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-purple-600 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-600"></div>
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the template card (selector mode)
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? "ring-2 ring-purple-500 shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            {templateInfo.name}
          </CardTitle>
          {isSelected && (
            <Badge className="bg-purple-100 text-purple-800">Selected</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{templateInfo.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* PNG Preview Image - REPLACED THE PLACEHOLDER */}
        <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg overflow-hidden border-2 border-dashed border-purple-200">
          {templateInfo.previewUrl ? (
            <img 
              src={templateInfo.previewUrl} 
              alt={`${templateInfo.name} preview`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if PNG doesn't load
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center text-purple-600">
                    <div class="text-center">
                      <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                      <p class="text-sm font-medium">Modern Tech</p>
                      <p class="text-xs">Contemporary Layout</p>
                    </div>
                  </div>
                `
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-600">
              <div className="text-center">
                <Zap className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm font-medium">Modern Tech</p>
                <p className="text-xs">Contemporary Layout</p>
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
          <h4 className="font-medium text-sm">Features:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {templateInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
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
          className="w-full bg-purple-600 hover:bg-purple-700"
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