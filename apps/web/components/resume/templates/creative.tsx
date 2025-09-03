"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Star, Loader2, Palette } from 'lucide-react'

interface CreativeTemplateProps {
  onSelect?: () => void
  isSelected?: boolean
}

export default function CreativeTemplate({ onSelect, isSelected }: CreativeTemplateProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const templateInfo = {
    name: "Creative Design",
    description: "Unique layouts perfect for creative and design fields",
    downloads: 1650,
    rating: 4.6,
    pdfUrl: "/templates/Fashion-Designer-Editable.pdf",
     previewUrl: "/templates/Fashion-Designer-Editable-Resume-Template-Download-in-docx-14-1.png",// ← Your PNG preview
    features: [
      "Creative layout design",
      "Visual impact",
      "Unique styling",
      "Design-focused",
      "Portfolio-friendly"
    ]
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const link = document.createElement('a')
      link.href = templateInfo.pdfUrl
      link.download = `Creative_Design_Resume_Template.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-pink-500 shadow-lg' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-600" />
            {templateInfo.name}
          </CardTitle>
          {isSelected && (
            <Badge className="bg-pink-100 text-pink-800">Selected</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{templateInfo.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Template Icon */}
        <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg flex items-center justify-center border-2 border-dashed border-pink-200">
          <div className="text-center text-pink-600">
            <Palette className="w-16 h-16 mx-auto mb-2" />
            <p className="text-sm font-medium">Creative Design</p>
            <p className="text-xs">Unique Layout</p>
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
                <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Download Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
          className="w-full bg-pink-600 hover:bg-pink-700"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? 'Downloading...' : 'Download Template'}
        </Button>
      </CardContent>
    </Card>
  )
}