"use client";
import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider attribute="class"
      
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange {...props}>{children}</NextThemeProvider>;
}

// . 'use client'

// This tells Next.js (App Router) that this component is a Client Component.

// In App Router, files are server components by default.

// But things like context providers, event listeners, or theming require client-side code.

// So 'use client' is mandatory if you're using things like useState, useEffect, or anything browser-only (like next-themes).

// 2. Imports
// import * as React from 'react'

// Imports everything from React. You’re using JSX, so React is needed (especially in TS).

// import { ThemeProvider as NextThemeProvider } from 'next-themes'

// You’re using the ThemeProvider from the next-themes
//  library, but renaming it locally to NextThemeProvider.

// import { type ThemeProviderProps } from 'next-themes'

// You import the TypeScript types for the props that ThemeProvider expects.

// export default function ThemeProvider({ children, ...props }: ThemeProviderProps)
// This is a wrapper component you’re creating.

// It takes all the props of next-themes' ThemeProvider, including children, and just passes them down.

// tsx
// Copy code
// return (
//     <NextThemeProvider {...props}>
//         {children}
//     </NextThemeProvider>
// )
// You’re passing all the props directly to the NextThemeProvider, and rendering children inside it.

// This is a simple "pass-through" or proxy component.
