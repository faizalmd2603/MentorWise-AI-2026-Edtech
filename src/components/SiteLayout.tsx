import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden grid-bg">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 mesh-grid opacity-[0.18]" />
        <div className="absolute -left-32 top-10 h-[32rem] w-[32rem] rounded-full bg-primary/30 blur-[120px] animate-aurora" />
        <div className="absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-lilac/30 blur-[120px] animate-aurora [animation-delay:1200ms]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-mint/25 blur-[120px] animate-aurora [animation-delay:2400ms]" />
      </div>
      <SiteHeader />
      <main className="page-transition">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
