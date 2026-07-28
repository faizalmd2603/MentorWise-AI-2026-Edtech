import { ChevronDown } from "lucide-react";

export function ScrollIndicator({ label = "Scroll to explore" }: { label?: string }) {
  return (
    <div className="pointer-events-none mx-auto mt-14 flex w-full flex-col items-center gap-3 opacity-90 animate-fade-up [animation-delay:600ms]">
      <div
        className="group relative h-12 w-7 rounded-full border-2 border-foreground/40 shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-primary)_10%,transparent)] transition-transform will-change-transform"
        style={{ transform: "perspective(400px) rotateX(18deg)" }}
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-2 h-2.5 w-1.5 -translate-x-1/2 rounded-full bg-primary animate-scroll-dot" />
        <span className="absolute inset-0 rounded-full bg-primary/0 blur-md transition group-hover:bg-primary/30" />
      </div>
      <ChevronDown className="h-4 w-4 animate-float-y text-foreground/50" />
      <div className="text-[10px] uppercase tracking-[0.42em] text-muted-foreground">{label}</div>
    </div>
  );
}
