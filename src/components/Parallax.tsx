import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** pixels moved per viewport of scroll; negative moves against the scroll */
  speed?: number;
  /** shrink + fade as the element leaves the top of the screen */
  exit?: boolean;
};

/**
 * Scroll-linked motion that runs on every device (no CSS scroll-timeline needed).
 * Writes the transform directly in a rAF loop so React never re-renders on scroll.
 */
export function Parallax({ children, className = "", speed = 60, exit = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 when the element's centre is a viewport below, +1 when a viewport above
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      const y = progress * speed;
      if (exit) {
        const out = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
        el.style.transform = `translate3d(0, ${y}px, 0) scale(${1 - out * 0.08})`;
        el.style.opacity = String(1 - out * 0.85);
      } else {
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, exit]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
