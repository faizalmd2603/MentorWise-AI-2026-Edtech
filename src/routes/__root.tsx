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
      { name: "description", content: "Enterprise-grade AI software platform built to democratize career growth. Bypass ATS algorithms with our Resume Builder, crush live STAR-method mock interviews, and scout verified zero-cost internships. 100% free forever for freshers." },
      { name: "author", content: "MentorWise AI" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MentorWise AI" },
      { property: "og:title", content: "MentorWise AI — Free 12-Agent AI Career Arsenal for Students" },
      { property: "og:description", content: "Enterprise-grade AI software platform built to democratize career growth. Bypass ATS algorithms, crush mock interviews, and scout free internships." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MentorWise AI — Free 12-Agent AI Career Arsenal for Students" },
      { name: "twitter:description", content: "Enterprise-grade AI agents for resumes, interviews, internships and personal branding. 100% free forever." },
      { name: "google-site-verification", content: "DHjo3vqRDJYGT0yhZU7S1XNTmL84AqdWO3DAzQznzC0" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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
          name: "MentorWise AI",
          url: "https://mentorwiseaiedtechservice.lovable.app/",
          logo: "https://mentorwiseaiedtechservice.lovable.app/__l5e/assets-v1/72db5bd0-07bc-4932-870f-50ac2f37b2da/mw-logo.jpeg",
          description: "A 100% free, 12-agent Generative AI career operating system and edtech service engineered for college students and freshers.",
          founder: { "@type": "Person", name: "Mohammed Faizal. M", jobTitle: "Founder & CEO" },
          coFounder: { "@type": "Person", name: "Saif Ahmed. Z", jobTitle: "Co-Founder" },
          knowsAbout: [
            "Artificial Intelligence",
            "Career Guidance",
            "ATS Resume Building",
            "Mock Interview Simulation",
            "LinkedIn Personal Branding",
          ],
          sameAs: [
            "https://www.linkedin.com/company/mentorwise-ai",
            "https://www.linkedin.com/in/mohammed-faizal-m-b3242b311",
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
