import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/mw-logo.png.asset.json";
import { Menu, X, LogIn, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuthReady } from "@/hooks/use-auth-ready";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/agents" as const, label: "AI Studio" },
  { to: "/events" as const, label: "Live Events" },
  { to: "/feed" as const, label: "Feed" },
  { to: "/about" as const, label: "About" },
  { to: "/founders" as const, label: "Founders" },
  { to: "/resources/job-search-sites" as const, label: "Resources" },
  { to: "/blog" as const, label: "Blog" },
  { to: "/contact" as const, label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isReady, user, isAdmin } = useAuthReady();
  const authed = isReady && !!user;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-border">
              <img src={logo.url} alt="MentorWise AI" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                MentorWise <span className="text-gradient">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">EdTech · Career OS</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/agents"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-primary hover:bg-accent transition"
            >
              <Sparkles className="h-4 w-4" /> AI Studio
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-500/25 dark:text-amber-300"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </Link>
            )}

            {/* Bold, force-pinned auth CTA */}
            {!isReady ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
                Account
              </span>
            ) : authed ? (
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">My Account</span>
                <span className="sm:hidden">Account</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_6px_16px_-6px_oklch(0.58_0.18_256_/_0.55)] transition hover:brightness-110 active:scale-[0.98] sm:px-5"
                aria-label="Sign in or Sign up"
              >
                <LogIn className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Sign in</span>
                <span className="hidden h-4 w-px bg-primary-foreground/40 sm:block" />
                <span className="hidden sm:inline">Sign up</span>
              </Link>
            )}

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Google-style 4-color thin bar under nav */}
        <div className="google-bar opacity-90" />

        {open && (
          <nav className="md:hidden border-t border-border/60 px-4 py-3 flex flex-col gap-1 bg-card">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-full px-3.5 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-amber-500/15 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300"
              >
                <ShieldCheck className="h-4 w-4" /> Admin Console
              </Link>
            )}
            {isReady && !authed && (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
              >
                <LogIn className="h-4 w-4" /> Sign in / Sign up
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
