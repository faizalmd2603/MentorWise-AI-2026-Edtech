import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";

/** Gemini/ChatGPT-style rich markdown renderer for agent replies. */
export function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="chat-md text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h3 className="mt-4 mb-2 font-display text-base font-bold first:mt-0" {...p} />,
          h2: (p) => <h3 className="mt-4 mb-2 font-display text-base font-bold first:mt-0" {...p} />,
          h3: (p) => <h4 className="mt-3 mb-1.5 font-display text-sm font-bold first:mt-0" {...p} />,
          h4: (p) => <h4 className="mt-3 mb-1.5 font-display text-sm font-semibold first:mt-0" {...p} />,
          p: (p) => <p className="mb-3 last:mb-0" {...p} />,
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          ul: (p) => <ul className="mb-3 ml-5 list-disc space-y-1.5 last:mb-0 marker:text-cyber" {...p} />,
          ol: (p) => <ol className="mb-3 ml-5 list-decimal space-y-1.5 last:mb-0 marker:text-cyber" {...p} />,
          li: (p) => <li className="pl-0.5" {...p} />,
          hr: () => <hr className="my-4 border-border/60" />,
          blockquote: (p) => (
            <blockquote className="my-3 border-l-2 border-cyber/50 pl-3 text-muted-foreground italic" {...p} />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-baseline gap-0.5 font-medium text-cyber underline decoration-cyber/40 underline-offset-2 hover:decoration-cyber break-words"
            >
              {children}
              <ExternalLink className="h-3 w-3 shrink-0 translate-y-[1px]" />
            </a>
          ),
          code: ({ className, children, ...rest }) => {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) {
              return (
                <code className="block w-full whitespace-pre-wrap break-words font-mono text-[12px]" {...rest}>
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-background/70 px-1.5 py-0.5 font-mono text-[12px] text-cyber ring-1 ring-border" {...rest}>
                {children}
              </code>
            );
          },
          pre: (p) => (
            <pre className="my-3 overflow-x-auto rounded-xl bg-background/70 p-3 ring-1 ring-border" {...p} />
          ),
          table: (p) => (
            <div className="my-3 overflow-x-auto rounded-xl ring-1 ring-border">
              <table className="w-full border-collapse text-left text-[13px]" {...p} />
            </div>
          ),
          thead: (p) => <thead className="bg-card/80" {...p} />,
          th: (p) => <th className="border-b border-border px-3 py-2 font-semibold" {...p} />,
          td: (p) => <td className="border-b border-border/50 px-3 py-2 align-top" {...p} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
