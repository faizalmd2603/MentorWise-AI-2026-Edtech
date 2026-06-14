import { useEffect, useState } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}

export function Typewriter({
  phrases,
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseMs = 3000,
  className = "",
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    let delay = deleting ? deletingSpeed : typingSpeed;

    if (!deleting && text === current) {
      delay = pauseMs;
      const t = setTimeout(() => setDeleting(true), delay);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
      );
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="inline-block w-[2px] h-[1em] align-[-0.15em] ml-1 bg-current animate-blink" />
    </span>
  );
}
