import { Link } from "@tanstack/react-router";
import logo from "@/assets/mw-logo.jpeg.asset.json";
import { Mail, MessageCircle, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/40 bg-card/40 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl ring-1 ring-cyber/40">
              <img src={logo.url} alt="MentorWise AI" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-gradient">MentorWise AI</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Chennai · India</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            The ultimate AI-powered career arsenal — built for students, by the students.
          </p>
        </div>

        <div>
          <div className="font-display text-sm font-semibold text-foreground">Navigate</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/agents" className="hover:text-foreground">The Ecosystem</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/founders" className="hover:text-foreground">Founders</Link></li>
            <li><Link to="/resources/job-search-sites" className="hover:text-foreground">Resources</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-display text-sm font-semibold text-foreground">Reach us</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="mailto:mentorwiseaiedtech@gmail.com" className="inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-foreground hover:glow-cyan">
              <Mail className="h-3.5 w-3.5 text-cyber" /> Email
            </a>
            <a href="https://wa.me/916383969289" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-foreground hover:glow-cyan">
              <MessageCircle className="h-3.5 w-3.5 text-cyber" /> WhatsApp
            </a>
            <a href="https://www.linkedin.com/in/mohammed-faizal-m-b3242b311" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-foreground hover:glow-cyan">
              <Linkedin className="h-3.5 w-3.5 text-cyber" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© 2026 MentorWise AI · Chennai, Tamil Nadu, India</span>
          <span className="italic">Built for the students, by the students.</span>
        </div>
      </div>
    </footer>
  );
}
