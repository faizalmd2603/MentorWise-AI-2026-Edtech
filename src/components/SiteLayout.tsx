import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid-bg">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

