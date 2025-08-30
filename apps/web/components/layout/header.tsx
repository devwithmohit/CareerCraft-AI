"use client";
import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Brain, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  type NavLink = { href: string; label: string };
  type NavDropdown = { label: string; items: NavLink[] };
  type NavItem = NavLink | NavDropdown;
  const navItems = [
    {
      label: "Features",
      items: [
        { href: "/resume-analysis", label: "Resume Analysis" },
        { href: "/resume-builder", label: "Resume Builder" },
        { href: "/job-search", label: "Job Search" },
        { href: "/interview-prep", label: "Interview Prep" },
      ],
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  const isActive = (href: string) => pathname === href;
  const isDropdown = (i: NavItem): i is NavDropdown => "items" in i;

  const featureLinks = navItems.find(isDropdown)?.items ?? [];
  const topLinks = navItems.filter((i): i is NavLink => !isDropdown(i));
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background/80"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Brain className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerCraft AI
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              AI POWERED
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.items ? (
                // Dropdown menu
                <div className="flex items-center space-x-1 cursor-pointer">
                  <span className="text-sm font-medium transition-colors hover:text-primary">
                    {item.label}
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />

                  {/* Dropdown content */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular link
                <Link
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg">CareerCraft AI</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-col space-y-4">
              {/* Features dropdown in mobile */}
              <div className="space-y-2">
                <span className="font-semibold text-sm text-muted-foreground">
                  Features
                </span>
                {navItems[0].items?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block pl-4 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Other nav items */}
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-sm font-medium hover:bg-muted rounded-md px-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile auth buttons */}
              <div className="pt-6 border-t space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  asChild
                >
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
