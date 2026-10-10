import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** delay in ms before the reveal transition runs */
  delay?: number;
  /** how much of the element must be visible before revealing */
  threshold?: number;
  as?: "div" | "section" | "li";
  /** direction the element glides in from */
  from?: "up" | "left" | "right" | "zoom";
};

/**
 * Scroll-driven reveal wrapper. Adds `.is-visible` when the element enters
 * the viewport and removes it again once it fully leaves, so sections glide
 * in every time the visitor scrolls back to them.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
  from = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) setVisible(true);
          else if (!entry.isIntersecting) setVisible(false);
        }
      },
      { threshold: [0, threshold], rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal-${from} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
