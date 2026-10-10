import { useState } from "react";
import { Pause, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import uno from "@/assets/directories/uno-directory.svg.asset.json";
import easy from "@/assets/directories/easydofollow-badge-dark.svg.asset.json";
import launchbuff from "@/assets/directories/launchbuff.svg.asset.json";
import launchpanda from "@/assets/directories/launchpanda.svg.asset.json";

const listings = [
  { href: "https://launchbuff.com", image: launchbuff.url, alt: "Featured on LaunchBuff", width: 256, height: 80 },
  { href: "https://launchpanda.dev/launches/ai-tool/mentorwise-ai", image: launchpanda.url, alt: "Launched on LaunchPanda", width: 260, height: 64 },
  { href: "https://uno.directory", image: uno.url, alt: "Listed on Uno Directory", width: 120, height: 30 },
  { href: "https://easydofollow.dev/ai/mentorwise-ai", image: easy.url, alt: "Featured on EasyDoFollow", width: 188, height: 56 },
];

export function DirectoryBadges() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="directory-heading" className={`directory-section overflow-hidden border-b border-border py-10 ${paused ? "motion-held" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2 id="directory-heading" className="font-display text-3xl font-semibold sm:text-4xl">Around the web</h2>
          <Button variant="outline" size="icon" aria-label={paused ? "Resume directory motion" : "Pause directory motion"} title={paused ? "Resume directory motion" : "Pause directory motion"} onClick={() => setPaused(value => !value)}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {listings.map(listing => (
            <a key={listing.href} href={listing.href} target="_blank" rel="noopener" className="directory-link flex min-h-20 max-w-full items-center justify-center" aria-label={listing.alt}>
              <img src={listing.image} alt={listing.alt} width={listing.width} height={listing.height} className="h-auto max-w-full" />
            </a>
          ))}
          <a href="https://strategic-flow-audit.replit.app/directory" target="_blank" rel="noopener noreferrer" className="directory-link inline-flex min-h-12 items-center gap-2 rounded-md border border-primary/40 bg-card px-4 py-2 font-mono text-xs font-bold text-primary">
            <ExternalLink className="h-4 w-4 shrink-0" /> Listed on ToolIndex · DR 86 dofollow
          </a>
        </div>
      </div>
      <div aria-hidden="true" className="mask-marquee mt-8 overflow-hidden border-t border-border/50 pt-5">
        <div className="directory-track flex w-max">
          {[0, 1].map(copy => <div key={copy} className="flex shrink-0 items-center gap-12 px-6 font-display text-4xl font-semibold text-foreground/80 sm:text-6xl">
            {["LaunchBuff", "LaunchPanda", "Uno Directory", "EasyDoFollow", "ToolIndex"].map(name => <span key={name} className="inline-flex items-center gap-12 whitespace-nowrap">{name}<span className="text-primary">✦</span></span>)}
          </div>)}
        </div>
      </div>
    </section>
  );
}