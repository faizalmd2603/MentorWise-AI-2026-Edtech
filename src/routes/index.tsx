import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Typewriter } from "@/components/Typewriter";
import banner from "@/assets/mw-banner.png.asset.json";
import { ArrowRight, Sparkles, ExternalLink, Crown, FileText, MessagesSquare, GraduationCap, Briefcase, Linkedin, PenTool, Bot, Star, Wand2, Rocket, Shapes, Palette, Play, Layers } from "lucide-react";


const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const OG_IMAGE = `${SITE}${banner.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MentorWise AI — Free AI Career App for Students" },
      { name: "description", content: "Free AI career help for students. Build a resume, practice mock interviews, find free internships, learn from free online courses and get LinkedIn help — all free, in one app." },
      { name: "keywords", content: "free resume builder, free mock interview, free internships for students, free online courses with certificate, LinkedIn help, AI career app, college students, freshers, MentorWise AI" },
      { property: "og:title", content: "MentorWise AI — Free AI Career App for Students" },
      { property: "og:description", content: "Free AI career help for students. Build a resume, practice mock interviews, find free internships, learn from free online courses and get LinkedIn help — all free, in one app." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
  component: Home,
});

const AUDIENCES = ["Students", "Freshers", "Job Seekers", "Interns", "Everyone"] as const;

function Home() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <SiteLayout>
      {show && <SplashScreen />}
      <Hero />
      <Marquee />
      <LaunchBuffBadge />
      <FeatureGrid />
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

function Hero() {
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("Students");
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* Left column */}
          <div className="animate-fade-up">
            <div className="pill">
              <span className="text-muted-foreground">MentorWise AI for…</span>
              <div className="flex items-center gap-1">
                {AUDIENCES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                      audience === a
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.5rem]">
              AI that helps{" "}
              <span className="handline">
                {audience.toLowerCase()}
                <svg className="handline-swash" viewBox="0 0 320 14" fill="none" preserveAspectRatio="none">
                  <path
                    className="animate-draw-line"
                    d="M4 9 C 80 2, 160 14, 316 5"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              land the{" "}
              <span className="italic text-foreground/90">
                <Typewriter
                  className=""
                  phrases={["career", "internship", "first job", "confidence", "resume"]}
                />
              </span>{" "}
              they deserve.
            </h1>

            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              MentorWise AI is a free, all-in-one career app. Build a resume, practice mock interviews, find internships and courses — with 12 friendly AI agents guiding you step by step.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/agents"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 hover:translate-y-[-1px]"
              >
                I'm a student
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/founders"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-secondary hover:translate-y-[-1px]"
              >
                Meet the founders
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-coral" /> Always 100% free</span>
              <span className="inline-flex items-center gap-1.5"><Bot className="h-3.5 w-3.5 text-lilac" /> 12 friendly AI agents</span>
              <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-butter fill-current" /> Made in Chennai</span>
            </div>
          </div>

          {/* Right — mosaic collage */}
          <HeroMosaic />
        </div>
      </div>
    </section>
  );
}

function HeroMosaic() {
  return (
    <div className="relative animate-fade-up [animation-delay:120ms]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-coral)_35%,transparent)] via-[color-mix(in_oklab,var(--color-butter)_25%,transparent)] to-[color-mix(in_oklab,var(--color-lilac)_35%,transparent)] blur-3xl animate-orb" />

      <div className="grid grid-cols-6 gap-3 sm:gap-4">
        <div className="tile col-span-6 row-span-2 aspect-[16/10] animate-pop-in">
          <img src={heroIllustration} alt="AI mentor helping students" className="h-full w-full object-cover" loading="eager" />
        </div>
        <div className="tile col-span-3 aspect-square animate-pop-in [animation-delay:120ms] animate-float-y">
          <img src={sceneResume} alt="AI resume builder" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="tile col-span-3 aspect-square animate-pop-in [animation-delay:200ms] animate-float-y [animation-delay:400ms]">
          <img src={sceneInterview} alt="AI mock interview" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="tile col-span-6 aspect-[16/6] animate-pop-in [animation-delay:280ms]">
          <img src={sceneLearn} alt="AI courses and certifications" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -left-3 top-6 hidden rotate-[-6deg] animate-float-y sm:block">
        <div className="pill bg-white">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-mint">
            <Sparkles className="h-3 w-3 text-foreground" />
          </span>
          Free forever
        </div>
      </div>
      <div className="absolute -right-2 bottom-8 hidden rotate-[4deg] animate-wiggle sm:block">
        <div className="pill bg-white">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-coral text-white">
            <Star className="h-3 w-3 fill-current" />
          </span>
          Loved by freshers
        </div>
      </div>
    </div>
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
    <section aria-hidden="true" className="mask-marquee overflow-hidden border-y border-border/60 bg-card/60 py-4">
      <div className="flex w-max animate-marquee gap-8 px-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function LaunchBuffBadge() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="flex justify-center animate-fade-up">
        <a
          href="https://launchbuff.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition hover:scale-[1.03]"
          aria-label="Featured on LaunchBuff"
        >
          <img
            src="https://launchbuff.com/badge-featured-dark.svg"
            alt="Featured on LaunchBuff"
            width={256}
            height={80}
            loading="lazy"
          />
        </a>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: FileText, tint: "coral", title: "Resume Optimiser", desc: "Craft an ATS-ready resume with a floating AI guide beside you.", to: "/agents/resume" as const },
  { icon: MessagesSquare, tint: "lilac", title: "Mock Interviews", desc: "Practice real questions and get instant, kind feedback.", to: "/agents/interview" as const },
  { icon: Briefcase, tint: "mint", title: "Free Internships", desc: "Curated openings and one-click apply guidance.", to: "/agents/internship" as const },
  { icon: GraduationCap, tint: "butter", title: "Free Courses", desc: "Certificate-worthy roadmaps from the world's best sources.", to: "/agents/courses" as const },
  { icon: Linkedin, tint: "lilac", title: "LinkedIn Branding", desc: "Turn your profile into an opportunity magnet.", to: "/agents/linkedin" as const },
  { icon: PenTool, tint: "coral", title: "AI Humaniser", desc: "Rewrite anything with warmth, clarity and confidence.", to: "/agents/humaniser" as const },
];

function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-3xl">
        <div className="pill">
          <span className="h-2 w-2 rounded-full bg-coral" /> The Studio
        </div>
        <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Twelve friendly agents.{" "}
          <span className="italic text-muted-foreground">One calm place.</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Each agent is trained for a single job — so you always know who to ask. No plans, no paywalls, no clutter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.title}
              to={f.to}
              className="motion-card group animate-pop-in rounded-3xl border border-border bg-card p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl"
                style={{ background: `color-mix(in oklab, var(--color-${f.tint}) 55%, white)` }}
              >
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="mt-5 font-display text-xl font-semibold">{f.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground">
                Open agent <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function NexoraShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <a
        href="https://nexora-sphere-ai.lovable.app/app"
        target="_blank"
        rel="noopener noreferrer"
        className="motion-card group relative block overflow-hidden rounded-[2rem] border border-border bg-card p-8 sm:p-12 animate-fade-up"
      >
        <div aria-hidden className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-coral/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-lilac/30 blur-3xl" />
        <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div>
            <div className="pill">
              <Crown className="h-3.5 w-3.5 text-coral" /> Premium build · MentorWise AI Ecosystem
            </div>
            <h3 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Nexora <span className="italic text-muted-foreground">AI</span>
            </h3>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Our flagship education-grade LLM experience — a polished ChatGPT & Gemini-class web app, engineered as the first premium product under the MentorWise AI ecosystem.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition group-hover:brightness-110">
              Launch Nexora AI <ExternalLink className="h-4 w-4" />
            </div>
          </div>
          <div className="relative mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-coral/40 to-lilac/40 blur-2xl" />
            <div className="relative grid h-36 w-36 place-items-center rounded-3xl border border-border bg-card sm:h-44 sm:w-44">
              <Sparkles className="h-14 w-14 text-coral animate-pulse" />
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-10 sm:p-14">
        <div className="max-w-3xl">
          <div className="pill">
            <Star className="h-3.5 w-3.5 text-butter fill-current" /> From our students
          </div>
          <blockquote className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
            "It felt like having a senior sit beside me — telling me exactly what to fix on my resume, what to say in the interview, and where to apply next.
            <span className="italic text-muted-foreground"> All of that, for free.</span>"
          </blockquote>
          <div className="mt-6 text-sm text-muted-foreground">A B.Com fresher · Chennai</div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary p-10 text-primary-foreground sm:p-14">
        <div aria-hidden className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-coral/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-lilac/40 blur-3xl" />
        <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-end">
          <div>
            <h2 className="font-display text-4xl font-semibold sm:text-5xl">
              Start your career{" "}
              <span className="italic">for free</span> today.
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/75">
              Open your first AI agent in under 10 seconds. No card, no signup wall.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Link
              to="/agents"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:brightness-110"
            >
              Open the Studio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-white/10"
            >
              Talk to founders
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
