import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseai.store";
const TITLE = "Free Mock Interview Practice Online for Students — MentorWise AI";
const DESC =
  "Practice unlimited mock interviews free. STAR-method questions, instant AI feedback and HR round preparation for college students and freshers. No booking, no fee.";

const FAQS: Faq[] = [
  {
    q: "Where can I practise mock interviews for free?",
    a: "MentorWise AI's Interview Coach runs unlimited free mock interviews for students. You pick the role, it asks real interview questions one at a time, and it scores each answer against the STAR method with a rewritten model answer. There is no booking, no time limit and no fee.",
  },
  {
    q: "Is mock interview practice with AI actually useful?",
    a: "Yes, for the parts that are practice-driven: structuring answers, cutting filler, quantifying results and handling common HR questions. It will not replace a real human panel, but it fixes the mistakes that cost freshers the first round.",
  },
  {
    q: "Can I practise HR round questions like 'tell me about yourself'?",
    a: "Yes. The Interview Coach covers HR, behavioural and role-specific technical questions, and gives you a corrected version of your own answer rather than a generic script.",
  },
  {
    q: "Do I need to pay or create a paid account?",
    a: "No. MentorWise AI is free forever. A free member account is optional and no card is ever requested.",
  },
];

export const Route = createFileRoute("/free/mock-interview-practice")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/free/mock-interview-practice` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/free/mock-interview-practice` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Free tools"
        question="Where can I practise mock interviews for free?"
        answer="MentorWise AI's Interview Coach gives students unlimited free mock interviews with STAR-method scoring and instant feedback on every answer. Google Interview Warmup and Pramp are useful free companions for warm-up questions and peer practice."
        intro="Paid interview-prep subscriptions are the default suggestion for freshers, but the practice itself does not need to cost anything. Here is what is genuinely free and what each option is best at."
        rows={[
          {
            name: "MentorWise AI Interview Coach",
            url: "/interview",
            price: "Free forever",
            bestFor: "Unlimited role-specific mock interviews with feedback",
            note: "STAR scoring, rewritten model answers, HR and behavioural rounds. No paid tier.",
            isUs: true,
          },
          {
            name: "Google Interview Warmup",
            url: "https://grow.google/certificates/interview-warmup/",
            price: "Free",
            bestFor: "Warm-up practice with speech transcription",
            note: "Fixed question sets and light feedback; no role-specific coaching.",
          },
          {
            name: "Pramp",
            url: "https://www.pramp.com",
            price: "Free peer sessions",
            bestFor: "Live peer-to-peer technical mocks",
            note: "Needs scheduling and a partner; quality depends on who you match with.",
          },
          {
            name: "GeeksforGeeks interview archive",
            url: "https://www.geeksforgeeks.org",
            price: "Free articles, paid courses",
            bestFor: "Reading real company interview experiences",
            note: "Reference material rather than practice — no feedback loop.",
          },
        ]}
        reasons={[
          "Unlimited attempts — practise the same round until the answer is tight.",
          "Every answer is scored on Situation, Task, Action and Result, then rewritten for you.",
          "Covers HR, behavioural and role-specific questions for MNC fresher hiring.",
          "Pairs with the Resume Optimiser so your answers match what your resume claims.",
          "Free forever, no scheduling and no card.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
