import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import founder from "@/assets/founder-faizal.jpeg.asset.json";
import cofounder from "@/assets/cofounder-saif.jpeg.asset.json";
import { Mail, MessageCircle, Linkedin } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const FOUNDER_OG = `${SITE}${founder.url}`;

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "Founders of MentorWise AI | Faizal & Saif from Chennai" },
      { name: "description", content: "Meet the founders of MentorWise AI — Mohammed Faizal. M and Saif Ahmed. Z, two B.Com students from Chennai building a free AI career app for students." },
      { property: "og:title", content: "Founders of MentorWise AI | Faizal & Saif from Chennai" },
      { property: "og:description", content: "Meet the founders of MentorWise AI — building a free AI career app for students, from Chennai." },
      { property: "og:url", content: `${SITE}/founders` },
      { property: "og:image", content: FOUNDER_OG },
      { name: "twitter:image", content: FOUNDER_OG },
    ],

    links: [{ rel: "canonical", href: `${SITE}/founders` }],
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
    bio: "B.Com student at The New College, Chennai. Leading the vision to democratize career guidance, engineer elite AI tools, and build the ultimate ecosystem for modern freshers.",
    image: founder.url,
    email: "mentorwiseaiedtech@gmail.com",
    whatsapp: "https://wa.me/916383969289",
    linkedin: "https://www.linkedin.com/in/mohammed-faizal-m-b3242b311?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Saif Ahmed. Z",
    title: "Co-founder",
    bio: "B.Com student at The New College, Chennai. Architecting the operational frameworks, product strategies, and open-access networks to scale MentorWise AI globally.",
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
          <p className="mt-3 text-muted-foreground">Two students from Chennai engineering the global standard for fresher career tooling.</p>
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
