// Gemini-styled verified score card. Same 370x169 rectangle as FlawPilot,
// but with its own dark Google-inspired look. Inline colours are brand-specific.
const BLUE = "#8AB4F8";
const MUTED = "#9AA0A6";
const TEXT = "#E8EAED";

export function GeminiTrustBadge() {
  return (
    <div
      role="img"
      aria-label="Gemini verified score 92 out of 100 for mentorwiseai.store, scanned Nov 3, 2026"
      style={{
        boxSizing: "border-box",
        fontFamily: "'Google Sans', Roboto, system-ui, sans-serif",
        background: "linear-gradient(135deg, #131314 0%, #1E1F20 60%, #1B2440 100%)",
        color: TEXT,
        borderRadius: 18,
        padding: "14px 18px 12px",
        width: "100%",
        maxWidth: 370,
        aspectRatio: "370 / 169",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        border: "1px solid #3C4043",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#4285F4,#9B72CB,#D96570)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="mwGemSpark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4285F4" />
                <stop offset="50%" stopColor="#9B72CB" />
                <stop offset="100%" stopColor="#D96570" />
              </linearGradient>
            </defs>
            <path d="M12 0C12 6.6 17.4 12 24 12C17.4 12 12 17.4 12 24C12 17.4 6.6 12 0 12C6.6 12 12 6.6 12 0Z" fill="url(#mwGemSpark)" />
          </svg>
          Gemini
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, color: BLUE, background: "rgba(138,180,248,0.12)", padding: "4px 10px", borderRadius: 999, letterSpacing: "0.04em" }}>
          AI REVIEWED
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 46, fontWeight: 400, lineHeight: 1, background: "linear-gradient(90deg,#4285F4,#9B72CB,#D96570)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          92
        </span>
        <span style={{ fontSize: 16, color: MUTED }}>/100</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED, textAlign: "right" }}>mentorwiseai.store</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, borderTop: "1px solid #3C4043", paddingTop: 7 }}>
        <span style={{ color: TEXT }}>Trust &amp; safety review</span>
        <span>Nov 3, 2026</span>
      </div>
    </div>
  );
}
