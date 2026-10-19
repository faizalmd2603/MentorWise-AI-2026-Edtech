import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MousePointerClick, X, ShieldCheck } from "lucide-react";
import cert from "@/assets/udyam-certificate.png.asset.json";

type Phase = "closed" | "opening" | "open" | "closing";

export function UdyamEnvelope() {
  const [phase, setPhase] = useState<Phase>("closed");

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), 650);
  };
  const close = () => {
    if (phase !== "open") return;
    setPhase("closing");
    window.setTimeout(() => setPhase("closed"), 600);
  };

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const flapOpen = phase !== "closed";
  const modal = phase === "open" || phase === "closing";

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
            className="udyam-env group relative mx-auto aspect-[4/3] w-full max-w-sm"
          >
            {/* certificate peeking */}
            <div
              className={`absolute inset-x-[8%] bottom-[10%] top-[-12%] overflow-hidden rounded-md border-2 border-primary bg-card shadow-xl transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                flapOpen ? "-translate-y-[35%]" : "group-hover:-translate-y-[8%]"
              }`}
            >
              <img src={cert.url} alt="" className="h-full w-full object-cover object-top" />
            </div>
            {/* envelope body */}
            <div className="udyam-env-body absolute inset-x-0 bottom-0 top-[22%] rounded-xl" />
            <div className="udyam-env-pocket absolute inset-x-0 bottom-0 top-[22%] rounded-xl" />
            {/* flap */}
            <div
              className={`udyam-env-flap absolute inset-x-0 top-[22%] h-[48%] origin-top transition-transform duration-700 ${
                flapOpen ? "udyam-flap-open" : ""
              }`}
            />
            <span className="udyam-seal absolute left-1/2 top-[52%] z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-xs font-bold text-primary-foreground">
              MW
            </span>
            {/* click ripple cursor */}
            {phase === "closed" && (
              <span className="pointer-events-none absolute bottom-[18%] right-[14%] z-30">
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
          className={`fixed inset-0 z-[2147483000] isolate grid place-items-center bg-background/60 p-4 backdrop-blur-md ${
            phase === "closing" ? "udyam-fade-out" : "udyam-fade-in"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-h-[92vh] w-full max-w-md ${phase === "closing" ? "udyam-cert-out" : "udyam-cert-in"}`}
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
