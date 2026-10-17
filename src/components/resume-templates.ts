export type ResumeLayout = "classic" | "centered" | "sidebar" | "banner" | "minimal" | "compact";

export type ResumeTemplate = {
  id: string;
  name: string;
  layout: ResumeLayout;
  accent: string;
  font: string;
};

const LAYOUTS: { id: ResumeLayout; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "centered", label: "Centered" },
  { id: "sidebar", label: "Sidebar" },
  { id: "banner", label: "Banner" },
  { id: "minimal", label: "Minimal" },
  { id: "compact", label: "Compact" },
];

// Resume ink colours (printed on white paper, so they live outside the app theme).
const PALETTES: { name: string; accent: string; font: string }[] = [
  { name: "Navy", accent: "#0b3b8c", font: "'Helvetica Neue', Arial, sans-serif" },
  { name: "Charcoal", accent: "#2b2b2b", font: "Georgia, 'Times New Roman', serif" },
  { name: "Emerald", accent: "#0f6b4f", font: "'Segoe UI', Roboto, Arial, sans-serif" },
  { name: "Burgundy", accent: "#7a1f3d", font: "Garamond, Georgia, serif" },
  { name: "Teal", accent: "#0e6f7a", font: "Calibri, 'Segoe UI', Arial, sans-serif" },
  { name: "Slate", accent: "#3d4f66", font: "Verdana, Geneva, sans-serif" },
  { name: "Royal", accent: "#4b2a8a", font: "'Trebuchet MS', Arial, sans-serif" },
  { name: "Copper", accent: "#9a4a12", font: "Cambria, Georgia, serif" },
  { name: "Ocean", accent: "#1559a8", font: "Tahoma, Verdana, sans-serif" },
];

export const RESUME_TEMPLATES: ResumeTemplate[] = LAYOUTS.flatMap((l) =>
  PALETTES.map((p) => ({
    id: `${l.id}-${p.name.toLowerCase()}`,
    name: `${l.label} ${p.name}`,
    layout: l.id,
    accent: p.accent,
    font: p.font,
  })),
);

export const DEFAULT_TEMPLATE = RESUME_TEMPLATES[0];
export const LAYOUT_LABELS = LAYOUTS;
