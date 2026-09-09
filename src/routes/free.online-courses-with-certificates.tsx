import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AnswerPage, faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const TITLE = "Free Online Courses with Certificates for Students — MentorWise AI";
const DESC =
  "Genuinely free online courses with certificates for college students — Google, Microsoft Learn, NPTEL, AWS and freeCodeCamp — plus a free AI curator that builds your learning path.";

const FAQS: Faq[] = [
  {
    q: "Which online courses are free with a certificate?",
    a: "Google Digital Garage and Google Cloud Skills Boost, Microsoft Learn, NPTEL and SWAYAM, AWS Skill Builder and freeCodeCamp all issue free certificates. Coursera and edX let you audit course content free, but charge for the certificate.",
  },
  {
    q: "Do free certificates help a fresher's resume?",
    a: "They help when they match the role you are applying for and you can show a project built with the skill. A list of unrelated certificates adds nothing; two relevant ones plus a project change the conversation.",
  },
  {
    q: "How does MentorWise AI help with courses?",
    a: "The Courses Curator agent asks what role you are targeting and returns a sequenced, genuinely free learning path with live links, then the Projects agent turns it into a portfolio project recruiters can see.",
  },
  {
    q: "Is NPTEL free?",
    a: "NPTEL course content is free to learn. The proctored exam that leads to the graded certificate carries an exam fee, but the learning and the assignments do not.",
  },
];

export const Route = createFileRoute("/free/online-courses-with-certificates")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/free/online-courses-with-certificates` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/free/online-courses-with-certificates` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <AnswerPage
        eyebrow="Free tools"
        question="Which online courses are free and give a certificate?"
        answer="Google, Microsoft Learn, NPTEL/SWAYAM, AWS Skill Builder and freeCodeCamp all offer free courses with free certificates. MentorWise AI's Courses Curator sequences them into a free learning path for the exact role you are targeting."
        intro="Plenty of platforms advertise 'free courses' and then charge for the certificate. These are the ones that genuinely issue one at no cost, and how to turn them into something a recruiter cares about."
        rows={[
          {
            name: "MentorWise AI Courses Curator",
            url: "/agents",
            price: "Free forever",
            bestFor: "A sequenced free learning path for your target role",
            note: "Searches live sources and returns only genuinely free certifications, in order.",
            isUs: true,
          },
          {
            name: "Google Cloud Skills Boost & Digital Garage",
            url: "https://cloud.google.com/learn/training",
            price: "Free tiers with badges",
            bestFor: "Cloud, data and digital marketing basics",
            note: "Some advanced labs and paths are paid.",
          },
          {
            name: "Microsoft Learn",
            url: "https://learn.microsoft.com/training/",
            price: "Free",
            bestFor: "Azure, Power Platform, Microsoft 365 skills",
            note: "Free learning and badges; the proctored exams are paid.",
          },
          {
            name: "NPTEL / SWAYAM",
            url: "https://nptel.ac.in",
            price: "Free to learn",
            bestFor: "IIT/IISc-taught engineering and science courses",
            note: "The graded certificate requires a paid proctored exam.",
          },
          {
            name: "freeCodeCamp",
            url: "https://www.freecodecamp.org",
            price: "Free",
            bestFor: "Web development, Python and data analysis",
            note: "Certification is project-based, which reads well on a fresher resume.",
          },
        ]}
        reasons={[
          "Only genuinely free certifications are recommended — paid upsells are filtered out.",
          "Courses are sequenced for a specific role instead of listed at random.",
          "Links are checked against live search results, not recalled from memory.",
          "The Projects agent turns each course into a portfolio piece recruiters can open.",
          "Free forever, for every student.",
        ]}
        faqs={FAQS}
        updated="September 2026"
      />
    </SiteLayout>
  );
}
