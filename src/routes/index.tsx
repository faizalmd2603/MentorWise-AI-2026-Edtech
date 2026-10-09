import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Typewriter } from "@/components/Typewriter";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { Reveal } from "@/components/Reveal";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { DirectoryBadges } from "@/components/DirectoryBadges";
import banner from "@/assets/mw-banner.png.asset.json";
import { STOCK_AGENT_IMAGES } from "@/lib/stock-images";
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  Crown,
  Bot,
  Star,
  FileText,
  BookOpen,
  CalendarDays,
  Users,
} from "lucide-react";

const heroHome = { url: STOCK_AGENT_IMAGES.mentor };
const agentResume = { url: STOCK_AGENT_IMAGES.resume };
const agentInterview = { url: STOCK_AGENT_IMAGES.interview };
const agentLinkedin = { url: STOCK_AGENT_IMAGES.linkedin };
const agentInternship = { url: STOCK_AGENT_IMAGES.internship };
const agentCourses = { url: STOCK_AGENT_IMAGES.courses };
const agentHumaniser = { url: STOCK_AGENT_IMAGES.humaniser };

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const OG_IMAGE = `${SITE}${banner.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MentorWise AI — Free AI Career App for Students" },
      { name: "description", content: "Free AI career help for students — resume builder, mock interviews, free internships, free courses and LinkedIn help, all in one free app." },
      { name: "keywords", content: "free resume builder, free mock interview, free internships for students, free online courses with certificate, LinkedIn help, AI career app, college students, freshers, MentorWise AI" },
      { property: "og:title", content: "MentorWise AI — Free AI Career App for Students" },
      { property: "og:description", content: "Free AI career help for students — resume builder, mock interviews, free internships, free courses and LinkedIn help, all in one free app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
  component: Home,
});

function Home() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <SiteLayout>
      {show && <SplashScreen />}
      <Hero key={show ? "intro" : "ready"} />
      <BentoDeck />
      <BannerReveal />
      <Marquee />
      <DirectoryBadges />
      <AgentBento />
      <TestimonialCarousel />
      <NexoraShowcase />
      <Testimonial />
      <CTA />
    </SiteLayout>
  );
}


function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-scale-in">
      <div className="absolute inset-0 grid-bg opacity-80" />
      <div className="relative flex flex-col items-center gap-4">
        <img src={banner.url} alt="MentorWise AI" className="w-56 rounded-2xl animate-float-glow" />
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Loading your free career app</div>
      </div>
    </div>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px] animate-aurora" />
        <div className="absolute right-[-10%] top-[30%] h-[26rem] w-[26rem] rounded-full bg-lilac/12 blur-[120px] animate-orb" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 pb-14 text-center sm:px-6 lg:pt-24">
        <div className="pill animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="tracking-wide">New · 12 AI mentors, always free</span>
        </div>

        <h1 className="mt-8 font-display text-[2.7rem] font-extrabold leading-[1.05] tracking-tight animate-fade-up [animation-delay:80ms] sm:text-6xl lg:text-[4.5rem]">
          Master your career
          <br />
          <span className="shimmer-text">
            with 12 AI Agents.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground animate-fade-up [animation-delay:160ms] sm:text-xl">
          MentorWise AI blends personal mentorship with intelligent tools so students, freshers and
          professionals move faster on{" "}
          <span className="font-semibold text-foreground">
            <Typewriter phrases={["resumes", "interviews", "internships", "courses", "confidence"]} />
          </span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:240ms]">
          <Link
            to="/agents"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--color-primary)_90%,transparent)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/founders"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:-translate-y-0.5 hover:bg-secondary"
          >
            Meet the core team
          </Link>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-muted-foreground animate-fade-up [animation-delay:320ms]">
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Always 100% free</span>
          <span className="inline-flex items-center gap-1.5"><Bot className="h-3.5 w-3.5 text-lilac" /> 12 specialised agents</span>
          <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-butter fill-current" /> Built in Chennai</span>
        </div>

        <ScrollIndicator label="Keep scrolling" />
      </div>
    </section>
  );
}

/* ------------------------------ Kinetic bento ----------------------------- */

function BentoDeck() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-4 lg:h-[620px] lg:grid-rows-2">
        {/* Large: the agent network */}
        <Reveal className="md:col-span-2 md:row-span-2" delay={0}>
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 transition-all duration-500 hover:border-primary/40 sm:p-10">
            <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/12 blur-[80px]" />
            <div className="relative z-10">
              <div className="pill mb-6"><Users className="h-3.5 w-3.5 text-primary" /> The Agent Network</div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                A dedicated team of 12 AI mentors.
              </h2>
              <p className="mt-4 max-w-sm text-base text-muted-foreground">
                From resume rewrites and mock interviews to internships, courses and LinkedIn
                branding — one agent per job, so you always know who to ask.
              </p>
            </div>

            <div className="relative z-10 mt-8 overflow-hidden rounded-3xl border border-border/70">
              <img
                src={heroHome.url}
                alt="Students using MentorWise AI agents"
                width={1600}
                height={900}
                className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] sm:h-48"
              />
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap gap-3">
              <span className="rounded-xl border border-border bg-background/60 px-4 py-2 text-sm backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">Resume Optimiser</span>
              <span className="rounded-xl border border-border bg-background/60 px-4 py-2 text-sm backdrop-blur-md transition-transform delay-75 duration-500 group-hover:-translate-y-2">Mock Interviews</span>
              <span className="rounded-xl border border-border bg-background/60 px-4 py-2 text-sm backdrop-blur-md transition-transform delay-100 duration-500 group-hover:-translate-y-0.5">Study Buddy</span>
              <Link to="/agents" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                +9 more
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Medium: live events */}
        <Reveal className="md:col-span-2" delay={90}>
          <div className="group relative flex h-full flex-col justify-center overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-card to-background p-8">
            <CalendarDays
              aria-hidden
              className="pointer-events-none absolute -bottom-4 -right-4 h-40 w-40 rotate-12 text-primary/12 transition-transform duration-700 group-hover:rotate-0"
            />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold">Live Events</h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Join weekly workshops, AMA rooms and networking sessions hosted by the MentorWise team.
              </p>
              <Link to="/events" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View schedule
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Small: resume */}
        <Reveal delay={160}>
          <SmallTile
            to="/resume"
            icon={<FileText className="h-6 w-6 text-lilac" />}
            title="Resume AI"
            desc="Optimise your CV for modern ATS systems, step by step."
          />
        </Reveal>

        {/* Small: blog */}
        <Reveal delay={220}>
          <SmallTile
            to="/blog"
            icon={<BookOpen className="h-6 w-6 text-lilac" />}
            title="Career Blog"
            desc="Insightful articles on jobs, skills and the future of work."
          />
        </Reveal>
      </div>
    </section>
  );
}

function SmallTile({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col rounded-[2.5rem] border border-border bg-card p-8 transition-colors hover:border-primary/40 hover:bg-secondary"
    >
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 transition-transform duration-500 group-hover:-translate-y-1">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground">
        Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function BannerReveal() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/60 shadow-[0_40px_100px_-60px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]">
          <img
            src={banner.url}
            alt="MentorWise AI — official banner"
            className="h-auto w-full object-contain"
            loading="lazy"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>
      </Reveal>
    </section>
  );
}

function Marquee() {
  const items = [
    "Resume Optimiser",
    "Mock Interviews",
    "Free Internships",
    "Free Courses",
    "LinkedIn Branding",
    "Email Coach",
    "Study Buddy",
    "Career Mentor",
    "Project Ideas",
    "Exam Prep",
  ];
  const row = [...items, ...items];
  return (
    <section aria-hidden="true" className="mask-marquee mt-10 overflow-hidden border-y border-border/60 bg-card/60 py-4">
      <div className="flex w-max animate-marquee gap-8 px-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t}
          </span>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { img: agentResume, span: "lg:col-span-3", title: "Resume Optimiser", desc: "Craft an ATS-ready resume with a floating AI guide beside you.", agentId: "resume" as const },
  { img: agentInterview, span: "lg:col-span-3", title: "Mock Interviews", desc: "Practice real questions and get instant, kind feedback.", agentId: "interview" as const },
  { img: agentInternship, span: "lg:col-span-2", title: "Free Internships", desc: "Curated openings and one-click apply guidance.", agentId: "internship" as const },
  { img: agentCourses, span: "lg:col-span-2", title: "Free Courses", desc: "Certificate-worthy roadmaps from the world's best sources.", agentId: "courses" as const },
  { img: agentLinkedin, span: "lg:col-span-2", title: "LinkedIn Branding", desc: "Turn your profile into an opportunity magnet.", agentId: "linkedin" as const },
  { img: agentHumaniser, span: "lg:col-span-6", title: "AI Humaniser", desc: "Rewrite anything with warmth, clarity and confidence.", agentId: "humaniser" as const },
];

function AgentBento() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mb-12 max-w-3xl">
        <div className="pill">
          <span className="h-2 w-2 rounded-full bg-primary" /> The Studio
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Twelve friendly agents.{" "}
          <span className="text-muted-foreground">One calm place.</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Each agent is trained for a single job — so you always know who to ask. No plans, no
          paywalls, no clutter.
        </p>
      </Reveal>

      <div className="feature-motion-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} className={f.span} delay={i * 70}>
            <Link
              to="/agents/$agentId" params={{ agentId: f.agentId }}
              className="motion-card group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card"
            >
              <div className="relative aspect-[16/10] max-h-56 overflow-hidden bg-primary/10">
                <img
                  src={f.img.url}
                  alt={f.title}
                  width={800}
                  height={500}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-6">
                <div className="font-display text-xl font-bold">{f.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground">
                  Open agent <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NexoraShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <Reveal>
        <a
          href="https://nexora-sphere-ai.lovable.app/app"
          target="_blank"
          rel="noopener noreferrer"
          className="motion-card group relative block overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 sm:p-12"
        >
          <div aria-hidden className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-orb" />
          <div aria-hidden className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-lilac/25 blur-3xl animate-aurora" />
          <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-center">
            <div>
              <div className="pill">
                <Crown className="h-3.5 w-3.5 text-primary" /> Premium build · MentorWise AI Ecosystem
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Nexora <span className="text-muted-foreground">AI</span>
              </h3>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Our flagship education-grade LLM experience — a polished ChatGPT & Gemini-class web
                app, engineered as the first premium product under the MentorWise AI ecosystem.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition group-hover:brightness-110">
                Launch Nexora AI <ExternalLink className="h-4 w-4" />
              </div>
            </div>
            <div className="relative mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 to-lilac/40 blur-2xl" />
              <div className="relative grid h-36 w-36 place-items-center rounded-3xl border border-border bg-card sm:h-44 sm:w-44">
                <Sparkles className="h-14 w-14 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </a>
      </Reveal>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 sm:p-14">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />
          <div className="relative max-w-3xl">
            <div className="pill">
              <Star className="h-3.5 w-3.5 text-butter fill-current" /> From our students
            </div>
            <blockquote className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
              "It felt like having a senior sit beside me — telling me exactly what to fix on my
              resume, what to say in the interview, and where to apply next.
              <span className="text-muted-foreground"> All of that, for free.</span>"
            </blockquote>
            <div className="mt-6 text-sm text-muted-foreground">A B.Com fresher · Chennai</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-primary-foreground sm:p-14">
          <div aria-hidden className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-lilac/40 blur-3xl animate-orb" />
          <div aria-hidden className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-mint/30 blur-3xl animate-aurora" />
          <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-end">
            <div>
              <h2 className="font-display text-4xl font-bold sm:text-5xl">
                Start your career for free today.
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/75">
                Open your first AI agent in under 10 seconds. No card, no signup wall.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <Link
                to="/agents"
                className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5"
              >
                Open the Studio <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-transparent px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Talk to the team
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
