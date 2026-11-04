// ChatGPT-styled score card from the supplied embed, compacted to the
// 370x169 FlawPilot rectangle. Inline colours are brand-specific.
const GREEN = "#10A37F";
const MUTED = "#6B6B6B";
const BORDER = "#E5E5E5";

const metrics: [string, number][] = [
  ["Perf", 98], ["SEO", 100], ["Infra", 87], ["Security", 86], ["Brand", 80], ["Trust", 92],
];

export function ChatGPTTrustBadge() {
  return (
    <a
      href="https://mentorwiseai.store/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="MentorWise AI website health badge, ChatGPT-assisted audit score 92 out of 100"
      title="Benchmark scores supplied by the website owner. Not an OpenAI certification or endorsement."
      style={{
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        background: "#FFFFFF",
        color: "#171717",
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: "12px 16px",
        width: "100%",
        maxWidth: 370,
        aspectRatio: "370 / 169",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textDecoration: "none",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z" />
          </svg>
          ChatGPT Audit
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: GREEN, border: `1px solid ${BORDER}`, padding: "4px 9px", borderRadius: 999, letterSpacing: "0.05em" }}>
          EXCELLENT
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ paddingRight: 12, borderRight: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1 }}>92</span>
          <span style={{ fontSize: 12, color: MUTED }}>/100</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "4px 8px", flex: 1, minWidth: 0 }}>
          {metrics.map(([name, v]) => (
            <div key={name} style={{ minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: MUTED }}>
                <span>{name}</span><strong style={{ color: "#171717" }}>{v}</strong>
              </div>
              <div style={{ height: 3, background: BORDER, borderRadius: 3, marginTop: 2 }}>
                <div style={{ width: `${v}%`, height: "100%", background: GREEN, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: MUTED, borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>
        <span>Owner-supplied scores · Not an OpenAI endorsement</span>
        <span>03 NOV 2026</span>
      </div>
    </a>
  );
}
