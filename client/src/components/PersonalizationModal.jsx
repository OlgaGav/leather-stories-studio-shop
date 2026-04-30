import { useEffect, useState } from "react";
import { FONTS, getFontById } from "../data/fonts";
import FontSelector from "./FontSelector";

const MAX_LEN = 20;

export default function PersonalizationModal({ open, onClose, onSave, initialValue }) {
  const [text, setText] = useState(initialValue?.text || "");
  const [fontId, setFontId] = useState(initialValue?.fontId || FONTS[0].id);

  useEffect(() => {
    if (open) {
      setText(initialValue?.text || "");
      setFontId(initialValue?.fontId || FONTS[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectedFont = getFontById(fontId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="relative w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-semibold">Add personalization</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Up to {MAX_LEN} characters. Latin + Cyrillic supported.
            </p>
          </div>
          <button
            className="rounded-md px-3 py-1 text-sm hover:bg-neutral-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-neutral-500 mb-1">
              Personalization text
            </label>
            <input
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-[#b26a2a] focus:outline-none transition"
              value={text}
              maxLength={MAX_LEN}
              placeholder="e.g. Good Luck"
              onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
              autoFocus
            />
            <p className="mt-1 text-xs text-neutral-400">{text.length}/{MAX_LEN}</p>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-neutral-500 mb-2">
              Choose font
            </label>
            <FontSelector
              fonts={FONTS}
              value={fontId}
              onChange={setFontId}
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

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
            disabled={!text.trim()}
            onClick={() => {
              onSave({
                enabled: true,
                text: text.trim(),
                fontId,
                fontName: selectedFont.name,
                fontFamily: selectedFont.cssFamily,
              });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
