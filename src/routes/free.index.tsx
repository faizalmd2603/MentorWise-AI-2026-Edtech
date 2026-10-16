import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowRight } from "lucide-react";

const SITE = "https://mentorwiseai.store";
const TITLE = "Free AI Career Tools for Students — MentorWise AI";
const DESC =
  "Free resume builder, free mock interview practice, free internship search and free online courses for college students and freshers. No payment, no trial, no card.";

const PAGES = [
  {
    to: "/free/resume-builder" as const,
    title: "Free resume builder for students",
    blurb: "Build an ATS-ready resume in minutes with an AI guide beside you. Free forever.",
  },
  {
    to: "/free/mock-interview-practice" as const,
    title: "Free mock interview practice online",
    blurb: "Unlimited STAR-method mock interviews with instant feedback — no booking, no fee.",
  },
  {
    to: "/free/internships-for-students" as const,
    title: "Free internships for college students in India",
    blurb: "Where to find genuinely free internships, LOR programmes and government schemes.",
  },
  {
    to: "/free/online-courses-with-certificates" as const,
    title: "Free online courses with certificates",
    blurb: "Certifications that are actually free — Google, Microsoft Learn, NPTEL, AWS and more.",
  },
];

export const Route = createFileRoute("/free/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/free` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/free` }],
  }),
  component: FreeHub,
});

function FreeHub() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Free tools</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Free AI career tools for college students and freshers
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          MentorWise AI is a free AI career app built in Chennai, India for students. Every tool
          below is free forever — no paid plan, no trial and no card. These pages answer the plain
          questions students ask before they start.
        </p>

        <div className="mt-10 space-y-4">
          {PAGES.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="block rounded-2xl border border-border p-6 transition hover:border-primary/50 hover:bg-primary/5"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                {p.title} <ArrowRight className="h-4 w-4 text-primary" />
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
