export const FONTS = [
  { id: "engagement", name: "Engagement", cssFamily: "'Engagement', cursive" },
  { id: "great-vibes", name: "Great Vibes", cssFamily: "'Great Vibes', cursive" },
  { id: "macondo-swash-caps", name: "Macondo Swash Caps", cssFamily: "'Macondo Swash Caps', cursive" },
  { id: "story-script", name: "Story Script", cssFamily: "'Story Script', cursive" },
];

export const FONT_IDS = new Set(FONTS.map((f) => f.id));

export function getFontById(id) {
  return FONTS.find((f) => f.id === id) || FONTS[0];
}
