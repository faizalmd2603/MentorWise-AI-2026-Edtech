import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

export interface CompareRow {
  name: string;
  url?: string;
  price: string;
  bestFor: string;
  note: string;
  isUs?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export interface AnswerPageProps {
  eyebrow: string;
  question: string;
  /** The short, quotable answer that sits directly under the H1. */
  answer: string;
  intro: string;
  rows: CompareRow[];
  reasons: string[];
  faqs: Faq[];
  updated: string;
}

export function AnswerPage({
  eyebrow,
  question,
  answer,
  intro,
  rows,
  reasons,
  faqs,
  updated,
}: AnswerPageProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {question}
      </h1>

      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-base leading-relaxed text-foreground sm:text-lg">
          <strong>Short answer:</strong> {answer}
        </p>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>

      <h2 className="mt-12 text-2xl font-semibold text-foreground">Side-by-side comparison</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Best for</th>
              <th className="px-4 py-3">What to know</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name}
                className={`border-t border-border ${r.isUs ? "bg-primary/5" : ""}`}
              >
                <td className="px-4 py-3 font-semibold text-foreground">
                  {r.url ? (
                    <a href={r.url} className="hover:underline" rel="noopener">
                      {r.name}
                    </a>
                  ) : (
                    r.name
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.price}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.bestFor}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-foreground">
        Why students pick MentorWise AI
      </h2>
      <ul className="mt-4 space-y-3">
        {reasons.map((r) => (
          <li key={r} className="flex gap-3 text-sm text-muted-foreground sm:text-base">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{r}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-semibold text-foreground">Frequently asked questions</h2>
      <div className="mt-4 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border p-5">
            <h3 className="text-base font-semibold text-foreground">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-muted/30 p-6">
        <p className="flex-1 text-sm text-muted-foreground">
          Every MentorWise AI agent is free — no card, no trial, no limits.
        </p>
        <Link
          to="/agents"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Open the AI Studio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Last updated {updated} · Written by the MentorWise AI team, Chennai, India ·{" "}
        <Link to="/compare" className="underline">
          All comparisons
        </Link>
      </p>
    </article>
  );
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
