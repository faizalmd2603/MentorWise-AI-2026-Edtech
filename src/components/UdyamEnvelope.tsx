import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MousePointerClick, X, ShieldCheck } from "lucide-react";
import cert from "@/assets/udyam-certificate.png.asset.json";

/**
 * closed → flap (flap swings open) → rise (certificate slides out of the pocket)
 * → open (certificate flies from the envelope into the pop-up)
 * → shrink (flies back) → drop (slides back in) → closed (flap shuts)
 */
type Phase = "closed" | "flap" | "rise" | "open" | "shrink" | "drop";

const T = { flap: 550, rise: 700, fly: 560, drop: 600 };

export function UdyamEnvelope() {
  const [phase, setPhase] = useState<Phase>("closed");
  const certRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const open = () => {
    if (phase !== "closed") return;
    if (reduced) return setPhase("open");
    setPhase("flap");
    later(() => setPhase("rise"), T.flap);
    later(() => setPhase("open"), T.flap + T.rise);
  };

  /** Transform that maps the pop-up card onto the certificate inside the envelope. */
  const flipFrom = () => {
    const from = certRef.current?.getBoundingClientRect();
    const to = cardRef.current?.getBoundingClientRect();
    if (!from || !to || !to.width) return null;
    const s = from.width / to.width;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + (to.height * s) / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${s})`;
  };

  const close = () => {
    if (phase !== "open") return;
    if (reduced) return setPhase("closed");
    setPhase("shrink");
    const t = flipFrom();
    if (t && cardRef.current) {
      cardRef.current.animate([{ transform: "none" }, { transform: t }], {
        duration: T.fly,
        easing: "cubic-bezier(.4,0,.2,1)",
        fill: "forwards",
      });
      backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.fly, fill: "forwards" });
    }
    later(() => setPhase("drop"), T.fly);
    later(() => setPhase("closed"), T.fly + T.drop);
  };

  // Fly the certificate out of the envelope into the pop-up.
  useLayoutEffect(() => {
    if (phase !== "open" || reduced || !cardRef.current) return;
    const t = flipFrom();
    if (!t) return;
    cardRef.current.animate([{ transform: t }, { transform: "none" }], {
      duration: T.fly,
      easing: "cubic-bezier(.2,.8,.2,1)",
    });
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.fly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const flapOpen = phase !== "closed";
  const certOut = phase === "rise" || phase === "open" || phase === "shrink";
  const certHidden = phase === "open" || phase === "shrink";
  const modal = phase === "open" || phase === "shrink";

  return (
    <section aria-labelledby="udyam-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="udyam-panel relative overflow-hidden rounded-3xl border border-primary/30 px-6 py-12 sm:px-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Government of India · MSME</p>
            <h2 id="udyam-heading" className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Officially registered under Udyam
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              MentorWise AI is a registered Micro Enterprise (Services) in Chennai, Tamil Nadu.
              Registration No. <span className="font-semibold text-foreground">UDYAM-TN-02-0518128</span>.
            </p>
            <button
              type="button"
              onClick={open}
              className="udyam-cta mt-6 inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary"
            >
              <MousePointerClick className="h-4 w-4" />
              Click to view our Udyam registration certificate
            </button>
          </div>

          <button
            type="button"
            onClick={open}
            aria-label="Open envelope to view Udyam registration certificate"
            className="udyam-env group relative mx-auto mt-16 aspect-[4/3] w-full max-w-sm"
          >
            {/* back of the envelope (the inside you see when the flap opens) */}
            <svg viewBox="0 0 400 300" className="absolute inset-0 z-[1] h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="uenv-back" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="oklch(0.2 0.05 262)" />
                  <stop offset="1" stopColor="oklch(0.15 0.04 262)" />
                </linearGradient>
              </defs>
              <rect x="1" y="61" width="398" height="238" rx="14" fill="url(#uenv-back)" stroke="var(--primary)" strokeOpacity=".55" strokeWidth="1.5" />
            </svg>

            {/* certificate — sits between the back and the front pocket */}
            <div
              ref={certRef}
              className="udyam-env-cert absolute inset-x-[9%] top-[24%] bottom-[7%] z-[2] overflow-hidden rounded-[6px] border border-primary/70 bg-card"
              style={{
                transform: certOut ? "translateY(-52%)" : "translateY(0)",
                opacity: certHidden ? 0 : 1,
                transition: `transform ${(phase === "drop" ? T.drop : T.rise) / 1000}s cubic-bezier(.2,.8,.2,1)`,
              }}
            >
              <img src={cert.url} alt="" className="h-full w-full object-cover object-top" draggable={false} />
            </div>

            {/* front pocket */}
            <svg viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 z-[3] h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="uenv-front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="oklch(0.3 0.07 262)" />
                  <stop offset="1" stopColor="oklch(0.23 0.06 262)" />
                </linearGradient>
                <linearGradient id="uenv-side" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="oklch(0.27 0.065 262)" />
                  <stop offset="1" stopColor="oklch(0.25 0.06 262)" />
                </linearGradient>
              </defs>
              {/* side folds */}
              <path d="M1 75 L180 205 L1 299 Z" fill="url(#uenv-side)" />
              <path d="M399 75 L220 205 L399 299 Z" fill="url(#uenv-side)" />
              {/* bottom fold */}
              <path d="M15 299 Q1 299 1 285 L1 160 L200 225 L399 160 L399 285 Q399 299 385 299 Z" fill="url(#uenv-front)" />
              <path d="M1 160 L200 225 L399 160" fill="none" stroke="var(--primary)" strokeOpacity=".7" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="1" y="61" width="398" height="238" rx="14" fill="none" stroke="var(--primary)" strokeOpacity=".55" strokeWidth="1.5" />
            </svg>

            {/* flap — hinged on the top edge */}
            <div
              className="pointer-events-none absolute inset-x-0 top-[20%] h-[47%] origin-top"
              style={{
                zIndex: flapOpen ? 0 : 4,
                transform: flapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                transition: `transform ${T.flap / 1000}s cubic-bezier(.4,0,.2,1), z-index 0s linear ${flapOpen ? T.flap / 2000 : T.flap / 2000}s`,
              }}
            >
              <svg viewBox="0 0 400 141" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id="uenv-flap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="oklch(0.33 0.08 262)" />
                    <stop offset="1" stopColor="oklch(0.27 0.07 262)" />
                  </linearGradient>
                </defs>
                <path d="M2 1 L398 1 L212 133 Q200 141 188 133 Z" fill="url(#uenv-flap)" stroke="var(--primary)" strokeOpacity=".7" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>

            <span
              className="udyam-seal absolute left-1/2 top-[64%] z-[5] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-xs font-bold text-primary-foreground"
              style={{ opacity: flapOpen ? 0 : 1 }}
            >
              MW
            </span>

            {phase === "closed" && (
              <span className="pointer-events-none absolute bottom-[14%] right-[12%] z-[6]">
                <span className="udyam-ripple absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-primary" />
                <MousePointerClick className="udyam-cursor h-7 w-7 text-primary drop-shadow" />
              </span>
            )}
          </button>
        </div>
      </div>

      {modal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Udyam registration certificate"
          onClick={close}
          className="fixed inset-0 z-[2147483000] isolate grid place-items-center p-4"
        >
          <div ref={backdropRef} aria-hidden className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <div
            ref={cardRef}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md origin-center will-change-transform"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close certificate"
              className="absolute -right-2 -top-2 z-10 grid h-10 w-10 place-items-center rounded-full border border-primary/50 bg-card text-foreground shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-auto rounded-2xl border-2 border-primary shadow-2xl" style={{ maxHeight: "80vh" }}>
              <img src={cert.url} alt="MentorWise AI Udyam Registration Certificate UDYAM-TN-02-0518128, Micro Enterprise (Services), Chennai, Tamil Nadu" className="block w-full" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-card/90 px-3 py-2 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Business contact hidden for privacy · Verify at udyamregistration.gov.in
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
