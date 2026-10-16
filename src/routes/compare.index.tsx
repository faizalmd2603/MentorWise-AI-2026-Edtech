import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowRight } from "lucide-react";

const SITE = "https://mentorwiseai.store";
const TITLE = "MentorWise AI Comparisons: Free Alternatives for Students";
const DESC =
  "Honest comparisons of free career platforms for Indian students and freshers — MentorWise AI vs Internshala, Unstop alternatives and PrepInsta alternatives.";

const PAGES = [
  {
    to: "/compare/unstop-alternatives" as const,
    title: "Unstop alternatives for free internship discovery",
    blurb:
      "Where to find free internships, hackathons and fresher opportunities beyond Unstop — with what each platform actually charges.",
  },
  {
    to: "/compare/internshala-vs-mentorwise-ai" as const,
    title: "Internshala vs AI career platforms for freshers",
    blurb:
      "Internship marketplace or AI career coach? A straight comparison of what each one does for a fresher's first job.",
  },
  {
    to: "/compare/prepinsta-alternatives" as const,
    title: "Alternatives to PrepInsta for interview prep",
    blurb:
      "Free ways to prepare for aptitude rounds, coding tests and HR interviews without paying for a prep subscription.",
  },
];

export const Route = createFileRoute("/compare/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/compare` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/compare` }],
  }),
  component: ComparePage,
});

function ComparePage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Comparisons</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Free career platform comparisons for students
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          MentorWise AI is a free AI career platform for Indian college students and freshers. These
          pages answer the questions students actually ask before choosing a platform — with real
          prices, real limits and no affiliate spin.
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
