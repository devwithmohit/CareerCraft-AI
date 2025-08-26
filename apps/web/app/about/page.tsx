"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Users, 
  Target, 
  Award, 
  Heart,
  Globe,
  TrendingUp,
  Zap,
  Shield,
  Brain,
  Rocket,
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  Mail,
  MapPin,
  Calendar,
  Star,
  Coffee,
  Code,
  Briefcase
} from 'lucide-react'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'mission' | 'team' | 'story'>('mission')

  const stats = [
    { icon: Users, value: '50,000+', label: 'Active Users', color: 'text-blue-600' },
    { icon: Target, value: '95%', label: 'Success Rate', color: 'text-green-600' },
    { icon: Award, value: '1M+', label: 'Resumes Analyzed', color: 'text-purple-600' },
    { icon: Globe, value: '150+', label: 'Countries', color: 'text-orange-600' }
  ]

  const values = [
    {
      icon: Brain,
      title: 'AI-Powered Innovation',
      description: 'We leverage cutting-edge AI to provide personalized career insights and recommendations.'
    },
    {
      icon: Heart,
      title: 'Human-Centered Design',
      description: 'Every feature is designed with empathy, focusing on real user needs and career challenges.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your career data is protected with enterprise-grade security and complete transparency.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Growth',
      description: 'We constantly evolve our platform based on user feedback and industry trends.'
    }
  ]

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Google PM with 10+ years in AI and career tech. Stanford CS graduate.',
      image: '/images/team/sarah.jpg',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Meta engineer specializing in ML and NLP. MIT PhD in Computer Science.',
      image: '/images/team/marcus.jpg',
      social: { linkedin: '#', github: '#' }
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of AI Research',
      bio: 'PhD in Machine Learning from Berkeley. Published 50+ papers on NLP and career analytics.',
      image: '/images/team/emily.jpg',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'David Kim',
      role: 'VP of Product',
      bio: 'Former Linkedin Product Manager. Expert in career platforms and user experience.',
      image: '/images/team/david.jpg',
      social: { linkedin: '#' }
    },
    {
      name: 'Priya Patel',
      role: 'Head of Design',
      bio: 'Award-winning UX designer from Airbnb. Passionate about inclusive design.',
      image: '/images/team/priya.jpg',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Alex Thompson',
      role: 'VP of Engineering',
      bio: 'Full-stack engineer with 12+ years at startups and big tech. Loves clean code.',
      image: '/images/team/alex.jpg',
      social: { linkedin: '#', github: '#' }
    }
  ]

  const milestones = [
    {
      year: '2021',
      title: 'Company Founded',
      description: 'Started with a simple idea: make career growth accessible to everyone.'
    },
    {
      year: '2022',
      title: 'AI Engine Launch',
      description: 'Released our first AI-powered resume analysis tool.'
    },
    {
      year: '2023',
      title: 'Series A Funding',
      description: 'Raised $15M to expand our AI capabilities and team.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Reached 50,000+ users across 150+ countries.'
    },
    {
      year: '2025',
      title: 'Enterprise Launch',
      description: 'Launched enterprise solutions for Fortune 500 companies.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2">
            🚀 Trusted by 50,000+ professionals worldwide
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Empowering Careers with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              AI Innovation
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to democratize career success by making advanced AI tools 
            accessible to every professional, regardless of their background or experience level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-8">
              Start Your Journey
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="h-12 px-8" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Content Tabs Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              {[
                { id: 'mission', label: 'Our Mission', icon: Target },
                { id: 'team', label: 'Our Team', icon: Users },
                { id: 'story', label: 'Our Story', icon: Rocket }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mission Tab */}
          {activeTab === 'mission' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission & Values
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We believe that everyone deserves access to tools that can accelerate their career growth. 
                  Our mission is to democratize career success through AI innovation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <value.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-600">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  "Our goal is to help every professional reach their full potential"
                </h3>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  By combining artificial intelligence with human insight, we're building the future 
                  of career development - one that's inclusive, accessible, and incredibly effective.
                </p>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Meet Our Team
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're a diverse team of engineers, designers, and career experts passionate 
                  about helping professionals achieve their goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {member.bio}
                      </p>
                      <div className="flex space-x-3">
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {member.social.twitter && (
                          <a href={member.social.twitter} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                        {member.social.github && (
                          <a href={member.social.github} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Want to Join Our Team?
                </h3>
                <p className="text-gray-600 mb-6">
                  We're always looking for talented individuals who share our passion for empowering careers.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <Link href="/careers">
                    View Open Positions
                    <Briefcase className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Journey
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  From a simple idea to a platform that's helping thousands of professionals 
                  advance their careers every day.
                </p>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative flex items-start space-x-8">
                      {/* Timeline Dot */}
                      <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {milestone.year}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600">
                            {milestone.description}
                          </p>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center bg-white rounded-2xl p-8 border border-gray-200">
                <Coffee className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  The Future is Bright
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're just getting started. Our roadmap includes advanced AI coaching, 
                  global job market insights, and personalized career path recommendations. 
                  Join us on this exciting journey!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 p-12">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10" />
            </div>
            
            <h2 className="text-3xl font-bold">
              Ready to Transform Your Career?
            </h2>
            
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who trust CareerCraft AI to accelerate their career growth. 
              Your dream job is just one analysis away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8">
                Get Started Free
                <Star className="ml-2 h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8" asChild>
                <Link href="/contact">
                  Contact Us
                  <Mail className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <p className="text-sm opacity-75">
              ✨ No credit card required • Join 50,000+ happy users
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}