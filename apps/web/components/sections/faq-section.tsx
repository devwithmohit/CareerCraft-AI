"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare, 
  Mail,
  Phone,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]) // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      category: "Getting Started",
      icon: HelpCircle,
      faqs: [
        {
          question: "How does CareerCraft AI work?",
          answer: "CareerCraft AI uses advanced machine learning algorithms to analyze your resume against thousands of successful resumes and job descriptions. It provides personalized recommendations for improving your resume's ATS compatibility, keyword optimization, and overall effectiveness."
        },
        {
          question: "Is CareerCraft AI really free to start?",
          answer: "Yes! Our free plan includes 1 resume analysis per month, basic ATS scoring, and access to standard templates. You can upgrade to Pro for unlimited analyses and advanced features anytime."
        },
        {
          question: "How accurate is the ATS scoring?",
          answer: "Our ATS scoring has a 95% accuracy rate based on real-world testing with major ATS systems like Workday, Greenhouse, and Lever. We continuously update our algorithms based on the latest ATS requirements."
        },
        {
          question: "Can I use CareerCraft AI for different industries?",
          answer: "Absolutely! Our AI is trained on resumes and job descriptions across 50+ industries including tech, healthcare, finance, marketing, engineering, and more. The recommendations are tailored to your specific field."
        }
      ]
    },
    {
      category: "Features & Functionality",
      icon: Sparkles,
      faqs: [
        {
          question: "What file formats does CareerCraft AI support?",
          answer: "We support PDF, DOC, DOCX, and TXT formats. For best results, we recommend uploading your resume as a PDF or DOCX file to maintain formatting."
        },
        {
          question: "How long does the resume analysis take?",
          answer: "Most analyses complete in under 2 minutes! Our AI processes your resume instantly, but we take extra time to provide detailed, personalized recommendations."
        },
        {
          question: "Can I track multiple job applications?",
          answer: "Yes! Pro users get access to our application tracker where you can organize all your job applications, set follow-up reminders, and track your progress through different hiring stages."
        },
        {
          question: "Does the AI generate cover letters too?",
          answer: "Yes! Our AI can generate personalized cover letters based on your resume and the specific job description. Just upload the job posting and we'll create a tailored cover letter in seconds."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      icon: MessageSquare,
      faqs: [
        {
          question: "What's included in the Pro plan?",
          answer: "Pro includes unlimited resume analyses, advanced AI suggestions, premium templates, job matching alerts, interview prep tools, cover letter generation, application tracking, and priority support."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your Pro subscription at any time. You'll continue to have Pro access until the end of your current billing period, then you'll automatically switch to the free plan."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 30-day money-back guarantee for Pro subscriptions. If you're not satisfied within the first 30 days, contact our support team for a full refund."
        },
        {
          question: "Is there a student discount?",
          answer: "Yes! Students with a valid .edu email address receive 50% off Pro plans. Just verify your student status during signup to automatically apply the discount."
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: HelpCircle,
      faqs: [
        {
          question: "Is my resume data secure?",
          answer: "Absolutely! We use enterprise-grade encryption, secure cloud storage, and never share your personal information with third parties. Your resume data is processed securely and can be deleted at any time."
        },
        {
          question: "Do you sell or share my data?",
          answer: "Never! We have a strict no-data-selling policy. Your resume and personal information are used solely to provide you with AI-powered career insights and are never shared with employers or third parties without your explicit consent."
        },
        {
          question: "Can I delete my account and data?",
          answer: "Yes, you can permanently delete your account and all associated data at any time from your account settings. This action is irreversible and removes all your resumes, analyses, and personal information from our systems."
        }
      ]
    }
  ]

  const allFaqs = faqCategories.flatMap((category, categoryIndex) => 
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      categoryIndex,
      globalIndex: categoryIndex * 10 + faqIndex
    }))
  )

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help Center
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers! Find everything you need to know about 
            CareerCraft AI and how it can accelerate your career.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {/* FAQ Items */}
          <div className="space-y-4 mb-16">
            {allFaqs.map((faq, index) => (
              <Card 
                key={index}
                className="border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors p-6"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </CardTitle>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {openItems.includes(index) && (
                  <CardContent className="pt-0 pb-6 px-6">
                    <CardDescription className="text-gray-700 leading-relaxed text-base">
                      {faq.answer}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold mb-2">Live Chat</CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Get instant help from our support team
              </CardDescription>
              <Button variant="outline" size="sm" asChild>
                <Link href="/support/chat">
                  Start Chat
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg font-semibold mb-2">Email Support</CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Send us a message and we'll respond within 24 hours
              </CardDescription>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:support@careercraft.ai">
                  Send Email
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="text-center p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-semibold mb-2">Phone Support</CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                Speak directly with our experts (Pro users)
              </CardDescription>
              <Button variant="outline" size="sm" asChild>
                <Link href="/support/phone">
                  Schedule Call
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>

          {/* Still Have Questions CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Can't find what you're looking for? Our friendly support team is here to help you 
              make the most of CareerCraft AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                asChild
              >
                <Link href="/support">
                  Contact Support
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold"
                asChild
              >
                <Link href="/docs">
                  View Documentation
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}