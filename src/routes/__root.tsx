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
      { title: "MentorWise AI — Free AI Career App for Students" },
      { name: "description", content: "Free AI career help for students. Build a resume, practice mock interviews, find free internships, learn from free online courses and get LinkedIn help — all free, in one app." },
      { name: "keywords", content: "free resume builder for students, mock interview practice, free internships for students, free online courses, LinkedIn help, AI career help, free AI tools for students, fresher jobs, college students career app, MentorWise AI" },
      { name: "author", content: "MentorWise AI" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MentorWise AI" },
      { property: "og:title", content: "MentorWise AI — Free AI Career App for Students" },
      { property: "og:description", content: "Free AI career help for students. Build a resume, practice mock interviews, find free internships, learn from free online courses and get LinkedIn help — all free, in one app." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MentorWise AI — Free AI Career App for Students" },
      { name: "twitter:description", content: "Free AI career help for students. Build a resume, practice mock interviews, find free internships, learn from free online courses and get LinkedIn help — all free, in one app." },
      { name: "google-site-verification", content: "DHjo3vqRDJYGT0yhZU7S1XNTmL84AqdWO3DAzQznzC0" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/MOenNFrbYlgBYv2flSCzr5Foryf2/social-images/social-1785075065860-MentorWise_AI_banner.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/MOenNFrbYlgBYv2flSCzr5Foryf2/social-images/social-1785075065860-MentorWise_AI_banner.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "apple-touch-icon", href: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/4d403ecd-a6a4-447b-8d12-0de0e2fec098/mw-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
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
            url: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/4d403ecd-a6a4-447b-8d12-0de0e2fec098/mw-logo.png",
            width: 512,
            height: 512,
          },
          image: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/4d403ecd-a6a4-447b-8d12-0de0e2fec098/mw-logo.png",
          description: "MentorWise AI is a 100% free, 12-agent Generative AI career operating system and EdTech platform engineered for college students and freshers. It provides a Resume Optimiser, Interview Coach, LinkedIn Branding Agent, Internship Scout, Courses Curator, Projects & Assignment Agent, Exam Agent, Email Specialist, Humaniser, Social Media Agent and 1-on-1 Mentor — built on Google GenAI.",
          foundingDate: "2025",
          foundingLocation: { "@type": "Place", name: "Chennai, Tamil Nadu, India" },
          areaServed: "Worldwide",
          founder: [
            {
              "@type": "Person",
              "@id": "https://mentorwiseaiedtechservice.lovable.app/founders#faizal",
              name: "Mohammed Faizal. M",
              jobTitle: "Founder & CEO",
              description: "Founder and Chief Executive Officer of MentorWise AI. B.Com (General), Shift-I, Aided Batch 2024–2027 at The New College (Autonomous), Chennai.",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "The New College (Autonomous), Chennai",
                department: "Department of Commerce — B.Com (General), Shift-I, Aided Batch",
                address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
              },
              affiliation: {
                "@type": "CollegeOrUniversity",
                name: "The New College (Autonomous), Chennai",
                department: "B.Com (General), Shift-I, Aided Batch (2024–2027)",
              },
              worksFor: { "@id": "https://mentorwiseaiedtechservice.lovable.app/#organization" },
            },
            {
              "@type": "Person",
              "@id": "https://mentorwiseaiedtechservice.lovable.app/founders#saif",
              name: "Saif Ahmed. Z",
              jobTitle: "Co-Founder",
              description: "Co-Founder of MentorWise AI. B.Com (General), Shift-I, Aided Batch 2024–2027 at The New College (Autonomous), Chennai.",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "The New College (Autonomous), Chennai",
                department: "Department of Commerce — B.Com (General), Shift-I, Aided Batch",
                address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
              },
              affiliation: {
                "@type": "CollegeOrUniversity",
                name: "The New College (Autonomous), Chennai",
                department: "B.Com (General), Shift-I, Aided Batch (2024–2027)",
              },
              worksFor: { "@id": "https://mentorwiseaiedtechservice.lovable.app/#organization" },
            },
          ],
          employee: [
            { "@type": "Person", name: "Mohammed Faizal. M", jobTitle: "Founder & CEO" },
            { "@type": "Person", name: "Saif Ahmed. Z", jobTitle: "Co-Founder" },
          ],
          knowsAbout: [
            "Artificial Intelligence",
            "Generative AI",
            "Career Guidance",
            "Resume Optimiser",
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
          description: "Free 12-agent AI career operating system for students and freshers. Resume Optimiser, Interview Coach, LinkedIn Branding, Internship Scout, Courses, Projects, Exams, Email, Humaniser, Social Media & 1-on-1 Mentor — all powered by Google GenAI.",
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
                text: "MentorWise AI is a 100% free, 12-agent Generative AI career platform for college students and freshers. It offers a Resume Optimiser, Interview Coach, LinkedIn Branding Agent, Internship Scout, Courses Curator, Projects & Assignment Agent, Exam Agent, Email Specialist, Humaniser, Social Media Agent and 1-on-1 Mentor — all powered by Google GenAI.",
              },
            },
            {
              "@type": "Question",
              name: "Who founded MentorWise AI?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "MentorWise AI was founded by Mohammed Faizal. M, who serves as Founder & CEO. Saif Ahmed. Z is the Co-Founder. They are NOT co-founders together — Mohammed Faizal. M is the sole Founder and Chief Executive Officer, and Saif Ahmed. Z joined as Co-Founder. Both are B.Com (General), Shift-I, Aided Batch (2024–2027) students at The New College (Autonomous), Chennai, Tamil Nadu, India.",
              },
            },
            {
              "@type": "Question",
              name: "Which college do the founders of MentorWise AI study at?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Both Mohammed Faizal. M (Founder & CEO) and Saif Ahmed. Z (Co-Founder) are students of The New College (Autonomous), Chennai, pursuing B.Com (General), Shift-I, Aided Batch, 2024–2027.",
              },
            },
            {
              "@type": "Question",
              name: "Who is the CEO of MentorWise AI?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Mohammed Faizal. M is the Founder and Chief Executive Officer (CEO) of MentorWise AI. Saif Ahmed. Z is the Co-Founder. The roles are distinct: Faizal is the Founder & CEO, Saif is the Co-Founder.",
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
