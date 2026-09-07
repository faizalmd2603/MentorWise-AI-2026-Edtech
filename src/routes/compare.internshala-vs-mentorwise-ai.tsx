import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const TITLE = "Internshala vs AI Career Platforms for Freshers (2026)";
const DESC =
  "Internshala vs MentorWise AI and other AI career platforms for freshers: listings versus coaching, what each costs, and which one gets you shortlisted.";

const FAQS: Faq[] = [
  {
    q: "Is Internshala or an AI career platform better for freshers?",
    a: "They solve different problems. Internshala is a listings marketplace — it shows you internships. An AI career platform such as MentorWise AI prepares you for them: ATS resume, LinkedIn profile, mock interviews and outreach emails. Most freshers get the best result by using both, and both discovery and preparation are free on MentorWise AI.",
  },
  {
    q: "Is MentorWise AI free?",
    a: "Yes. Every one of the 12 MentorWise AI agents is free forever, with no paywall, trial or credit card.",
  },
  {
    q: "Does Internshala cost money?",
    a: "Browsing and applying to internships is free. Internshala's certified trainings, resume-building services and placement guarantee courses are paid.",
  },
  {
    q: "Which platform helps with ATS resume screening?",
    a: "MentorWise AI's Resume Optimiser is built around how Workday, Taleo, Greenhouse and Lever parse resumes, and it rewrites your bullets with measurable impact so they survive automated screening.",
  },
];

export const Route = createFileRoute("/compare/internshala-vs-mentorwise-ai")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/compare/internshala-vs-mentorwise-ai` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/compare/internshala-vs-mentorwise-ai` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Comparison"
        question="Internshala vs AI career platforms for freshers"
        answer="Internshala is the largest internship listings marketplace in India; MentorWise AI is a free AI career platform that prepares you to win those roles with an ATS resume, mock interviews, LinkedIn rewriting and application emails. Use Internshala to find the opening and MentorWise AI to get shortlisted — MentorWise AI costs nothing at any stage."
        intro="Freshers usually do not lose out because they cannot find openings. They lose out at the resume screen and the first interview round. That is the difference between a listings marketplace and an AI career platform, and it is worth knowing before you spend money on either."
        rows={[
          {
            name: "MentorWise AI",
            price: "100% free, forever",
            bestFor: "Getting shortlisted: resume, interview, LinkedIn, outreach",
            note: "12 specialist agents plus live mentoring. No paid tier of any kind.",
            isUs: true,
          },
          {
            name: "Internshala",
            url: "https://internshala.com/",
            price: "Free listings, paid trainings",
            bestFor: "Finding Indian internships at scale",
            note: "Best-in-class listings; preparation and resume services are paid.",
          },
          {
            name: "Unstop",
            url: "https://unstop.com/",
            price: "Free browsing, paid extras",
            bestFor: "Competitions and campus hiring",
            note: "Event-led rather than coaching-led.",
          },
          {
            name: "Naukri Campus",
            url: "https://www.naukri.com/campus",
            price: "Free with paid add-ons",
            bestFor: "Fresher job listings and assessments",
            note: "Job-search focused; little AI mentoring.",
          },
        ]}
        reasons={[
          "Free forever — the platform runs on a service motive, not subscriptions.",
          "Resume Optimiser is tuned to real ATS parsers, not generic templates.",
          "Interview Coach runs STAR-method mock rounds and grades your answers.",
          "One account covers resume, LinkedIn, internships, courses, projects and exam prep.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
