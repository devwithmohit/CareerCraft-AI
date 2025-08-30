"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { SparklesCore } from '@/components/ui/sparkles'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { FloatingDock } from '@/components/ui/floating-dock'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye,
  Download,
  RotateCcw,
  Sparkles,
  Zap,
  FileCheck,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom Animated Progress Component
const AnimatedProgress = ({ progress, className }: { progress: number; className?: string }) => {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2 overflow-hidden", className)}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-bounce" 
             style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  )
}

// File type configurations
const fileTypeConfig = [
  {
    id: 1,
    name: "PDF Resume",
    designation: "Best for ATS",
    image: "https://cdn-icons-png.flaticon.com/512/337/337946.png",
    icon: FileText,
    extensions: ['.pdf'],
    color: 'text-red-500'
  },
  {
    id: 2,
    name: "Word Document", 
    designation: "Editable Format",
    image: "https://cdn-icons-png.flaticon.com/512/281/281760.png",
    icon: FileText,
    extensions: ['.doc', '.docx'],
    color: 'text-blue-500'
  },
  {
    id: 3,
    name: "Plain Text",
    designation: "Simple Format", 
    image: "https://cdn-icons-png.flaticon.com/512/136/136538.png",
    icon: FileText,
    extensions: ['.txt'],
    color: 'text-gray-500'
  }
]

// Floating dock items for actions
const getDockItems = (onAnalyze: () => void, onClear: () => void, onPreview: () => void) => [
  {
    title: "Analyze Resume",
    icon: <Zap className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "#",
    onClick: onAnalyze
  },
  {
    title: "Preview File",
    icon: <Eye className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "#",
    onClick: onPreview
  },
  {
    title: "Clear All",
    icon: <RotateCcw className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "#",
    onClick: onClear
  },
  {
    title: "Download Sample",
    icon: <Download className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "#"
  }
]

interface UploadZoneProps {
  onFileUpload?: (files: File[]) => void
  onAnalysisStart?: (file: File) => void 
  maxFileSize?: number
  acceptedFileTypes?: string[]
  className?: string
}

export default function UploadZone({
  onFileUpload,
  onAnalysisStart,
  maxFileSize = 5, // MB
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt'],
  className
}: UploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showSparkles, setShowSparkles] = useState(false)

  // File validation
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return { isValid: false, error: `File size must be less than ${maxFileSize}MB` }
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedFileTypes.includes(fileExtension)) {
      return { isValid: false, error: 'File type not supported' }
    }

    return { isValid: true }
  }

  // Handle file upload with animation
  const handleFileUpload = useCallback((files: File[]) => {
    setErrorMessage('')
    
    // Validate files
    const validFiles: File[] = []
    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.isValid) {
        setErrorMessage(validation.error || 'Invalid file')
        setUploadStatus('error')
        return
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    // Start upload animation
    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsUploading(false)
          setUploadStatus('success')
          setShowSparkles(true)
          
          // Hide sparkles after animation
          setTimeout(() => setShowSparkles(false), 2000)
          
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 200)

    setUploadedFiles(validFiles)
    onFileUpload?.(validFiles)
  }, [maxFileSize, acceptedFileTypes, onFileUpload])

  // Clear uploaded files
  const handleClear = useCallback(() => {
    setUploadedFiles([])
    setUploadProgress(0)
    setUploadStatus('idle')
    setErrorMessage('')
    setShowSparkles(false)
  }, [])

  // Start analysis
  const handleAnalyze = useCallback(() => {
    if (uploadedFiles.length > 0) {
      onAnalysisStart?.(uploadedFiles[0])
    }
  }, [uploadedFiles, onAnalysisStart])

  // Preview file
  const handlePreview = useCallback(() => {
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0]
      const url = URL.createObjectURL(file)
      window.open(url, '_blank')
    }
  }, [uploadedFiles])

  const dockItems = getDockItems(handleAnalyze, handleClear, handlePreview)

  return (
    <div className={cn("w-full max-6xl mx-auto p-4", className)}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Upload Your Resume
          </h2>
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#3B82F6"
              />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Let our AI analyze your resume and provide actionable insights
        </p>
        
        {/* Supported File Types */}
        <div className="flex justify-center mb-6">
          <AnimatedTooltip items={fileTypeConfig} />
        </div>
      </div>

      {/* Main Upload Area */}
      <CardContainer className="inter-var w-full">
        <CardBody className="relative group/card w-full">
          <div className="relative min-h-[280px] w-full">
            {/* Background Beams Effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <BackgroundBeams className="opacity-20" />
            </div>

            {/* Upload Zone */}
            <CardItem translateZ="50" className="w-full h-full relative z-10">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <FileUpload onChange={handleFileUpload} />
                
                {/* Upload Progress */}
                {(isUploading || uploadProgress > 0) && (
                  <CardItem translateZ="100" className="mt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {isUploading ? 'Uploading...' : 'Upload Complete'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <AnimatedProgress progress={uploadProgress} />
                    </div>
                  </CardItem>
                )}

                {/* Upload Status */}
                {uploadStatus === 'success' && uploadedFiles.length > 0 && (
                  <CardItem translateZ="80" className="mt-6">
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div className="ml-2">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                          File uploaded successfully!
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          {uploadedFiles[0].name} ({(uploadedFiles[0].size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    </Alert>
                  </CardItem>
                )}

                {/* Error Status */}
                {uploadStatus === 'error' && errorMessage && (
                  <CardItem translateZ="80" className="mt-6">
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div className="ml-2">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Upload failed
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          {errorMessage}
                        </p>
                      </div>
                    </Alert>
                  </CardItem>
                )}

                {/* File Requirements */}
                <CardItem translateZ="60" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">File Types</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300">PDF, DOC, DOCX, TXT</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-800 dark:text-green-200">Max Size</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">Up to {maxFileSize}MB</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-purple-800 dark:text-purple-200">AI Analysis</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Instant feedback</p>
                    </div>
                  </div>
                </CardItem>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {/* Action Buttons */}
      {uploadedFiles.length > 0 && uploadStatus === 'success' && (
        <CardContainer className="mt-8">
          <CardItem translateZ="50" className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleAnalyze}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="mr-2 h-5 w-5" />
                Analyze Resume
              </Button>
              
              <Button 
                onClick={handlePreview}
                variant="outline" 
                size="lg"
                className="px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="mr-2 h-5 w-5" />
                Preview File
              </Button>
            </div>
          </CardItem>
        </CardContainer>
      )}

      {/* Floating Action Dock */}
      {uploadedFiles.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <FloatingDock
            items={dockItems}
            mobileClassName="translate-y-0"
          />
        </div>
      )}

      {/* Tips Section */}
      <CardContainer className="mt-12">
        <CardItem translateZ="30" className="w-full">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
              Tips for Best Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">1</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use a clean, well-formatted resume with clear sections
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">2</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Include relevant keywords from your target job description
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">3</Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ensure your contact information is clearly visible
                </p>
              </div>
            </div>
          </div>
        </CardItem>
      </CardContainer>
    </div>
  )
}