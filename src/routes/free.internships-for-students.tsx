import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseai.store";
const TITLE = "Free Internships for College Students in India — MentorWise AI";
const DESC =
  "How to find free internships, LOR programmes and government internship schemes as a college student in India — and get shortlisted with a free AI resume and mock interviews.";

const FAQS: Faq[] = [
  {
    q: "How can a college student find a free internship in India?",
    a: "Combine a listings platform with a government portal and application help. Internshala and LinkedIn carry the most private openings, the PM Internship Scheme and AICTE portal run government internships with stipends, and MentorWise AI's Internship Scout finds free programmes and then writes your application, resume and outreach email at no cost.",
  },
  {
    q: "Should I ever pay for an internship?",
    a: "No. A legitimate internship never asks the student for a registration, training or placement fee. Treat any request for payment as a warning sign.",
  },
  {
    q: "Can I get an internship in first or second year?",
    a: "Yes. Remote, research and NGO internships, open-source programmes and virtual job simulations accept junior students. The Internship Scout agent filters specifically for openings with no experience requirement.",
  },
  {
    q: "What is a LOR internship?",
    a: "An internship whose main reward is a letter of recommendation and a certificate rather than a stipend. They are useful early on for building a resume, and many are run by universities, research labs and non-profits.",
  },
];

export const Route = createFileRoute("/free/internships-for-students")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/free/internships-for-students` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/free/internships-for-students` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Free tools"
        question="How do college students find free internships in India?"
        answer="Use a listings site for volume, a government portal for stipend-backed places, and MentorWise AI's free Internship Scout to find no-fee programmes and write the application. You should never pay a fee to get an internship."
        intro="Internship hunting fails for freshers at two points: finding openings that do not charge a 'training fee', and actually getting shortlisted. These options cover both sides."
        rows={[
          {
            name: "MentorWise AI Internship Scout",
            url: "/internships",
            price: "Free forever",
            bestFor: "Finding no-fee internships and writing the application",
            note: "Searches live sources, filters out paid 'training' schemes, then drafts resume, email and interview prep.",
            isUs: true,
          },
          {
            name: "PM Internship Scheme",
            url: "https://pminternship.mca.gov.in",
            price: "Free, stipend paid",
            bestFor: "Government-backed internships at large Indian companies",
            note: "Eligibility rules and fixed application windows.",
          },
          {
            name: "Internshala",
            url: "https://internshala.com",
            price: "Free listings, paid courses",
            bestFor: "Largest volume of Indian internship listings",
            note: "Applications are competitive; the prep courses are paid.",
          },
          {
            name: "LinkedIn Jobs",
            url: "https://www.linkedin.com/jobs",
            price: "Free",
            bestFor: "Company-posted roles and referrals",
            note: "Needs a strong profile — a weak one gets filtered before a human reads it.",
          },
        ]}
        reasons={[
          "Filters out 'pay for training' schemes that target students.",
          "Surfaces government, MNC and open-source programmes in one search.",
          "Writes the application email, cover note and resume tailored to the opening.",
          "Runs a mock interview for the same role before you apply.",
          "Free forever — the platform never charges students.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
