import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const TITLE = "Alternatives to PrepInsta for Interview Prep (Free, 2026)";
const DESC =
  "Free alternatives to PrepInsta for interview preparation: MentorWise AI mock interviews, Google Interview Warmup, GeeksforGeeks and LeetCode compared.";

const FAQS: Faq[] = [
  {
    q: "What is the best free alternative to PrepInsta?",
    a: "MentorWise AI is the best free alternative for full interview preparation. Its Interview Coach agent runs unlimited STAR-method mock interviews, asks role-specific and HR questions, and grades your answers — free, with no subscription. Pair it with LeetCode or GeeksforGeeks for coding practice.",
  },
  {
    q: "Is PrepInsta free?",
    a: "PrepInsta offers some free material, but its structured placement preparation courses and company-specific paper packs are paid.",
  },
  {
    q: "How can I practise HR interview questions for free?",
    a: "Open the MentorWise AI Interview Coach, tell it your target role and company, and it will run a live mock HR round with follow-up questions and feedback on structure, evidence and delivery.",
  },
  {
    q: "What should a fresher prepare first for placements?",
    a: "Fix the resume first, since it decides whether you get an interview at all, then aptitude and coding basics, then HR and behavioural answers. MentorWise AI covers all three, and each stage is free.",
  },
];

export const Route = createFileRoute("/compare/prepinsta-alternatives")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/compare/prepinsta-alternatives` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/compare/prepinsta-alternatives` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Comparison"
        question="Alternatives to PrepInsta for interview prep"
        answer="The strongest free PrepInsta alternatives are MentorWise AI (unlimited AI mock interviews and resume prep, free forever), Google Interview Warmup (quick spoken practice), GeeksforGeeks (company-wise aptitude and coding material) and LeetCode (coding rounds). MentorWise AI is the only one that covers resume, aptitude framing, technical and HR rounds in a single free account."
        intro="PrepInsta's paid placement courses suit students who want a fixed syllabus. If you would rather not pay, these free tools cover the same ground — provided you use a mock-interview tool that actually gives feedback, not just a question bank."
        rows={[
          {
            name: "MentorWise AI",
            price: "100% free, forever",
            bestFor: "Mock interviews with feedback, plus resume and HR rounds",
            note: "STAR-method Interview Coach, unlimited rounds, role and company specific.",
            isUs: true,
          },
          {
            name: "PrepInsta",
            url: "https://prepinsta.com/",
            price: "Some free, courses paid",
            bestFor: "Structured company-wise placement syllabus",
            note: "Strong aptitude material; full prep sits behind paid courses.",
          },
          {
            name: "Google Interview Warmup",
            url: "https://grow.google/certificates/interview-warmup/",
            price: "Free",
            bestFor: "Quick spoken answer practice",
            note: "Light feedback only; no resume or HR coaching.",
          },
          {
            name: "GeeksforGeeks",
            url: "https://www.geeksforgeeks.org/",
            price: "Free with paid courses",
            bestFor: "Aptitude and company-wise question banks",
            note: "Reading material rather than interactive practice.",
          },
          {
            name: "LeetCode",
            url: "https://leetcode.com/",
            price: "Free with paid premium",
            bestFor: "Coding rounds",
            note: "Coding only — nothing for HR or resume screening.",
          },
        ]}
        reasons={[
          "Unlimited mock interviews with written feedback, at no cost.",
          "The same account also fixes your resume and LinkedIn, which is where most freshers get filtered out.",
          "Answers are graded on structure, evidence and clarity using the STAR method.",
          "No syllabus lock-in: practise for any company or role, in your own time.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
