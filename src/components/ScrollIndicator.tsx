export function ScrollIndicator({ label = "Scroll" }: { label?: string }) {
  return (
    <div className="pointer-events-none mt-12 flex flex-col items-center gap-2 opacity-80 animate-fade-up">
      <div className="relative h-10 w-6 rounded-full border-2 border-foreground/30">
        <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-cyber animate-scroll-dot" />
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
    </div>
  );
}
