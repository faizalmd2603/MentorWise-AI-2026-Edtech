// Replica of the supplied Gemini "Verified Trust Badge" embed markup.
// Kept as inline styles so the card keeps its official look inside any theme.
const GREEN = "#10B981";
const GREY = "#9CA3AF";
const INK = "#1E293B";

export function GeminiTrustBadge() {
  return (
    <div
      style={{
        boxSizing: "border-box",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif",
        backgroundColor: "#FAF6EE",
        color: "#7F8E9C",
        borderRadius: 22,
        padding: "14px 18px 12px 26px",
        width: "100%",
        maxWidth: 370,
        aspectRatio: "370 / 169",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        position: "relative",
        border: "1px solid rgba(0,0,0,0.02)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          backgroundColor: GREEN,
        }}
      />

      {/* Top navigation & status row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px 12px",
          marginBottom: 0,
          paddingLeft: 6,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: "0.06em",
            color: GREY,
            textTransform: "uppercase",
          }}
        >
          MENTORWISEAI.STORE
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: GREEN,
            border: "1px solid rgba(16, 185, 129, 0.3)",
            backgroundColor: "rgba(16, 185, 129, 0.05)",
            padding: "4px 12px",
            borderRadius: 20,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Hardened
        </span>
      </div>

      {/* Verified audit score row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          marginBottom: 0,
          paddingLeft: 6,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: GREEN,
            lineHeight: 1,
          }}
        >
          92
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: GREY,
            marginLeft: 12,
          }}
        >
          /100
        </span>
      </div>

      {/* Trust & verification footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "nowrap",
          gap: "8px",
          paddingLeft: 6,
          borderTop: "1px solid rgba(0,0,0,0.05)",
          paddingTop: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: GREEN,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          ✓ Trustworthy &amp; Verified
        </div>
        <div style={{ textAlign: "right", lineHeight: 1.4, marginLeft: "auto" }}>
          <div style={{ fontSize: 10, color: GREY }}>Scanned on Nov 3, 2026</div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: INK,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 5,
              marginTop: 2,
            }}
          >
            Authorized by
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 700,
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ transform: "translateY(-1px)" }}
              >
                <path
                  d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z"
                  fill="url(#mwGeminiSparkGradient)"
                />
                <defs>
                  <linearGradient
                    id="mwGeminiSparkGradient"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="50%" stopColor="#9B72CB" />
                    <stop offset="100%" stopColor="#D96570" />
                  </linearGradient>
                </defs>
              </svg>
              Gemini
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
