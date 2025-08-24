"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Fade in animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % featuredTestimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const featuredTestimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      image: "SC",
      quote: "CareerCraft AI completely transformed my resume. The AI analysis identified gaps I never noticed, and the ATS optimization helped me land interviews at top tech companies. Got my dream job at Google within 3 weeks!",
      rating: 5,
      metrics: { interviews: "12x more", salary: "+40%" },
      badge: "Dream Job"
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "Microsoft",
      image: "MR",
      quote: "The interview preparation tool was a game-changer. The AI-generated questions were spot-on for my industry, and the feedback helped me improve my STAR responses. Felt confident in every interview.",
      rating: 5,
      metrics: { confidence: "95%", success: "8/10 offers" },
      badge: "Interview Pro"
    },
    {
      name: "Emily Watson",
      role: "Data Scientist",
      company: "Netflix",
      image: "EW",
      quote: "I was skeptical about AI career tools, but CareerCraft exceeded all expectations. The personalized job matching saved me hours of searching, and I found roles I never would have discovered otherwise.",
      rating: 5,
      metrics: { time: "70% saved", matches: "95% relevant" },
      badge: "Time Saver"
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "Apple",
      image: "DK",
      quote: "As a career changer, I needed all the help I could get. CareerCraft's AI suggestions helped me highlight transferable skills and craft a compelling narrative. Now I'm designing products at Apple!",
      rating: 5,
      metrics: { transition: "6 months", interviews: "15+" },
      badge: "Career Change"
    }
  ]

  const quickTestimonials = [
    {
      name: "James Wilson",
      role: "Marketing Director",
      quote: "Increased my interview rate by 300%. Absolutely worth it!",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Financial Analyst",
      quote: "The AI caught mistakes I missed after 10 revisions.",
      rating: 5
    },
    {
      name: "Alex Thompson",
      role: "DevOps Engineer",
      quote: "Got my first FAANG offer thanks to the resume optimization.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "HR Manager",
      quote: "Even as an HR professional, I learned new resume strategies.",
      rating: 5
    },
    {
      name: "Robert Chang",
      role: "Sales Manager",
      quote: "The job matching feature is incredibly accurate.",
      rating: 5
    },
    {
      name: "Jennifer Lee",
      role: "Content Strategist",
      quote: "Helped me transition from journalism to tech successfully.",
      rating: 5
    }
  ]

  const companies = [
    "Google", "Microsoft", "Apple", "Amazon", "Netflix", "Meta", 
    "Tesla", "Spotify", "Airbnb", "Uber", "LinkedIn", "Salesforce"
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % featuredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
  }

  const currentTest = featuredTestimonials[currentTestimonial]

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Users className="h-4 w-4 mr-1" />
            Success Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Users
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers with CareerCraft AI.
            Real stories, real results, real success.
          </p>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className={`max-w-6xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
          <Card className="border-0 shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Content Side */}
                <div className="p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-6">
                    <Badge className={`mr-3 ${
                      currentTest.badge === 'Dream Job' ? 'bg-blue-100 text-blue-700' :
                      currentTest.badge === 'Interview Pro' ? 'bg-purple-100 text-purple-700' :
                      currentTest.badge === 'Time Saver' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {currentTest.badge}
                    </Badge>
                    <div className="flex">
                      {[...Array(currentTest.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <Quote className="h-8 w-8 text-blue-600 mb-4" />
                  
                  <CardDescription className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {currentTest.quote}
                  </CardDescription>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {Object.entries(currentTest.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {currentTest.image}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{currentTest.name}</div>
                        <div className="text-sm text-gray-600">{currentTest.role}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building className="h-3 w-3 mr-1" />
                          {currentTest.company}
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={prevTestimonial}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={nextTestimonial}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-6 mx-auto">
                      {currentTest.image}
                    </div>
                    <div className="text-xl font-semibold mb-2">{currentTest.name}</div>
                    <div className="text-blue-100 mb-4">{currentTest.role}</div>
                    <div className="text-3xl font-bold">{currentTest.company}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {featuredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Testimonials Grid */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <h3 className="text-2xl font-bold text-center mb-8">More Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quickTestimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </CardDescription>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Companies Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
          <h3 className="text-xl font-semibold mb-8 text-gray-600">
            Our users have landed jobs at top companies including:
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 mb-8">
            {companies.map((company, index) => (
              <div key={index} className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h3>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of professionals who have transformed their careers with CareerCraft AI.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
              asChild
            >
              <Link href="/register">
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}