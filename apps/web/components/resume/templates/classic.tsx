"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Star, Loader2, Briefcase } from "lucide-react";

interface ClassicTemplateProps {
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function ClassicTemplate({
  onSelect,
  isSelected,
}: ClassicTemplateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const templateInfo = {
    name: "Classic Professional",
    description: "Traditional resume layout perfect for corporate positions",
    downloads: 1850,
    rating: 4.7,
    pdfUrl: "/templates/Accounting-Executive-Editable.pdf",
    previewUrl:
     "/templates/Accounting-Executive-Editable-Resume-Template-Download-in-docx-11-1.png", // ← Your PNG preview
    features: [
      "Clean, professional layout",
      "Traditional structure",
      "Perfect for corporate roles",
      "Easy to read format",
      "Standard business style",
    ],
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = templateInfo.pdfUrl;
      link.download = `Classic_Professional_Resume_Template.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            {templateInfo.name}
          </CardTitle>
          {isSelected && (
            <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{templateInfo.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Template Icon */}
        <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center text-blue-600">
            <Briefcase className="w-16 h-16 mx-auto mb-2" />
            <p className="text-sm font-medium">Classic Professional</p>
            <p className="text-xs">Traditional Layout</p>
          </div>
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
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
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
