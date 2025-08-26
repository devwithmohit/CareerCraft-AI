"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Crown, 
  Building2,
  ArrowRight,
  Star,
  Users,
  Shield,
  Headphones,
  FileText,
  Search,
  MessageSquare,
  BarChart3,
  Target,
  Rocket,
  Gift,
  Clock,
  Infinity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRICING_PLANS } from '@/lib/constants'

type BillingPeriod = 'monthly' | 'yearly'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (planId === 'free') {
        window.location.href = '/register'
      } else if (planId === 'enterprise') {
        window.location.href = '/contact?plan=enterprise'
      } else {
        // Redirect to payment flow
        window.location.href = `/checkout?plan=${planId}&billing=${billingPeriod}`
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const getPrice = (plan: typeof PRICING_PLANS[0]) => {
    if (plan.price === null) return 'Custom'
    if (plan.price === 0) return 'Free'
    
    const price = billingPeriod === 'yearly' ? plan.price * 10 : plan.price // 2 months free
    return `$${price}`
  }

  const getOriginalPrice = (plan: typeof PRICING_PLANS[0]) => {
    if (plan.price === null || plan.price === 0) return null
    if (billingPeriod === 'yearly') {
      return `$${plan.price * 12}`
    }
    return null
  }

  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Resume Analysis", free: "1/month", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "ATS Scoring", free: true, pro: true, enterprise: true },
        { name: "Job Matching", free: "10/day", pro: "100/day", enterprise: "Unlimited" },
        { name: "Resume Templates", free: "3 Basic", pro: "50+ Premium", enterprise: "All + Custom" },
        { name: "Cover Letter Generator", free: false, pro: true, enterprise: true },
        { name: "Interview Prep", free: false, pro: true, enterprise: true }
      ]
    },
    {
      category: "Advanced Tools",
      items: [
        { name: "AI Career Coach", free: false, pro: true, enterprise: true },
        { name: "Salary Insights", free: false, pro: true, enterprise: true },
        { name: "Application Tracking", free: "Basic", pro: "Advanced", enterprise: "Enterprise" },
        { name: "Analytics Dashboard", free: false, pro: true, enterprise: true },
        { name: "Custom Integrations", free: false, pro: false, enterprise: true },
        { name: "API Access", free: false, pro: "Limited", enterprise: "Full" }
      ]
    },
    {
      category: "Support & Collaboration",
      items: [
        { name: "Email Support", free: true, pro: true, enterprise: true },
        { name: "Priority Support", free: false, pro: true, enterprise: true },
        { name: "Live Chat", free: false, pro: false, enterprise: true },
        { name: "Team Collaboration", free: false, pro: false, enterprise: true },
        { name: "Dedicated Manager", free: false, pro: false, enterprise: true },
        { name: "Custom Training", free: false, pro: false, enterprise: true }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2">
            🚀 Limited Time: 2 Months Free on Annual Plans
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Career Growth Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who've accelerated their careers with our AI-powered platform. 
            Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={cn(
              "text-sm font-medium",
              billingPeriod === 'monthly' ? "text-gray-900" : "text-gray-500"
            )}>
              Monthly
            </span>
            
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                billingPeriod === 'yearly' ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  billingPeriod === 'yearly' ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            
            <span className={cn(
              "text-sm font-medium flex items-center space-x-1",
              billingPeriod === 'yearly' ? "text-gray-900" : "text-gray-500"
            )}>
              <span>Yearly</span>
              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                Save 17%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-2xl",
                plan.popular ? "border-2 border-blue-500 scale-105 shadow-xl" : "border border-gray-200 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  <Crown className="inline h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}

              <CardHeader className={cn("text-center pb-6", plan.popular && "pt-8")}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
                  {plan.id === 'free' && <Gift className="h-8 w-8 text-blue-600" />}
                  {plan.id === 'pro' && <Zap className="h-8 w-8 text-purple-600" />}
                  {plan.id === 'enterprise' && <Building2 className="h-8 w-8 text-indigo-600" />}
                </div>

                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                
                <CardDescription className="text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {getPrice(plan)}
                    </span>
                    {plan.price !== null && plan.price > 0 && (
                      <span className="text-gray-500">
                        /{billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  
                  {getOriginalPrice(plan) && (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">
                        {getOriginalPrice(plan)}/year
                      </span>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Save 17%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Limitations:</h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={cn(
                    "w-full h-12 font-medium transition-all duration-200",
                    plan.popular 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                      : plan.id === 'free'
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  )}
                  disabled={isLoading === plan.id}
                >
                  {isLoading === plan.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {plan.id === 'pro' && (
                  <p className="text-xs text-center text-gray-500">
                    7-day free trial • No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-lg text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-xl rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                        Features
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-1/4">
                        <div className="flex items-center justify-center space-x-2">
                          <Gift className="h-4 w-4 text-blue-600" />
                          <span>Free</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-1/4 bg-blue-50">
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span>Pro</span>
                          <Badge className="bg-blue-600 text-white text-xs">Popular</Badge>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-1/4">
                        <div className="flex items-center justify-center space-x-2">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                          <span>Enterprise</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {features.map((category, categoryIndex) => (
                      <>
                        <tr key={`category-${categoryIndex}`} className="bg-gray-25">
                          <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-gray-900 bg-gray-100">
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((feature, featureIndex) => (
                          <tr key={`feature-${categoryIndex}-${featureIndex}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {feature.name}
                            </td>
                            <td className="px-6 py-4 text-center text-sm">
                              {typeof feature.free === 'boolean' ? (
                                feature.free ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-red-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-700">{feature.free}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center text-sm bg-blue-25">
                              {typeof feature.pro === 'boolean' ? (
                                feature.pro ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-red-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-700 font-medium">{feature.pro}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center text-sm">
                              {typeof feature.enterprise === 'boolean' ? (
                                feature.enterprise ? (
                                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-red-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-700 font-medium">{feature.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for Pro plans. If you're not satisfied, contact us for a full refund."
              },
              {
                question: "How does the free trial work?",
                answer: "Start with a 7-day free trial of Pro features. No credit card required. You can upgrade anytime during or after the trial."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use enterprise-grade security with 256-bit SSL encryption and are fully GDPR compliant."
              },
              {
                question: "Can I use CareerCraft AI for my team?",
                answer: "Yes! Our Enterprise plan includes team collaboration features, admin controls, and volume discounts."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 p-12">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                <Rocket className="h-10 w-10" />
              </div>
              
              <h2 className="text-3xl font-bold">
                Ready to Accelerate Your Career?
              </h2>
              
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of professionals who've landed their dream jobs with CareerCraft AI. 
                Start your free trial today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleSubscribe('pro')}
                  className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8"
                  disabled={isLoading === 'pro'}
                >
                  {isLoading === 'pro' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Starting Trial...
                    </>
                  ) : (
                    <>
                      Start Free Trial
                      <Star className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 h-12 px-8"
                  asChild
                >
                  <Link href="/contact">
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm opacity-75">
                ✨ No credit card required • 7-day free trial • Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}