import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden grid-bg">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[6%] top-24 h-24 w-24 rotate-12 rounded-[1.5rem] bg-coral/25 shadow-xl backdrop-blur-md animate-float-y" />
        <div className="absolute right-[8%] top-44 h-20 w-20 rotate-45 rounded-[1.25rem] bg-lilac/30 shadow-xl backdrop-blur-md animate-float-y [animation-delay:900ms]" />
        <div className="absolute bottom-32 left-[14%] h-16 w-16 -rotate-12 rounded-[1.25rem] bg-mint/40 shadow-xl backdrop-blur-md animate-float-y [animation-delay:1400ms]" />
        <div className="absolute bottom-48 right-[18%] h-14 w-14 rotate-6 rounded-[1.25rem] bg-butter/40 shadow-xl backdrop-blur-md animate-float-y [animation-delay:1800ms]" />
      </div>
      <SiteHeader />
      <main className="page-transition">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
