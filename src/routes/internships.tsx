import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Briefcase, Award, Mail, CheckCircle2 } from "lucide-react";

const SITE = "https://mentorwiseai.store";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Free Internships for Students & Freshers | MentorWise AI" },
      { name: "description", content: "Find free internships, free online courses with certificate, and free letters of recommendation. Made for college students and freshers." },
      { property: "og:title", content: "Free Internships for Students & Freshers | MentorWise AI" },
      { property: "og:description", content: "Free internships, free certifications and free letters of recommendation for students and freshers." },
      { property: "og:url", content: `${SITE}/internships` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/internships` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${SITE}/internships`,
          url: `${SITE}/internships`,
          name: "Free Internships for Students & Freshers",
          description: "Curated free internships, free certifications and free letters of recommendation for college students and freshers.",
          isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/` },
        }),
      },
    ],
  }),
  component: InternshipsPage,
});

function InternshipsPage() {
  const features = [
    { icon: Briefcase, title: "Verified Free Internships", text: "Curated remote and in-office internships with real companies — every listing manually verified as zero-cost." },
    { icon: Award, title: "Free Certifications", text: "Upskilling paths from Google, Microsoft, AWS, HubSpot and more — sorted by ROI for fresher resumes." },
    { icon: Mail, title: "Letters of Recommendation", text: "Eligible programs that grant professional LORs — a recruiter-grade signal for your next application." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <Briefcase className="h-3.5 w-3.5" /> Internship Scout
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Verified <span className="text-gradient">Zero-Cost Internships</span> & free certifications.
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            An automated search engine curating completely free internships, upskilling paths, and professional letters of recommendation for early-career growth — built for students who refuse to pay for opportunities.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/agents" className="rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.03] hover:brightness-110 transition glow-cyan">Open Internship Scout</Link>
            <Link to="/resources/job-search-sites" className="rounded-full glass px-5 py-3 text-sm font-semibold hover:scale-[1.03] hover:glow-cyan transition">Best free job sites</Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="glass rounded-2xl p-6 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyber/15 text-cyber ring-1 ring-cyber/30">
                <f.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl glass-strong p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold">What gets scouted</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Remote internships across tech, design, marketing & finance", "Government & NGO programs with stipends", "Free certifications that recruiters actually recognize", "Letter-of-recommendation eligible roles"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyber" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
