import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Trophy, Sparkles, Award, Flag, FileText, Download, AudioLines } from "lucide-react";

import aadhiray from "@/assets/hof/Aadhiray_Sharojani.jpeg.asset.json";
import aasiya from "@/assets/hof/Aasiya_Mufridha.jpeg.asset.json";
import aseena from "@/assets/hof/Aseena-_J.jpeg.asset.json";
import ayisha from "@/assets/hof/Ayisha_Fathima-_S.jpeg.asset.json";
import bavana from "@/assets/hof/Bavana-_S.jpeg.asset.json";
import dakshin from "@/assets/hof/Dakshin_Subhesh.jpeg.asset.json";
import mahdhiya from "@/assets/hof/Fathima_Mahdhiya.jpeg.asset.json";
import shahana from "@/assets/hof/Fathima_Shahana.jpeg.asset.json";
import geerthana from "@/assets/hof/Geerthana-_L.jpeg.asset.json";
import jack from "@/assets/hof/Jack-_J.jpeg.asset.json";
import zoya from "@/assets/hof/Zoya_Javed_Khan.jpeg.asset.json";
import gnana from "@/assets/hof/Gnana_Muthu_Lakshmi.jpeg.asset.json";
import muavvidh from "@/assets/hof/Muavvidh_Buhary.jpeg.asset.json";
import manisha from "@/assets/hof/Manisha_Catherine_Mary.jpeg.asset.json";
import irfan from "@/assets/hof/Mohamed_Irfan_KA.jpeg.asset.json";
import liyana from "@/assets/hof/Nooril_Liyana.jpeg.asset.json";
import sabaAudio from "@/assets/hof/Saba_Ambareen.mpeg.asset.json";
import sameeraDocx from "@/assets/hof/India_at_80_AI_Quiz_Research_Challenge.docx.asset.json";
import sameeraPdf from "@/assets/hof/India_at_80_AI_Quiz_Research_Challenge.pdf.asset.json";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const OG_IMAGE = `${SITE}${dakshin.url}`;

type Rank = "gold" | "silver" | "bronze" | "best";

type Entry = {
  name: string;
  image: string;
  college: string;
  study: string;
  challenge: string;
  tool: string;
  honour?: string;
  rank?: Rank;
  note?: string;
};

const ENTRIES: Entry[] = [

  {
    name: "Dakshin Subhesh V S",
    image: dakshin.url,
    college: "Noorul Islam Centre for Higher Education, Kumaracoil",
    study: "BE CSE — Pre-Final Year",
    challenge: "Challenge 2 — AI Meme: India Then vs Now @ 80",
    tool: "ChatGPT",
    honour: "Overall Winner",
    rank: "gold",
    note: "In two frames, Dakshin captured 80 years of progress — witty, sharp and deeply relatable. Great ideas travel fastest when they are simple.",
  },
  {
    name: "Aseena J",
    image: aseena.url,
    college: "Surya Group of Institutions, Villupuram",
    study: "Final Year B.Tech — AI & Data Science",
    challenge: "Challenge 3 — Prompt-to-Image: India in 2047",
    tool: "ChatGPT",
    honour: "Best AI-Generated Image",
    rank: "best",
    note: "A bold, hopeful vision of a tech-driven, research-first Bharat — hyperloop, AI labs and green cities.",
  },
  {
    name: "Ayisha Fathima S",
    image: ayisha.url,
    college: "PSG College of Arts & Science, Coimbatore",
    study: "Final Year BA English Literature",
    challenge: "Challenge 6 — AI Greeting Card",
    tool: "ChatGPT",
    honour: "Best Greeting Card Design",
    rank: "best",
    note: "From legacy to Viksit Bharat — 1947 to 2027 told as one open book.",
  },
  {
    name: "Fathima Shahana A",
    image: shahana.url,
    college: "Sadakkathullah Appa College",
    study: "Class of 2025",
    challenge: "Challenge 6 — AI Greeting Card",
    tool: "ChatGPT",
    honour: "Best Greeting Card Design",
    rank: "best",
    note: "United by purpose, inspired by freedom — a card that put people at the centre of the celebration.",
  },
  {
    name: "Aathiray Sharojani A S",
    image: aadhiray.url,
    college: "PSGR Krishnammal College for Women",
    study: "B.Com — Final Year",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "ChatGPT",
  },
  {
    name: "Aasiya Mufridha",
    image: aasiya.url,
    college: "Wavoo Wajeeha Women's College of Arts and Science, Kayalpattinam",
    study: "Final Year — Bachelor of English Literature",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "ChatGPT",
  },
  {
    name: "S. Bavana",
    image: bavana.url,
    college: "Grace College of Engineering, Thoothukudi",
    study: "2nd Year B.Tech — AI & DS",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "ChatGPT",
  },
  {
    name: "S. B. Fathima Mahdhiya",
    image: mahdhiya.url,
    college: "Wavoo Wajeeha Women's College of Arts and Science, Kayalpatnam",
    study: "I M.Sc",
    challenge: "Challenge 2 — AI Meme",
    tool: "ChatGPT",
  },
  {
    name: "Geerthana L",
    image: geerthana.url,
    college: "Grace College of Engineering, Thoothukudi",
    study: "2nd Year B.Tech — AI & DS",
    challenge: "Challenge 2 — AI Meme",
    tool: "ChatGPT",
  },
  {
    name: "Jack J",
    image: jack.url,
    college: "Grace College of Engineering, Thoothukudi",
    study: "2nd Year B.Tech — AI & DS",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "Canva",
  },
  {
    name: "Zoya Javed Khan",
    image: zoya.url,
    college: "MHSSP",
    study: "Final Year Diploma Student",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "Gemini & ChatGPT",
  },
  {
    name: "N Gnana Muthu Lakshmi",
    image: gnana.url,
    college: "Wavoo Wajeeha Women's College of Arts and Science, Kayalapatnam",
    study: "I M.Sc",
    challenge: "Challenge 6 — AI Greeting Card",
    tool: "Gemini",
  },
  {
    name: "Muavvidh Buhary S",
    image: muavvidh.url,
    college: "MEASI Institute of Management, Chennai",
    study: "MBA — Final Year",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "Leonardo AI",
  },
  {
    name: "Manisha Catherine Mary A",
    image: manisha.url,
    college: "PSGR Krishnammal College for Women",
    study: "B.Com — Final Year",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "ChatGPT",
  },
  {
    name: "Mohamed Irfan K A",
    image: irfan.url,
    college: "The New College, Chennai",
    study: "BCA",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "ChatGPT",
  },
  {
    name: "Nooril Liyana S",
    image: liyana.url,
    college: "Arunachala College of Engineering for Women",
    study: "B.Tech IT",
    challenge: "Challenge 1 — AI Poster Design",
    tool: "ChatGPT & Canva",
  },
];

const TEXT_HONOURS = [
  {
    title: "Overall Runner-up 1",
    name: "Saba Ambareen N",
    college: "Marudhar Kesari Jain College for Women (Autonomous)",
    challenge: "Challenge 4 — 80-Word Patriotic Story + AI Voice",
    note: "Spotlighted E.C.G. Sudarshan with the line: “Real independence is raising a generation the world can no longer ignore.”",
    media: "audio" as const,
  },
  {
    title: "Overall Runner-up 2",
    name: "Sameera S",
    college: "Arunachala College of Engineering for Women, Nagercoil",
    challenge: "Challenge 5 — AI Quiz + Research",
    note: "8/8 with sources — from the Green Revolution to Chandrayaan-3, a research-first map of India's innovation journey.",
    media: "doc" as const,
  },
  {
    title: "Best Research Collage",
    name: "B. Braini",
    college: "PSG College of Arts & Science, Coimbatore",
    challenge: "Challenge 3 — Prompt-to-Image",
    note: "Data-rich, ambitious and future-focused — a true Viksit Bharat blueprint.",
    media: null,
  },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE}/hall-of-fame`,
  name: "Bharat @ 80 Hall of Fame — MentorWise AI",
  description:
    "Student prototypes, posters, memes and AI art from the Bharat @ 80 Independence Day challenge by MentorWise AI.",
  isPartOf: { "@type": "WebSite", name: "MentorWise AI", url: SITE },
  about: {
    "@type": "Event",
    name: "Bharat @ 80 — Independence Day Mini Challenge",
    startDate: "2025-08-14",
    endDate: "2025-08-15",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: { "@type": "Organization", name: "MentorWise AI", url: SITE },
  },
  hasPart: ENTRIES.map((e) => ({
    "@type": "CreativeWork",
    name: `${e.challenge} — ${e.name}`,
    creator: { "@type": "Person", name: e.name, affiliation: e.college },
    image: `${SITE}${e.image}`,
  })),
};

export const Route = createFileRoute("/hall-of-fame")({
  head: () => ({
    meta: [
      { title: "Hall of Fame — Bharat @ 80 Student AI Challenge | MentorWise AI" },
      {
        name: "description",
        content:
          "See the winning student AI posters, memes and artwork from Bharat @ 80, the Independence Day challenge run by MentorWise AI for India's 80th year of freedom.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Hall of Fame — Bharat @ 80 Student AI Challenge" },
      {
        property: "og:description",
        content:
          "Winners and student prototypes from the Bharat @ 80 Independence Day AI challenge by MentorWise AI.",
      },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hall of Fame — Bharat @ 80 Student AI Challenge" },
      {
        name: "twitter:description",
        content:
          "Winners and student prototypes from the Bharat @ 80 Independence Day AI challenge by MentorWise AI.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/hall-of-fame` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(JSONLD) }],
  }),
  component: HallOfFame,
});

function HonourBadge({ label }: { label: string }) {
  const isWinner = label === "Overall Winner";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
        isWinner
          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_oklch(0.58_0.18_275_/_0.8)]"
          : "bg-accent text-accent-foreground"
      }`}
    >
      {isWinner ? <Trophy className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

function EntryCard({ e, index }: { e: Entry; index: number }) {
  return (
    <Reveal delay={(index % 3) * 90} className="mb-6 break-inside-avoid">
      <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_28px_60px_-30px_oklch(0.58_0.18_275_/_0.55)]">
        <div className="relative overflow-hidden bg-secondary/40">
          {/* natural aspect ratio — never cropped or compressed */}
          <img
            src={e.image}
            alt={`${e.challenge} entry by ${e.name} — Bharat @ 80 challenge`}
            loading="lazy"
            className="block h-auto w-full transition duration-700 group-hover:scale-[1.02]"
          />
          {e.honour && (
            <div className="absolute left-4 top-4">
              <HonourBadge label={e.honour} />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-display text-lg font-bold text-foreground">{e.name}</h3>
          <p className="text-sm text-muted-foreground">{e.college}</p>
          <p className="text-xs text-muted-foreground">{e.study}</p>
          <p className="mt-2 text-sm font-medium text-foreground">{e.challenge}</p>
          {e.note && <p className="text-sm text-muted-foreground italic">{e.note}</p>}
          <div className="mt-auto pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Tool: {e.tool}
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function AudioSubmission() {
  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <AudioLines className="h-4 w-4 text-primary" /> AI Voice Submission
      </div>
      <audio
        controls
        preload="none"
        src={sabaAudio.url}
        className="mt-3 w-full"
        aria-label="Saba Ambareen — 80-word patriotic story, AI voice narration"
      />
      <a
        href={sabaAudio.url}
        download
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        <Download className="h-3.5 w-3.5" /> Download audio
      </a>
    </div>
  );
}

function DocSubmission() {
  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <FileText className="h-4 w-4 text-primary" /> Research Document
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        India @ 80 — AI Quiz &amp; Research Challenge
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={sameeraPdf.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <FileText className="h-3.5 w-3.5" /> Read document
        </a>
        <a
          href={sameeraDocx.url}
          download
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" /> Download .docx
        </a>
      </div>
    </div>
  );
}

function HallOfFame() {
  const featured = ENTRIES.filter((e) => e.honour);
  const rest = ENTRIES.filter((e) => !e.honour);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
              <Flag className="h-3.5 w-3.5 text-primary" /> #MentorWiseAI80
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              <span className="text-gradient">Hall of Fame</span>
              <span className="block text-foreground">Bharat @ 80</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              A 24-hour virtual mini challenge by MentorWise AI, marking India's 80th
              Independence Day. Submissions across 6 challenges — judged on creativity,
              research depth, relevance to Bharat @ 80 and quality of execution.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 text-center">
            {[
              [`${ENTRIES.length + TEXT_HONOURS.length}`, "Submissions"],
              ["6", "Challenges"],
              ["24h", "Build window"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur">
                <dt className="font-display text-2xl font-bold text-gradient">{v}</dt>
                <dd className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Winners &amp; Category Highlights
          </h2>
        </Reveal>
        <div className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid">
          {featured.map((e, i) => (
            <EntryCard key={e.name} e={e} index={i} />
          ))}
        </div>

        <Reveal>
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground sm:text-3xl">
            Honoured for Writing &amp; Research
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {TEXT_HONOURS.map((h, i) => (
            <Reveal key={h.name} delay={i * 90}>
              <article className="h-full rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/50">
                <HonourBadge label={h.title} />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{h.name}</h3>
                <p className="text-sm text-muted-foreground">{h.college}</p>
                <p className="mt-2 text-sm font-medium text-foreground">{h.challenge}</p>
                <p className="mt-2 text-sm italic text-muted-foreground">{h.note}</p>
                {h.media === "audio" && <AudioSubmission />}
                {h.media === "doc" && <DocSubmission />}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground sm:text-3xl">
            All Prototypes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every entry submitted to Bharat @ 80, shown at its original aspect ratio and credited
            to its creator.
          </p>
        </Reveal>
        <div className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:break-inside-avoid">
          {rest.map((e, i) => (
            <EntryCard key={e.name} e={e} index={i} />
          ))}
        </div>

        <Reveal>
          <p className="mt-14 rounded-3xl border border-border/60 bg-card/60 p-6 text-center text-sm text-muted-foreground backdrop-blur">
            To every participant — thank you. You proved that the strength of a nation really does
            lie in its youth and the power of its ideas.
            <span className="mt-2 block font-display font-semibold text-foreground">
              — Team MentorWise AI
            </span>
          </p>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
