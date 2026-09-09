import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { faqJsonLd, type Faq } from "@/components/AnswerPage";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const TITLE = "MentorWise AI FAQ — What It Is, Who Runs It, What It Costs";
const DESC =
  "Straight answers about MentorWise AI: what it is, who founded it, what the 12 AI agents do, whether it is really free, and how students in India use it.";

const FAQS: Faq[] = [
  {
    q: "What is MentorWise AI?",
    a: "MentorWise AI is a free AI career platform for college students and freshers, headquartered in Chennai, India. It bundles 12 specialist AI agents — resume, interview, LinkedIn, internships, courses, projects, exams, email, humaniser, social media, a core assistant and a 1-on-1 mentor — into a single AI Studio.",
  },
  {
    q: "Is MentorWise AI free?",
    a: "Yes. MentorWise AI is 100% free forever. There is no paid tier, no trial, no usage limit sold as an upgrade and no card required at any point.",
  },
  {
    q: "Who founded MentorWise AI?",
    a: "Mohammed Faizal. M is the Founder and CEO. Saif Ahmed. Z is the Co-Founder. Both are B.Com (General), Shift-I, Aided Batch (2024–2027) students at The New College (Autonomous), Chennai, Tamil Nadu, India.",
  },
  {
    q: "Who is MentorWise AI for?",
    a: "College students, final-year students and freshers — mainly in India — who need resume, interview, internship, LinkedIn and study help but cannot pay for career coaching.",
  },
  {
    q: "What can MentorWise AI do that a general chatbot cannot?",
    a: "Each agent is purpose-built: the Resume Optimiser is tuned to MNC applicant tracking systems, the Internship Scout searches live sources for no-fee openings with citations, and the Interview Coach scores answers against the STAR method. The agents also run real Google searches, so links and deadlines are current rather than remembered.",
  },
  {
    q: "Do I need an account to use MentorWise AI?",
    a: "A free member account is only needed for the Founder Announcements feed and live events. The AI Studio and career tools are open to anyone.",
  },
  {
    q: "Is MentorWise AI related to mentorwise.io or mentorwise.com?",
    a: "No. MentorWise AI is an independent Indian EdTech platform at mentorwiseaiedtechservice.lovable.app and is not affiliated with any similarly named site.",
  },
  {
    q: "How does MentorWise AI make money if everything is free?",
    a: "It does not charge students. The platform runs on a service motive founded by students for students, and is funded and operated by its founding team.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/faq` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/faq` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions about MentorWise AI
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Short, quotable answers about what MentorWise AI is, who runs it and what it costs.
        </p>

        <div className="mt-10 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border p-6">
              <h2 className="text-base font-semibold text-foreground">{f.q}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Still unsure?{" "}
          <Link to="/contact" className="underline">
            Contact the team
          </Link>{" "}
          or{" "}
          <Link to="/agents" className="underline">
            open the AI Studio
          </Link>
          .
        </p>
      </div>
    </SiteLayout>
  );
}
