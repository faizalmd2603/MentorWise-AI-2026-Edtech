import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden grid-bg">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 mesh-grid opacity-[0.12]" />
        <div className="gold-rule absolute inset-x-0 top-0 h-px opacity-80" />
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>
      <SiteHeader />
      <main className="page-transition">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
