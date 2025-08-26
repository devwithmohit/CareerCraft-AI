"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard,
  FileText,
  Search,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  Crown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Zap,
  Target,
  Calendar,
  Bell
} from 'lucide-react'
import {cn} from '@/lib/utils'


interface SidebarProps {
    collapsed? : boolean
    onToggleCollapse?: ()=> void
    className?: string
}

export function Sidebar ({
    collapsed = false,
    onToggleCollapse,
    className 
}: SidebarProps){

    const pathname = usePathname()
    const [userPlan] = useState<'free' | 'pro' | 'enterprise'>('free') // This would come from auth context
 const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & analytics"
    },
    {
      title: "Resume Analysis",
      href: "/resume-analysis",
      icon: FileText,
      description: "AI-powered optimization",
      badge: "Popular"
    },
    {
        title: "Resume Builder",
      href: "/resume-builder",
      icon: FileText,
      description: "Create & edit resumes"
    },
    {
      title: "Job Search",
      href: "/job-search",
      icon: Search,
      description: "Find matching jobs"
    },
    {
      title: "Applications",
      href: "/applications",
      icon: Briefcase,
      description: "Track your progress"
    },
    {
        title: "Interview Prep",
      href: "/interview-prep",
      icon: MessageSquare,
      description: "Practice with AI",
      badge: userPlan === 'free' ? 'Pro' : undefined
    }
]
 const analyticsItems = [
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Performance insights"
    },
    {
      title: "Cover Letters",
      href: "/cover-letters",
      icon: FileText,
      description: "AI-generated letters"
    }
  ]
    const bottomItems = [
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Account preferences"
    },
    {
      title: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      description: "Get assistance"
    }
  ]
const isActive = (href:string)=>{
    return pathname === href || pathname.startsWith(href + '/')

}
const NavItem = ({item, showBadge}:{
     item: typeof mainNavItems[0],
    showBadge?: boolean
})=>(
    <Link href={item.href}>
      <div className={cn(
        "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive(item.href) 
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
          : "text-gray-700 dark:text-gray-300"
      )}>
        <item.icon className={cn(
          "h-5 w-5 flex-shrink-0",
          isActive(item.href) ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
        )} />
  {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate">{item.title}</span>
                {showBadge && item.badge && (
                  <Badge 
                    variant={item.badge === 'Pro' ? 'default' : 'secondary'}
                    className="ml-2 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {item.description}
              </p>
            </div>
          </>
        )}
      </div>
    </Link>
)

    return(
         <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">CareerCraft</h2>
              <p className="text-xs text-gray-500">AI Career Assistant</p>
            </div>
          </div>
        )}

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
         {/* User Info */}
      {!collapsed && (
        <div className="p-4">
          <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  John Doe
                </p>
                <div className="flex items-center space-x-1">
                  <Crown className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {userPlan} Plan
                  </span>
                </div>
              </div>
            </div>
            {userPlan === 'free' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3 text-xs bg-white dark:bg-gray-800"
                asChild
              >
                <Link href="/pricing">
                  <Target className="h-3 w-3 mr-1" />
                  Upgrade to Pro
                </Link>
              </Button>
            )}
          </Card>
        </div>
      )}
       {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main
            </h3>
          )}
          {mainNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
<Separator className="my-4" />

        {/* Analytics Section */}
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Analytics
            </h3>
          )}
          {analyticsItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
         <Separator className="my-4" />

        {/* Quick Actions */}
        {!collapsed && (
          <div className="space-y-2">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="/resume-analysis">
                <FileText className="h-4 w-4 mr-2" />
                Analyze Resume
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="/job-search">
                <Search className="h-4 w-4 mr-2" />
                Find Jobs
              </Link>
               </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="/interview-prep">
                <Calendar className="h-4 w-4 mr-2" />
                Practice Interview
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-1">
        {bottomItems.map((item) => (
          <NavItem key={item.href} item={item} showBadge={false} />
        ))}
        
        {!collapsed && (
             <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>

      {/* Notifications indicator */}
      {collapsed && (
        <div className="absolute top-4 right-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
    )
}