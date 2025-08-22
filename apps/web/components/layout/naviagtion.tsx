"use client ";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Brain } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { href: "/resume-analysis", label: "Resume Analysis" },
    { href: "/resume-buildre", label: "Resume Analysis" },
    { href: "/job-search", label: "Job Search " },
    { href: "/dashboard-", label: " DashBoard" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* {Logo} */}
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">CareerCraft AI</span>
        </Link>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                 <Link href="/register">Get Started</Link>
            </Button>
        </div>
         {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                <Link href="/login" className="block py-2 text-sm">Login</Link>
                <Link href="/register" className="block py-2 text-sm">Get Started</Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
