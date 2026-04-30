export default function FontSelector({ fonts, value, onChange, previewText = "Abc" }) {
  return (
    <div className="space-y-2">
      {fonts.map((font) => (
        <label
          key={font.id}
          className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 cursor-pointer transition ${
            value === font.id
              ? "border-[#b26a2a] bg-amber-50/60 ring-1 ring-[#b26a2a]/30"
              : "border-neutral-200 bg-white hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="personalization-font"
              value={font.id}
              checked={value === font.id}
              onChange={() => onChange(font.id)}
              className="accent-[#b26a2a]"
            />
            <span className="text-sm text-neutral-700">{font.name}</span>
          </div>
          <span
            style={{ fontFamily: font.cssFamily, fontSize: "1.25rem", lineHeight: 1.3 }}
            className="text-neutral-800 shrink-0 max-w-[140px] truncate text-right"
          >
            {previewText}
          </span>
        </label>
      ))}
    </div>
  );
}
