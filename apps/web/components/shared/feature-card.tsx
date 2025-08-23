import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  benefits?: string[]
  href?: string
  gradient?: string
  comingSoon?: boolean
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  benefits = [],
  href,
  gradient = "from-blue-500 to-purple-500",
  comingSoon = false,
  className = ""
}: FeatureCardProps) {
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {comingSoon ? (
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              Coming Soon
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Available
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {benefits.length > 0 && (
          <ul className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        )}
        
        {href && !comingSoon && (
          <Button 
            asChild 
            className="w-full group-hover:bg-blue-600 transition-colors"
          >
            <Link href={href} className="flex items-center justify-center">
              Try {title}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        )}

        {comingSoon && (
          <Button 
            disabled 
            className="w-full opacity-50 cursor-not-allowed"
          >
            Coming Soon
          </Button>
        )}

        {!href && !comingSoon && (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500">Learn more about this feature</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Simple variant for smaller feature cards
export function SimpleFeatureCard({
  icon: Icon,
  title,
  description,
  className = ""
}: Pick<FeatureCardProps, 'icon' | 'title' | 'description' | 'className'>) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white ${className}`}>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto p-3 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors w-fit">
          <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </div>
        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center pt-0">
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}