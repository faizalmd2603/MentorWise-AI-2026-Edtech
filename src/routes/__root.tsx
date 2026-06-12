import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MentorWise AI — Free 12-Agent AI Career Arsenal for Students" },
      { name: "description", content: "MentorWise AI is a free 12-agent AI career operating system for students and freshers. Resume Optimiser, Interview Coach, LinkedIn Branding, Internship Scout, Courses, Projects, Exams, Email Specialist, Humaniser, Social Media & 1-on-1 Mentor — all powered by Google GenAI. 100% free forever." },
      { name: "author", content: "MentorWise AI" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MentorWise AI" },
      { property: "og:title", content: "MentorWise AI — Free 12-Agent AI Career Arsenal for Students" },
      { property: "og:description", content: "Free 12-agent AI career stack for students. Resume Optimiser, Interview Coach, LinkedIn Agent, Internship Scout, Courses, Projects, Exams & more. 100% free." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MentorWise AI — Free 12-Agent AI Career Arsenal for Students" },
      { name: "twitter:description", content: "Free 12-agent AI career stack for students. Resume Optimiser, Interview Coach, LinkedIn Agent, Internship Scout, Courses, Projects, Exams & more. 100% free." },
      { name: "google-site-verification", content: "DHjo3vqRDJYGT0yhZU7S1XNTmL84AqdWO3DAzQznzC0" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/1b0ef6b9-d92b-42d1-a7c5-510c337e758e/mw-logo-3d.jpeg" },
      { rel: "shortcut icon", type: "image/jpeg", href: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/1b0ef6b9-d92b-42d1-a7c5-510c337e758e/mw-logo-3d.jpeg" },
      { rel: "apple-touch-icon", href: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/1b0ef6b9-d92b-42d1-a7c5-510c337e758e/mw-logo-3d.jpeg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://mentorwiseaiedtechservice.lovable.app/#organization",
          name: "MentorWise AI",
          alternateName: ["MentorWise", "MentorWise AI EdTech", "MentorWiseAI"],
          url: "https://mentorwiseaiedtechservice.lovable.app/",
          logo: {
            "@type": "ImageObject",
            url: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/1b0ef6b9-d92b-42d1-a7c5-510c337e758e/mw-logo-3d.jpeg",
            width: 512,
            height: 512,
          },
          image: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/1b0ef6b9-d92b-42d1-a7c5-510c337e758e/mw-logo-3d.jpeg",
          description: "MentorWise AI is a 100% free, 12-agent Generative AI career operating system and EdTech platform engineered for college students and freshers. It provides ATS resume building, mock interview simulation, LinkedIn personal branding, free internships, courses and exam prep — built on Google GenAI.",
          foundingDate: "2025",
          foundingLocation: { "@type": "Place", name: "Chennai, Tamil Nadu, India" },
          areaServed: "Worldwide",
          founder: [
            { "@type": "Person", name: "Mohammed Faizal. M", jobTitle: "Founder & CEO", alumniOf: "The New College, Chennai" },
            { "@type": "Person", name: "Saif Ahmed. Z", jobTitle: "Co-Founder", alumniOf: "The New College, Chennai" },
          ],
          knowsAbout: [
            "Artificial Intelligence",
            "Generative AI",
            "Career Guidance",
            "ATS Resume Building",
            "Mock Interview Simulation",
            "LinkedIn Personal Branding",
            "Free Internships for Students",
            "EdTech for Freshers",
            "Job Search for College Students",
          ],
          sameAs: [
            "https://www.linkedin.com/company/mentorwise-ai",
            "https://www.linkedin.com/in/mohammed-faizal-m-b3242b311",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://mentorwiseaiedtechservice.lovable.app/#website",
          url: "https://mentorwiseaiedtechservice.lovable.app/",
          name: "MentorWise AI",
          publisher: { "@id": "https://mentorwiseaiedtechservice.lovable.app/#organization" },
          inLanguage: "en",
          description: "Free 12-agent AI career operating system for students and freshers.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is MentorWise AI?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "MentorWise AI is a 100% free, 12-agent Generative AI career platform for college students and freshers. It offers an ATS resume builder, mock interview simulator, LinkedIn growth agent, free internship scout, courses curator and exam prep — all powered by Google GenAI.",
              },
            },
            {
              "@type": "Question",
              name: "Who founded MentorWise AI?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "MentorWise AI was founded by Mohammed Faizal. M (Founder & CEO) and Saif Ahmed. Z (Co-Founder), B.Com students at The New College, Chennai, India.",
              },
            },
            {
              "@type": "Question",
              name: "Is MentorWise AI really free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. MentorWise AI runs on a 100% service-motive philosophy and is free forever for students. There are no paywalls, subscriptions or credit card requirements.",
              },
            },
            {
              "@type": "Question",
              name: "What can MentorWise AI agents do?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The 12 agents cover resume building, interview coaching, LinkedIn branding, internships, courses, projects, exams, email writing, AI humanising, social media and live mentoring — engineered to MNC-grade quality for freshers.",
              },
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
