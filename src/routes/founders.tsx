import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import founder from "@/assets/founder-faizal.jpeg.asset.json";
import cofounder from "@/assets/cofounder-saif.jpeg.asset.json";
import aqhib from "@/assets/aqhib.jpeg.asset.json";
import { Mail, MessageCircle, Linkedin } from "lucide-react";


const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const FOUNDER_OG = `${SITE}${founder.url}`;

const FOUNDERS_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/founders#faizal`,
      name: "Mohammed Faizal. M",
      jobTitle: "Founder & CEO",
      description:
        "Founder and Chief Executive Officer (CEO) of MentorWise AI. B.Com (General), Shift-I, Aided Batch (2024–2027) at The New College (Autonomous), Chennai, Tamil Nadu, India.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "The New College (Autonomous), Chennai",
        department: "B.Com (General), Shift-I, Aided Batch (2024–2027)",
        address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      },
      worksFor: { "@type": "Organization", name: "MentorWise AI", url: SITE },
      sameAs: ["https://www.linkedin.com/in/mohammed-faizal-m-b3242b311"],
    },
    {
      "@type": "Person",
      "@id": `${SITE}/founders#saif`,
      name: "Saif Ahmed. Z",
      jobTitle: "Co-Founder",
      description:
        "Co-Founder of MentorWise AI. B.Com (General), Shift-I, Aided Batch (2024–2027) at The New College (Autonomous), Chennai, Tamil Nadu, India.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "The New College (Autonomous), Chennai",
        department: "B.Com (General), Shift-I, Aided Batch (2024–2027)",
        address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      },
      worksFor: { "@type": "Organization", name: "MentorWise AI", url: SITE },
      sameAs: ["https://www.linkedin.com/in/saif-ahmed-a9a610353"],
    },
  ],
};

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Founders of MentorWise AI — Mohammed Faizal (CEO) & Saif Ahmed (Co-Founder) | The New College, Chennai" },
      { name: "description", content: "Mohammed Faizal. M is the Founder & CEO of MentorWise AI. Saif Ahmed. Z is the Co-Founder. Both are B.Com (General), Shift-I, Aided Batch (2024–2027) students at The New College (Autonomous), Chennai." },
      { property: "og:title", content: "Founders of MentorWise AI — Faizal (CEO) & Saif (Co-Founder)" },
      { property: "og:description", content: "Founder & CEO Mohammed Faizal. M and Co-Founder Saif Ahmed. Z — B.Com (General), Shift-I, Aided Batch (2024–2027), The New College (Autonomous), Chennai." },
      { property: "og:url", content: `${SITE}/founders` },
      { property: "og:image", content: FOUNDER_OG },
      { name: "twitter:image", content: FOUNDER_OG },
    ],
    links: [{ rel: "canonical", href: `${SITE}/founders` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(FOUNDERS_JSONLD) },
    ],
  }),
  component: Founders,
});

type Profile = {
  name: string;
  title: string;
  bio: string;
  image: string;
  email: string;
  whatsapp: string;
  linkedin: string;
};

const profiles: Profile[] = [
  {
    name: "Mohammed Faizal. M",
    title: "Founder & CEO",
    bio: "Founder and Chief Executive Officer of MentorWise AI. B.Com (General), Shift-I, Aided Batch (2024–2027) at The New College (Autonomous), Chennai. Leads the vision, product, and engineering — building the global standard for free, MNC-grade career tooling for students.",
    image: founder.url,
    email: "mentorwiseaiedtech@gmail.com",
    whatsapp: "https://wa.me/916383969289",
    linkedin: "https://www.linkedin.com/in/mohammed-faizal-m-b3242b311?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Saif Ahmed. Z",
    title: "Co-Founder",
    bio: "Co-Founder of MentorWise AI. B.Com (General), Shift-I, Aided Batch (2024–2027) at The New College (Autonomous), Chennai. Drives operations, partnerships, and open-access networks to scale MentorWise AI globally.",
    image: cofounder.url,
    email: "saifahmedmentorwise@gmail.com",
    whatsapp: "https://wa.me/918668032758",
    linkedin: "https://www.linkedin.com/in/saif-ahmed-a9a610353?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
];

function Founders() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">Leadership</div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Meet the <span className="text-gradient">Founders</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Founder &amp; CEO Mohammed Faizal. M and Co-Founder Saif Ahmed. Z — B.Com (General), Shift-I, Aided Batch (2024–2027), The New College (Autonomous), Chennai.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {profiles.map((p, i) => (
            <article key={p.name} className="relative rounded-3xl glass-strong p-6 sm:p-8 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyber/20 via-transparent to-magenta/20 pointer-events-none opacity-50" />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyber/40 to-magenta/30 blur-xl opacity-70" />
                  <img
                    src={p.image}
                    alt={p.name}
                    className="relative h-44 w-44 rounded-3xl object-cover ring-2 ring-cyber/40 shadow-2xl"
                  />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">{p.name}</h2>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-cyber">{p.title}</div>
                <p className="mt-4 max-w-md text-sm text-muted-foreground">{p.bio}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <a href={`mailto:${p.email}`} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium hover:scale-[1.05] hover:glow-cyan transition">
                    <Mail className="h-3.5 w-3.5 text-cyber" /> Email
                  </a>
                  <a href={p.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium hover:scale-[1.05] hover:glow-cyan transition">
                    <MessageCircle className="h-3.5 w-3.5 text-cyber" /> WhatsApp
                  </a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium hover:scale-[1.05] hover:glow-cyan transition">
                    <Linkedin className="h-3.5 w-3.5 text-cyber" /> LinkedIn
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
