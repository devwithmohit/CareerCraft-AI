"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Github,
  Chrome,
  Linkedin,
  Briefcase,
  Shield,
  Zap,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  jobTitle: string
  experience: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobTitle: '',
    experience: 'entry',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'general', string>>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateStep1 = () => {
    const newErrors: Partial<typeof errors> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Partial<typeof errors> = {}
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getPasswordStrength = () => {
    const password = formData.password
    let strength = 0
    
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 25
    
    return strength
  }

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength()
    if (strength < 25) return { label: 'Very Weak', color: 'bg-red-500' }
    if (strength < 50) return { label: 'Weak', color: 'bg-orange-500' }
    if (strength < 75) return { label: 'Good', color: 'bg-yellow-500' }
    return { label: 'Strong', color: 'bg-green-500' }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // For demo - redirect to welcome/onboarding
      router.push('/dashboard?welcome=true')
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = async (provider: 'google' | 'github' | 'linkedin') => {
    setIsLoading(true)
    try {
      // Simulate social registration
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/dashboard?welcome=true')
    } catch (error) {
      setErrors({ general: `Failed to register with ${provider}. Please try again.` })
    } finally {
      setIsLoading(false)
    }
  }

  const experienceOptions = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'executive', label: 'Executive (10+ years)' },
    { value: 'student', label: 'Student/Recent Graduate' }
  ]

  const benefits = [
    "Free ATS resume analysis",
    "AI-powered job matching",
    "Professional resume templates",
    "Interview preparation tools",
    "Career insights & analytics"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Benefits & Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CareerCraft AI</h1>
                <p className="text-sm text-gray-600">Your AI Career Assistant</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Start Your Journey to
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Career Success
                </span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Join thousands of professionals who've accelerated their careers 
                with our AI-powered platform. Get started for free today.
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">What you get for free:</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-fit">
              🎉 Free plan includes 1 resume analysis per month
            </Badge>
          </div>

          {/* Success Stories */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                SJ
              </div>
              <div>
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-600">Software Engineer at Google</div>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "CareerCraft AI helped me optimize my resume and land my dream job at Google. 
              The AI insights were incredibly valuable!"
            </p>
            <div className="flex items-center mt-3 space-x-4 text-sm text-gray-600">
              <span>💰 +40% salary increase</span>
              <span>📈 3x more interviews</span>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Your Account
              </CardTitle>
              
              <CardDescription className="text-gray-600">
                Join thousands of professionals accelerating their careers
              </CardDescription>
              
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Step {currentStep} of 2</span>
                  <span>{currentStep === 1 ? 'Basic Info' : 'Security & Preferences'}</span>
                </div>
                <Progress value={currentStep * 50} className="h-2" />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Registration Options */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => handleSocialRegister('google')}
                  disabled={isLoading}
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Continue with Google
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialRegister('github')}
                    disabled={isLoading}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialRegister('linkedin')}
                    disabled={isLoading}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">or continue with email</span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={cn(
                              "pl-10 h-11",
                              errors.firstName && "border-red-500 focus:border-red-500"
                            )}
                            disabled={isLoading}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={cn(
                            "h-11",
                            errors.lastName && "border-red-500 focus:border-red-500"
                          )}
                          disabled={isLoading}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={cn(
                            "pl-10 h-11",
                            errors.email && "border-red-500 focus:border-red-500"
                          )}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Current Job Title (Optional)</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          type="text"
                          placeholder="e.g., Software Engineer, Marketing Manager"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="pl-10 h-11"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      >
                        {experienceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Security & Preferences */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={cn(
                            "pl-10 pr-10 h-11",
                            errors.password && "border-red-500 focus:border-red-500"
                          )}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Password strength:</span>
                            <span className={cn(
                              "text-xs font-medium",
                              getPasswordStrengthLabel().color.replace('bg-', 'text-')
                            )}>
                              {getPasswordStrengthLabel().label}
                            </span>
                          </div>
                          <Progress 
                            value={getPasswordStrength()} 
                            className={cn("h-2", getPasswordStrengthLabel().color)}
                          />
                        </div>
                      )}
                      
                      {errors.password && (
                        <p className="text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={cn(
                            "pl-10 pr-10 h-11",
                            errors.confirmPassword && "border-red-500 focus:border-red-500"
                          )}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <input
                          id="agreeToTerms"
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className={cn(
                            "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1",
                            errors.agreeToTerms && "border-red-500"
                          )}
                          disabled={isLoading}
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                          I agree to the{' '}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                      )}

                      <div className="flex items-start space-x-2">
                        <input
                          id="subscribeNewsletter"
                          name="subscribeNewsletter"
                          type="checkbox"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          disabled={isLoading}
                        />
                        <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-600 leading-relaxed">
                          Send me career tips, job alerts, and product updates (optional)
                        </Label>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1 h-11"
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      
                      <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <Zap className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">Trusted by 50,000+ professionals worldwide</p>
            <div className="flex justify-center space-x-4 text-gray-400">
              <span className="text-xs">🔒 256-bit SSL</span>
              <span className="text-xs">🛡️ GDPR Compliant</span>
              <span className="text-xs">⚡ AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}