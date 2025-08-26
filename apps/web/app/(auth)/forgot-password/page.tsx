"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Shield,
  Sparkles,
  RefreshCw,
  MessageCircle,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

type FormState = 'initial' | 'loading' | 'sent' | 'error'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('initial')
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Email address is required')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setFormState('loading')
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setFormState('sent')
      startResendCountdown()
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
      setFormState('error')
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0) return
    
    setFormState('loading')
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setFormState('sent')
      startResendCountdown()
    } catch (error) {
      setError('Failed to resend email. Please try again.')
      setFormState('error')
    }
  }

  const startResendCountdown = () => {
    setResendCountdown(60)
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetForm = () => {
    setFormState('initial')
    setError('')
    setEmail('')
    setResendCountdown(0)
  }

  const securityFeatures = [
    "Secure password reset process",
    "Email verification required",
    "Link expires in 24 hours",
    "Account protection measures"
  ]

  const supportOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      action: "Contact Support"
    },
    {
      title: "Help Center",
      description: "Browse our comprehensive help articles",
      icon: HelpCircle,
      action: "Visit Help Center"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team (Pro users)",
      icon: MessageCircle,
      action: "Start Chat"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Information & Support */}
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
                Reset Your Password
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Securely & Easily
                </span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Don't worry! Password resets happen to the best of us. 
                We'll help you get back to optimizing your career in no time.
              </p>
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Security Features
            </h3>
            <div className="space-y-3">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Need Additional Help?</h3>
            <div className="space-y-3">
              {supportOptions.map((option, index) => (
                <div key={index} className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <option.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{option.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <Button variant="outline" size="sm" className="text-xs">
                        {option.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Password Reset Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {formState === 'sent' ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <Shield className="h-8 w-8 text-white" />
                )}
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                {formState === 'sent' ? 'Check Your Email' : 'Forgot Password?'}
              </CardTitle>
              
              <CardDescription className="text-gray-600">
                {formState === 'sent' 
                  ? `We've sent a password reset link to ${email}`
                  : 'Enter your email address and we\'ll send you a reset link'
                }
              </CardDescription>
              
              {formState === 'sent' && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-fit mx-auto">
                  ✅ Email Sent Successfully
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {formState !== 'sent' ? (
                /* Password Reset Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600">{error}</p>
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
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError('')
                        }}
                        className={cn(
                          "pl-10 h-11",
                          error && "border-red-500 focus:border-red-500"
                        )}
                        disabled={formState === 'loading'}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={formState === 'loading'}
                  >
                    {formState === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <Mail className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link 
                      href="/login"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="h-10 w-10 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Password Reset Email Sent
                      </h3>
                      <p className="text-sm text-gray-600">
                        We've sent a password reset link to:
                      </p>
                      <p className="text-sm font-medium text-blue-600 break-all">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Next Steps:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Check your email inbox (and spam folder)</li>
                          <li>• Click the reset link within 24 hours</li>
                          <li>• Create a new secure password</li>
                          <li>• Sign in with your new password</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleResend}
                      variant="outline"
                      className="w-full h-11"
                      disabled={resendCountdown > 0 || formState === 'loading'}
                    >
                      {formState === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                          Resending...
                        </>
                      ) : resendCountdown > 0 ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Resend in {resendCountdown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend Email
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={resetForm}
                      variant="ghost"
                      className="w-full h-11"
                    >
                      Try Different Email
                    </Button>
                  </div>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <Link 
                      href="/login"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              )}

              {/* Remember Account Section */}
              {formState !== 'sent' && (
                <div className="text-center pt-4 border-t border-gray-200 space-y-3">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link 
                      href="/login" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                  
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
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Having trouble? Contact our support team
            </p>
            <div className="flex justify-center space-x-4 text-gray-400">
              <span className="text-xs">📧 support@careercraft.ai</span>
              <span className="text-xs">🔒 Secure Process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}