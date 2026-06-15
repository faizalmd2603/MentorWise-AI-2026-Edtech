import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden grid-bg">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[6%] top-24 h-28 w-28 rotate-12 rounded-[1.5rem] border border-primary/15 bg-card/35 shadow-2xl backdrop-blur-md animate-float-y" />
        <div className="absolute right-[8%] top-44 h-24 w-24 rotate-45 rounded-[1.25rem] border border-accent/40 bg-accent/25 shadow-xl backdrop-blur-md animate-float-y [animation-delay:900ms]" />
        <div className="absolute bottom-28 left-[14%] h-20 w-20 -rotate-12 rounded-[1.25rem] border border-magenta/25 bg-card/30 shadow-xl backdrop-blur-md animate-float-y [animation-delay:1400ms]" />
      </div>
      <SiteHeader />
      <main className="page-transition">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

