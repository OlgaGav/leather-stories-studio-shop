import { FONTS, getFontById } from "../data/fonts";
import FontSelector from "./FontSelector";

const MAX_LEN = 20;

export default function PersonalizationFields({ value, onChange }) {
  const text = value?.text || "";
  const fontId = value?.fontId || FONTS[0].id;
  const selectedFont = getFontById(fontId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-neutral-500 mb-1">
          Personalization text
        </label>
        <input
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-[#b26a2a] focus:outline-none transition"
          value={text}
          maxLength={MAX_LEN}
          placeholder="e.g. Good Luck"
          onChange={(e) => onChange({ text: e.target.value.slice(0, MAX_LEN), fontId })}
          autoFocus
        />
        <p className="mt-1 text-xs text-neutral-400">{text.length}/{MAX_LEN} characters</p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
          Choose font
        </label>
        <FontSelector
          fonts={FONTS}
          value={fontId}
          onChange={(newFontId) => onChange({ text, fontId: newFontId })}
          previewText={text || "Abc"}
        />
      </div>

      {text && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">
            Preview
          </div>
          <p
            style={{ fontFamily: selectedFont.cssFamily, fontSize: "1.75rem", lineHeight: 1.3 }}
            className="text-neutral-800"
          >
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
