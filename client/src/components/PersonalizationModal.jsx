import { useEffect, useMemo, useState } from "react";

export default function PersonalizationModal({
  open,
  onClose,
  onSave,
  product,
  initialValue,
}) {
  const fonts = product.fonts || [
    { id: "serif", name: "Serif" },
    { id: "sans", name: "Sans" },
  ];

  const maxLen = product.maxPersonalizationLength ?? 20;

  const [fontId, setFontId] = useState(initialValue?.fontId || fonts[0]?.id);
  const [text, setText] = useState(initialValue?.text || "");

  useEffect(() => {
    if (open) {
      setFontId(initialValue?.fontId || fonts[0]?.id);
      setText(initialValue?.text || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fontPreviewClass = useMemo(() => {
    // TODO: Just a simple preview mapping; will be replaced later with real brand fonts
    if (fontId === "serif") return "font-serif";
    if (fontId === "script") return "font-serif italic";
    return "font-sans";
  }, [fontId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Add personalization</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Enter text (Cyrillic supported). Max {maxLen} characters.
            </p>
          </div>
          <button
            className="rounded-md px-3 py-1 text-sm hover:bg-neutral-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-xs font-medium text-neutral-700">Font</label>
            <select
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              value={fontId}
              onChange={(e) => setFontId(e.target.value)}
            >
              {fonts.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-700">Text</label>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxLen))}
              placeholder="e.g., John"
            />
            <div className="mt-1 text-xs text-neutral-500">
              {text.length}/{maxLen}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-xs font-medium text-neutral-600">Preview</div>
            <div className={`mt-2 text-2xl ${fontPreviewClass}`}>
              {text || "—"}
            </div>
          </div>
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
              onSave({ text: text.trim(), fontId });
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