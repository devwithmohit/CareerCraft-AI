// import Image, { type ImageProps } from "next/image";
// import { Button } from "@repo/ui/button";
// import styles from "./page.module.css";

// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <ThemeImage
//           className={styles.logo}
//           srcLight="turborepo-dark.svg"
//           srcDark="turborepo-light.svg"
//           alt="Turborepo logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>apps/web/app/page.tsx</code>
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://turborepo.com/docs?utm_source"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//         <Button appName="web" className={styles.secondary}>
//           Open alert
//         </Button>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://turborepo.com?utm_source=create-turbo"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to turborepo.com →
//         </a>
//       </footer>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { HeroSection } from '@/components/sections/hero-section'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Brain, FileText, Target, Users } from "lucide-react";

import Link from "next/link";
import { FeaturesSection } from "@/components/sections/features-section";


export default function HomePage() {
  return (
    
    <div className="min-h-screen min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
   <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      {/* Future sections will go here */}
    </div>
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {" "}
            CareerCraft AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your intelligent career companion. Optimize resumes, discover
            opportunities, and accelerate your career with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/resume-analysis">
                Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/resume-builder">Build Resume</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          AI-Powered Career Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-blue-600" />}
            title="AI Resume Analysis"
            description="Get instant ATS compatibility scores and optimization suggestions"
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-green-600" />}
            title="Smart Resume Builder"
            description="Create professional resumes with AI-powered content suggestions"
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-purple-600" />}
            title="Job Matching"
            description="Find perfect job matches based on your skills and preferences"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-orange-600" />}
            title="Interview Prep"
            description="Practice with AI mock interviews and get personalized feedback"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader>
        <div>{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent><CardDescription>
        {description}</CardDescription></CardContent>
    </Card>
  );
}
