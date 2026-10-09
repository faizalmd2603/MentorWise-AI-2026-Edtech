import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import founder from "@/assets/founder-faizal.jpeg.asset.json";
import cofounder from "@/assets/cofounder-saif.jpeg.asset.json";
import aqhib from "@/assets/aqhib.jpeg.asset.json";
import saadh from "@/assets/team/saadh-mohammed.jpg.asset.json";
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
    {
      "@type": "Person",
      "@id": `${SITE}/founders#aqhib`,
      name: "Mohammed Aqhib. K",
      jobTitle: "Administrator & Chief Communications Officer (CCO)",
      description:
        "Administrator and Chief Communications Officer of MentorWise AI. Final-year B.Com student at The New College (Autonomous), Chennai — Day Shift, Government-Aided.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "The New College (Autonomous), Chennai",
        department: "B.Com — Day Shift, Government-Aided",
        address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      },
      worksFor: { "@type": "Organization", name: "MentorWise AI", url: SITE },
      sameAs: ["https://www.linkedin.com/in/mohammed-aqhib-6639902a5"],
    },
    {
      "@type": "Person",
      "@id": `${SITE}/founders#saadh`,
      name: "Saadh Mohammed",
      jobTitle: "Executive Director — Finance & Strategy Mentor",
      image: `${SITE}${saadh.url}`,
      description:
        "Executive Director — Finance & Strategy Mentor at MentorWise AI.",
      worksFor: { "@type": "Organization", name: "MentorWise AI", url: SITE },
      sameAs: ["https://www.linkedin.com/in/saadh-mohammed21/"],
    },
  ],
};



export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Elite Team — MentorWise AI | Core Team & Campus Leaders" },
      { name: "description", content: "The MentorWise AI Elite Team — Founder & CEO Mohammed Faizal. M, Co-Founder Saif Ahmed. Z, CCO Mohammed Aqhib. K, and our Tier-1 Elite Campus Leaders across India." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Elite Team — MentorWise AI" },
      { property: "og:description", content: "Meet the MentorWise AI Elite Team — core team and Tier-1 Elite Campus Leaders." },

      { property: "og:url", content: `${SITE}/founders` },
      { property: "og:image", content: FOUNDER_OG },
      { name: "twitter:image", content: FOUNDER_OG },
    ],

    links: [{ rel: "canonical", href: `${SITE}/founders` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(FOUNDERS_JSONLD) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${SITE}/founders`,
          url: `${SITE}/founders`,
          name: "MentorWise AI Elite Team — Core Team & Campus Leaders",
          description: "Profiles of the MentorWise AI core team: Founder & CEO Mohammed Faizal. M, Co-Founder Saif Ahmed. Z, CCO Mohammed Aqhib. K and Executive Director Saadh Mohammed.",
          about: [
            { "@id": `${SITE}/founders#faizal` },
            { "@id": `${SITE}/founders#saif` },
            { "@id": `${SITE}/founders#aqhib` },
            { "@id": `${SITE}/founders#saadh` },
          ],
        }),
      },
    ],
  }),
  component: Founders,
});

type Profile = {
  name: string;
  title: string;
  bio: string;
  image?: string;
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
  {
    name: "Mohammed Aqhib. K",
    title: "Administrator & CCO",
    bio: "Administrator and Chief Communications Officer (CCO) at MentorWise AI. Final-year B.Com student at The New College (Autonomous), Chennai — Day Shift, Government-Aided. Leads communications, community and administrative operations.",
    image: aqhib.url,
    email: "author.aqhib.7@gmail.com",
    whatsapp: "https://wa.me/919176771119",
    linkedin: "https://www.linkedin.com/in/mohammed-aqhib-6639902a5?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Saadh Mohammed",
    title: "Executive Director — Finance & Strategy Mentor",
    bio: "Executive Director at MentorWise AI, leading finance and strategy. Mentors students on money skills, financial literacy and long-term career strategy across the MentorWise AI ecosystem.",
    image: saadh.url,
    email: "mohammed.saadh21@gmail.com",
    whatsapp: "https://wa.me/919677122760",
    linkedin: "https://www.linkedin.com/in/saadh-mohammed21/",
  },
];


type CampusLeader = { name: string; institute: string; linkedin: string; note?: string };

const CAMPUS_LEADERS: CampusLeader[] = [
  {
    name: "Muavvidh Buhary. S",
    institute: "MEASI Institute of Management, Chennai",
    linkedin: "https://www.linkedin.com/in/muavvidhbuhary/",
  },
  {
    name: "Aasiya Mufridha. S",
    institute: "Wavoo Wajeeha Women's College of Arts & Science, Kayalpattinam",
    linkedin: "https://www.linkedin.com/in/aasiya-mufridha-s-126882348/",
  },
  {
    name: "Jaithoon Aasia MS",
    institute: "Grace College of Engineering, Coimbatore",
    linkedin: "https://www.linkedin.com/in/jaithoon-aasia-ms-819257371/",
  },
  {
    name: "Dakshin Subhesh VS",
    institute: "Noorul Islam Centre for Higher Education",
    linkedin: "https://www.linkedin.com/in/dakshin-subhesh-v-s-691590322/",
  },
  {
    name: "Mohammed Farooq",
    institute: "The New College, Chennai",
    note: "Passed out — 2025–2026",
    linkedin: "https://www.linkedin.com/in/mohammed-farooq-78a6942b0/",
  },
  {
    name: "Manisha Catherine Mary. A",
    institute: "PSGR Krishnammal College for Women, Coimbatore",
    linkedin: "https://www.linkedin.com/in/manisha-catherine-mary-a-294784324/",
  },
  {
    name: "Sameera. S",
    institute: "Arunachala College of Engineering for Women, Kanyakumari",
    linkedin: "https://www.linkedin.com/in/sameera-s-9870a0381/",
  },
];

function CampusLeaders() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card/60 p-6 backdrop-blur sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyber/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-magenta/15 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-cyber">
              Tier-1 Cohort
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Elite <span className="text-gradient">Campus Leaders</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Student leaders representing MentorWise AI on their campuses — driving adoption,
              running challenges and mentoring peers across Tamil Nadu.
            </p>
          </div>
          <div className="rounded-2xl glass px-5 py-4 text-center">
            <div className="font-display text-3xl font-bold text-gradient">{CAMPUS_LEADERS.length}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Campuses</div>
          </div>
        </div>

        <ol className="relative mt-10 grid gap-3 sm:grid-cols-2">
          {CAMPUS_LEADERS.map((l, i) => (
            <li
              key={l.name}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyber/40 hover:shadow-xl"
            >
              <span className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-cyber to-magenta opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="font-display text-xs font-semibold tabular-nums text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                    {l.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {l.institute}
                    {l.note ? <span className="text-muted-foreground/70"> · {l.note}</span> : null}
                  </p>
                </div>
                <a
                  href={l.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile of ${l.name}`}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full glass px-3.5 py-2 text-xs font-medium transition hover:scale-[1.05] hover:glow-cyan"
                >
                  <Linkedin className="h-3.5 w-3.5 text-cyber" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


function Founders() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">Leadership</div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            The <span className="text-gradient">Elite Team</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Founder &amp; CEO Mohammed Faizal. M, Co-Founder Saif Ahmed. Z and Administrator &amp; CCO Mohammed Aqhib. K — The New College (Autonomous), Chennai — with our Tier-1 Elite Campus Leaders.</p>
        </div>

        <h2 className="mt-14 text-center font-display text-2xl font-bold sm:text-3xl">Core Team</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, i) => (

            <article key={p.name} className="relative rounded-3xl glass-strong p-6 sm:p-8 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyber/20 via-transparent to-magenta/20 pointer-events-none opacity-50" />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyber/40 to-magenta/30 blur-xl opacity-70" />
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="relative h-44 w-44 rounded-3xl object-cover ring-2 ring-cyber/40 shadow-2xl"
                    />
                  ) : (
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-3xl bg-gradient-to-br from-cyber/25 to-magenta/25 ring-2 ring-cyber/40 shadow-2xl">
                      <span className="font-display text-4xl font-bold text-gradient">
                        {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                    </div>
                  )}

                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">{p.name}</h3>
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

      <CampusLeaders />
    </SiteLayout>
  );
}

