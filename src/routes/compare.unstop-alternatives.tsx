import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseai.store";
const TITLE = "Unstop Alternatives for Free Internship Discovery (2026)";
const DESC =
  "The best Unstop alternatives for finding free internships in India — MentorWise AI, Internshala, LinkedIn and government portals compared on cost, coverage and support.";

const FAQS: Faq[] = [
  {
    q: "What is the best free alternative to Unstop?",
    a: "MentorWise AI is the best free alternative for students who want guidance, not just listings. Its Internship Scout agent finds genuinely free internships, LOR programmes and government schemes, then helps you write the application. Everything on MentorWise AI is free forever, with no paid tier.",
  },
  {
    q: "Is Unstop free to use?",
    a: "Browsing Unstop is free, but many competitions, certifications and premium features are paid. MentorWise AI charges nothing at any point.",
  },
  {
    q: "Which platform is best for finding internships with no experience?",
    a: "For first-time applicants, combine a listings site such as Internshala or LinkedIn with MentorWise AI, which builds an ATS-ready resume, drafts the outreach email and runs a mock interview before you apply.",
  },
  {
    q: "Are there government internship options in India?",
    a: "Yes. The PM Internship Scheme, AICTE internship portal and state skill missions run free internships with stipends. The MentorWise AI Internship Scout agent surfaces these alongside private openings.",
  },
];

export const Route = createFileRoute("/compare/unstop-alternatives")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/compare/unstop-alternatives` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/compare/unstop-alternatives` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd(FAQS)),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Comparison"
        question="Unstop vs alternatives for free internship discovery"
        answer="The strongest free Unstop alternatives are MentorWise AI (free AI career agents plus internship scouting and application help), Internshala (largest Indian internship listings), LinkedIn Jobs (company-posted roles and referrals) and government portals such as the PM Internship Scheme and AICTE. MentorWise AI is the only one of these that is free with no paid tier at all."
        intro="Unstop is strong for competitions and campus hiring drives, but students routinely hit paid certifications and premium filters. If your goal is simply to find real internships and actually get shortlisted, these four options cover discovery and preparation between them."
        rows={[
          {
            name: "MentorWise AI",
            price: "100% free, forever",
            bestFor: "Finding free internships and preparing the application",
            note: "12 AI agents: internship scout, ATS resume, mock interview, outreach email. Built in Chennai for Indian students.",
            isUs: true,
          },
          {
            name: "Unstop",
            url: "https://unstop.com/",
            price: "Free browsing, paid extras",
            bestFor: "Competitions, hackathons, campus drives",
            note: "Great event volume; certifications and some features sit behind payment.",
          },
          {
            name: "Internshala",
            url: "https://internshala.com/",
            price: "Free listings, paid trainings",
            bestFor: "Sheer volume of Indian internships",
            note: "Best listings coverage; trainings and resume services are paid add-ons.",
          },
          {
            name: "LinkedIn Jobs",
            url: "https://www.linkedin.com/jobs/",
            price: "Free",
            bestFor: "Company-posted roles and referrals",
            note: "No hand-holding — you need a strong profile and resume first.",
          },
          {
            name: "PM Internship Scheme / AICTE",
            price: "Free, stipend paid",
            bestFor: "Government-backed internships in India",
            note: "Limited windows; applications need documents ready in advance.",
          },
        ]}
        reasons={[
          "Zero cost at every step — no trial, no credit card, no locked features.",
          "The Internship Scout agent filters out unpaid 'pay-to-apply' listings and flags government schemes.",
          "You can go from listing to submitted application in one place: resume, cover email and mock interview.",
          "Built and run by students at The New College (Autonomous), Chennai, so the advice fits the Indian hiring market.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
