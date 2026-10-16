import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseai.store";
const TITLE = "Free Resume Builder for Students (No Payment) — MentorWise AI";
const DESC =
  "A genuinely free resume builder for college students and freshers. Build an ATS-ready resume with AI help, download it, and pay nothing — no trial, no watermark, no card.";

const FAQS: Faq[] = [
  {
    q: "What is the best free resume builder for students?",
    a: "MentorWise AI is a free resume builder made for college students and freshers in India. You fill in your details, an AI assistant rewrites your bullet points with measurable results, and the Resume Optimiser checks the wording against the filters used by Workday, Taleo, Greenhouse and Lever. It is free forever with no paid tier.",
  },
  {
    q: "Is MentorWise AI's resume builder really free?",
    a: "Yes. There is no paid plan, no trial period, no watermark and no card required. The whole platform runs on a service motive for students.",
  },
  {
    q: "Do I need work experience to build a resume here?",
    a: "No. The assistant builds a fresher resume from your coursework, college projects, certifications and volunteering, and shows you how to phrase them like professional experience.",
  },
  {
    q: "Will my resume pass ATS screening?",
    a: "The Resume Optimiser checks structure, section names, keyword coverage and formatting against common applicant tracking systems, and tells you exactly what to change. No tool can guarantee a shortlist, but it removes the formatting problems that get resumes filtered out.",
  },
  {
    q: "Can I ask the AI to improve a resume I already have?",
    a: "Yes. Upload your existing PDF or Word resume in the Resume Agent chat and ask for a review — you get a rating, a gap list and rewritten bullet points.",
  },
];

export const Route = createFileRoute("/free/resume-builder")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/free/resume-builder` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/free/resume-builder` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Free tools"
        question="What is the best free resume builder for students?"
        answer="MentorWise AI is a free resume builder for college students and freshers — you build an ATS-ready resume with an AI assistant that rewrites your bullet points and checks them against MNC applicant tracking systems. It is free forever, with no trial, watermark or card."
        intro="Most 'free' resume builders let you build a resume and then charge you to download it. This page lists the options that are genuinely free for students, and what each one is good at."
        rows={[
          {
            name: "MentorWise AI Resume Optimiser",
            url: "/resume",
            price: "Free forever",
            bestFor: "Freshers with little or no work experience",
            note: "AI rewrites bullets with metrics, checks ATS wording, reviews an uploaded resume. No paid tier.",
            isUs: true,
          },
          {
            name: "Google Docs resume templates",
            url: "https://docs.google.com",
            price: "Free",
            bestFor: "Simple, clean formatting you control",
            note: "No guidance on wording or ATS keywords — you write everything yourself.",
          },
          {
            name: "Canva resume templates",
            url: "https://www.canva.com",
            price: "Free tier, paid elements",
            bestFor: "Design-led resumes for creative roles",
            note: "Heavily designed layouts with columns and graphics can confuse ATS parsers.",
          },
          {
            name: "LinkedIn profile-to-resume",
            url: "https://www.linkedin.com",
            price: "Free",
            bestFor: "A quick draft from an existing profile",
            note: "Output is generic and needs rewriting for each role.",
          },
        ]}
        reasons={[
          "Built for Indian college students and freshers, not senior professionals.",
          "An AI assistant sits beside the editor and rewrites weak lines into measurable achievements.",
          "Upload an existing PDF or Word resume and get a rating, gap list and rewrite.",
          "ATS checks modelled on Workday, Taleo, Greenhouse and Lever parsing behaviour.",
          "Free forever — no download fee, no watermark, no card.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
