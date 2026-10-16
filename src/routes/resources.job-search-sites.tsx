import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Sparkles, Search, Briefcase, GraduationCap, Globe, Zap, ArrowRight, CheckCircle } from "lucide-react";

const SITE = "https://mentorwiseai.store";

export const Route = createFileRoute("/resources/job-search-sites")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Best Free Job Search Websites for Students & Freshers | MentorWise AI" },
      { name: "description", content: "Discover the best free job search websites for students and freshers. Curated list of entry level job sites, internship portals, and career platforms with zero cost." },
      { property: "og:title", content: "Best Free Job Search Websites for Students & Freshers | MentorWise AI" },
      { property: "og:description", content: "Discover the best free job search websites for students and freshers. Curated list of entry level job sites, internship portals, and career platforms with zero cost." },
      { property: "og:url", content: `${SITE}/resources/job-search-sites` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/resources/job-search-sites` }],
  }),
  component: JobSearchSitesPage,
});

interface JobSite {
  name: string;
  url: string;
  tagline: string;
  description: string;
  bestFor: string[];
  icon: typeof Search;
  accent: "cyan" | "magenta" | "purple";
}

const JOB_SITES: JobSite[] = [
  {
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    tagline: "The world's largest professional network",
    description: "LinkedIn is the single most important platform for freshers. You can filter by 'Entry level' and 'Internship', set job alerts, and apply directly. The 'Easy Apply' feature lets you submit applications in one click using your LinkedIn profile.",
    bestFor: ["Entry-level roles", "Internships", "Networking", "Referrals"],
    icon: Globe,
    accent: "cyan",
  },
  {
    name: "Indeed",
    url: "https://www.indeed.com/",
    tagline: "Global job aggregator with student filters",
    description: "Indeed aggregates listings from company career pages, job boards, and staffing agencies. Use the 'Entry Level' and 'No Experience' filters to find fresher-friendly roles. The resume upload and one-click apply save hours of repetitive form-filling.",
    bestFor: ["Volume of listings", "Quick apply", "Salary insights", "Company reviews"],
    icon: Search,
    accent: "purple",
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/",
    tagline: "Transparent hiring with insider intel",
    description: "Before you apply, Glassdoor shows you real interview questions, salary ranges, and employee reviews. For students, this intel is priceless. Search 'entry level' roles and read how candidates actually succeeded in interviews at your target companies.",
    bestFor: ["Interview prep intel", "Salary benchmarks", "Company culture", "Entry-level reviews"],
    icon: Briefcase,
    accent: "magenta",
  },
  {
    name: "Internshala",
    url: "https://internshala.com/",
    tagline: "India's #1 internship and training portal",
    description: "Built specifically for Indian students, Internshala lists thousands of internships across tech, business, design, and more. Most are work-from-home or hybrid. The platform also offers free certified training programs that strengthen your resume before you apply.",
    bestFor: ["Indian internships", "Work-from-home roles", "Free training", "Student community"],
    icon: GraduationCap,
    accent: "cyan",
  },
  {
    name: "Wellfound (AngelList Talent)",
    url: "https://wellfound.com/",
    tagline: "Startup jobs and equity-backed roles",
    description: "Startups hire fast and care more about skill than pedigree. Wellfound is where early-stage companies post roles you will not find on traditional boards. Many accept freshers for associate, operations, and growth roles. Equity is often part of the package.",
    bestFor: ["Startup jobs", "Equity roles", "Fast hiring", "Remote-first companies"],
    icon: Zap,
    accent: "purple",
  },
  {
    name: "Google Careers",
    url: "https://careers.google.com/",
    tagline: "Direct MNC hiring without middlemen",
    description: "Google's own careers portal lists early-career programs, apprenticeships, and STEP internships specifically designed for students. Applying directly on a company's careers page bypasses aggregator noise and puts your resume straight into their ATS.",
    bestFor: ["MNC early-career programs", "Apprenticeships", "STEP internships", "Direct ATS entry"],
    icon: Sparkles,
    accent: "magenta",
  },
  {
    name: "Naukri.com",
    url: "https://www.naukri.com/",
    tagline: "India's largest job marketplace",
    description: "Naukri remains the default job board for Indian freshers. Create a detailed profile, upload an ATS-friendly resume, and activate 'Job Alerts' for 'Fresher' and 'Walk-in' roles. Recruiters actively search the database, so a complete profile gets inbound calls.",
    bestFor: ["Indian fresher jobs", "Walk-in interviews", "Recruiter discovery", "IT/Non-IT roles"],
    icon: Search,
    accent: "cyan",
  },
  {
    name: "Handshake",
    url: "https://joinhandshake.com/",
    tagline: "University-powered job network",
    description: "If your college is partnered with Handshake, you get exclusive access to employers who specifically recruit from your campus. The platform hosts virtual career fairs, employer events, and roles filtered by major and graduation year. Completely free for students.",
    bestFor: ["Campus recruiting", "Virtual fairs", "Major-matched roles", "Employer events"],
    icon: GraduationCap,
    accent: "purple",
  },
];

const TIPS = [
  {
    title: "Set job alerts immediately",
    text: "On every platform, configure alerts for 'entry level', 'fresher', 'internship', and '0-1 years'. Early applicants get interviewed first.",
  },
  {
    title: "Optimize your headline and summary",
    text: "Recruiters search by keywords. Use 'Recent Graduate', 'Aspiring Software Engineer', or 'Entry-Level Data Analyst' in your headline so you appear in their searches.",
  },
  {
    title: "Apply within 24 hours of posting",
    text: "The first 48 hours of a job listing are the golden window. Set mobile notifications and treat urgent applications like exam deadlines.",
  },
  {
    title: "Track every application in a sheet",
    text: "Use a simple tracker: company, role, date applied, follow-up date, status. This prevents duplicate applications and helps you follow up strategically.",
  },
];

function JobSearchSitesPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <Sparkles className="h-3.5 w-3.5" /> Free Career Resources
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Best Free Job Search Websites for <span className="text-gradient">Students & Freshers</span>
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground sm:text-lg">
            A hand-picked, zero-cost guide to the most effective entry level job sites and internship portals. Every platform on this list is free to use and actively hiring students and recent graduates.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {JOB_SITES.map((site, i) => {
            const Icon = site.icon;
            const accentClass =
              site.accent === "cyan"
                ? "text-cyber bg-cyber/15 ring-cyber/30"
                : site.accent === "magenta"
                  ? "text-magenta bg-magenta/15 ring-magenta/30"
                  : "text-purple-glow bg-purple-glow/15 ring-purple-glow/30";
            return (
              <article key={site.name} className="glass rounded-2xl p-6 animate-fade-up transition hover:glow-cyan" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-4">
                  <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClass} ring-1`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-semibold text-foreground hover:text-cyber transition">
                      {site.name}
                    </a>
                    <p className="mt-1 text-xs text-cyber font-medium">{site.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{site.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {site.bestFor.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-cyber/10 px-2.5 py-1 text-[11px] font-medium text-cyber ring-1 ring-cyber/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl glass-strong p-8 sm:p-10 animate-fade-up">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Pro Tips for Fresher Job Hunting</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Knowing the best free job search websites is only half the battle. Here is how top students convert applications into offers.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TIPS.map((tip, i) => (
              <div key={tip.title} className="flex gap-3 rounded-xl bg-card/60 p-4 ring-1 ring-border/40">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-cyber" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl glass-strong p-8 sm:p-10 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-magenta/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyber/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Speed up your search with AI agents</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              MentorWise AI builds recruiter-ready resumes, interview answers, and LinkedIn profiles tuned to the exact roles you find on these entry level job sites. Every tool is 100% free.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/agents" className="inline-flex items-center gap-2 rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.03] hover:brightness-110 glow-cyan">
                Explore AI Agents <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold text-foreground transition hover:scale-[1.03] hover:glow-cyan">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
