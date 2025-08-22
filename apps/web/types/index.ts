export interface User{
    id: string
    email: string
    name : string
    createdAt: Date
    updateAt: Date
}

export interface Resume {
  id: string
  userId: string
  title: string
  content: string
  atsScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface JobApplication {
  id: string
  userId: string
  company: string
  position: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  appliedAt: Date
  notes?: string
}
export interface AnalysisResult {
  overallScore: number
  atsCompatibility: number
  keywordMatch: number
  suggestions: string[]
  missingKeywords: string[]
}