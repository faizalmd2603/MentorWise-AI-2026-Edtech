import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/mw-logo.jpeg.asset.json";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/agents" as const, label: "Agents" },
  { to: "/about" as const, label: "About" },
  { to: "/founders" as const, label: "Founders" },
  { to: "/contact" as const, label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-cyber/40 glow-cyan">
              <img src={logo.url} alt="MentorWise AI" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold tracking-tight text-gradient">MentorWise AI</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Career Arsenal</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyber to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/agents"
              className="hidden md:inline-flex items-center rounded-full bg-cyber/10 px-4 py-2 text-sm font-semibold text-cyber ring-1 ring-cyber/40 transition hover:bg-cyber/20 hover:glow-cyan"
            >
              Access AI Agents
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg glass"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-border/40 px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/agents"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-cyber/10 px-3 py-2.5 text-sm font-semibold text-cyber ring-1 ring-cyber/40"
            >
              Access AI Agents
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
