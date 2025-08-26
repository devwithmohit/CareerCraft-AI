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
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Github,
  Chrome,
  Linkedin
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo - redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: 'Invalid email or password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    setIsLoading(true)
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: `Failed to sign in with ${provider}. Please try again.` })
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    "AI-powered resume analysis",
    "ATS optimization scoring",
    "Personalized job matching",
    "Interview preparation tools"
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
                Welcome Back to Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Career Journey
                </span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Continue optimizing your resume and discovering new career opportunities 
                with our AI-powered platform.
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">What you get with CareerCraft AI:</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50K+</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600">AI Support</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sign In to Your Account
              </CardTitle>
              
              <CardDescription className="text-gray-600">
                Enter your credentials to access your dashboard
              </CardDescription>
              
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 w-fit mx-auto">
                Welcome Back! 👋
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Login Options */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Google
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('linkedin')}
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">Trusted by professionals worldwide</p>
            <div className="flex justify-center space-x-4 text-gray-400">
              <span className="text-xs">🔒 SSL Secured</span>
              <span className="text-xs">🛡️ Privacy Protected</span>
              <span className="text-xs">⚡ AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}