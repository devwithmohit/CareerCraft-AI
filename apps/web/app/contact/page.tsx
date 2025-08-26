"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Headphones,
  FileText,
  Users,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Calendar,
  Building2,
  Star,
  Shield,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

type FormData = {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
  contactReason: string
  newsletter: boolean
}

type ContactReason = 'general' | 'support' | 'sales' | 'partnership' | 'media' | 'feedback'

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    contactReason: 'general',
    newsletter: true
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const validateForm = () => {
    const newErrors: Partial<typeof errors> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const contactReasons = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'support', label: 'Technical Support', icon: Headphones },
    { value: 'sales', label: 'Sales & Pricing', icon: Building2 },
    { value: 'partnership', label: 'Partnership', icon: Users },
    { value: 'media', label: 'Media & Press', icon: FileText },
    { value: 'feedback', label: 'Feedback', icon: Star }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      value: 'support@careercraft.ai',
      action: 'mailto:support@careercraft.ai'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team during business hours',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      value: 'Available 24/7',
      action: '#'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come visit our headquarters in San Francisco',
      value: '123 Tech Street, SF, CA 94105',
      action: 'https://maps.google.com'
    }
  ]

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST' },
    { day: 'Sunday', hours: 'Closed' }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl border-0">
          <CardContent className="p-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Message Sent!</h2>
              <p className="text-gray-600">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What's next?</strong><br />
                Our team will review your message and respond via email. 
                Check your inbox (including spam folder) for our reply.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    company: '',
                    phone: '',
                    subject: '',
                    message: '',
                    contactReason: 'general',
                    newsletter: true
                  })
                }}
                variant="outline" 
                className="w-full"
              >
                Send Another Message
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <a href="/">
                  Back to Homepage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2">
            💬 We're here to help 24/7
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Get in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Touch</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about CareerCraft AI? Need technical support? Want to explore enterprise solutions? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Send us a Message
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Reason */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">
                      What can we help you with?
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {contactReasons.map((reason) => (
                        <button
                          key={reason.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, contactReason: reason.value }))}
                          className={cn(
                            "p-3 rounded-lg border transition-all duration-200 text-left",
                            formData.contactReason === reason.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          )}
                        >
                          <reason.icon className="h-5 w-5 mb-2" />
                          <div className="text-sm font-medium">{reason.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={cn(
                          "h-11",
                          errors.firstName && "border-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
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

                  {/* Email and Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={cn(
                          "h-11",
                          errors.email && "border-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Acme Corporation"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Phone and Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-11"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={cn(
                          "h-11",
                          errors.subject && "border-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className={cn(
                        "min-h-[120px] resize-none",
                        errors.message && "border-red-500 focus:border-red-500"
                      )}
                      disabled={isLoading}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  {/* Newsletter Checkbox */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="newsletter"
                      name="newsletter"
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      disabled={isLoading}
                    />
                    <Label htmlFor="newsletter" className="text-sm text-gray-600 leading-relaxed">
                      I'd like to receive product updates, career tips, and industry insights via email. 
                      You can unsubscribe at any time.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <method.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                      <a 
                        href={method.action}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {method.value}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Office Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700">{schedule.day}</span>
                    <span className="text-sm font-medium text-gray-900">{schedule.hours}</span>
                  </div>
                ))}
                <Separator />
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Emergency Support:</strong> Available 24/7 for Enterprise customers
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Follow Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'text-blue-600' },
                    { icon: Twitter, label: 'Twitter', href: '#', color: 'text-sky-500' },
                    { icon: Github, label: 'GitHub', href: '#', color: 'text-gray-900' },
                    { icon: Mail, label: 'Newsletter', href: '#', color: 'text-purple-600' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <social.icon className={`h-5 w-5 ${social.color}`} />
                      <span className="text-sm font-medium text-gray-700">{social.label}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
                
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0" asChild>
                    <a href="/pricing">
                      <Zap className="mr-2 h-4 w-4" />
                      View Pricing Plans
                    </a>
                  </Button>
                  
                  <Button variant="secondary" className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0" asChild>
                    <a href="/about">
                      <Users className="mr-2 h-4 w-4" />
                      Learn About Us
                    </a>
                  </Button>
                  
                  <Button variant="secondary" className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0" asChild>
                    <a href="/register">
                      <Star className="mr-2 h-4 w-4" />
                      Start Free Trial
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}