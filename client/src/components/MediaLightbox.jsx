import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Full-screen media lightbox.
 *
 * Props:
 *   items          {Array<{type: "image"|"video", src: string}>}
 *   initialIndex   {number}  which item to open on
 *   onClose        {Function}
 *   productName    {string}  used for aria-label and alt text
 *   productSlug    {string|undefined}  when provided, shows a "View details" link
 */
export default function MediaLightbox({
  items,
  initialIndex = 0,
  onClose,
  productName,
  productSlug,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const closeBtnRef = useRef(null);
  const videoRef = useRef(null);

  const activeItem = items[activeIndex] ?? items[0];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const prev = useCallback(
    () => setActiveIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const next = useCallback(
    () => setActiveIndex((i) => Math.min(items.length - 1, i + 1)),
    [items.length],
  );

  // Lock body scroll and make the app root inert (prevents background tabbing).
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = prevOverflow;
      root?.removeAttribute("inert");
    };
  }, []);

  // Focus close button on mount.
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Keyboard: ESC closes, arrows navigate.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Pause video when switching items.
  useEffect(() => {
    if (videoRef.current) videoRef.current.pause();
  }, [activeIndex]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} media gallery`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3">
        {productSlug ? (
          <Link
            to={`/products/${productSlug}`}
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
          >
            <span>{productName}</span>
            <span className="text-xs">↗</span>
          </Link>
        ) : (
          <span className="text-sm text-white/40">{productName}</span>
        )}

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Main viewer ────────────────────────────────────────── */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12">
        {hasPrev && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous media"
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div className="flex h-full max-h-[70vh] w-full max-w-4xl items-center justify-center">
          {activeItem?.type === "video" ? (
            <video
              ref={videoRef}
              key={activeItem.src}
              src={activeItem.src}
              controls
              playsInline
              className="max-h-full max-w-full rounded-2xl"
            />
          ) : activeItem?.type === "image" ? (
            <img
              key={activeItem.src}
              src={activeItem.src}
              alt={`${productName} — view ${activeIndex + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain"
              draggable={false}
            />
          ) : null}
        </div>

        {hasNext && (
          <button
            type="button"
            onClick={next}
            aria-label="Next media"
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* ── Counter ────────────────────────────────────────────── */}
      {items.length > 1 && (
        <p className="shrink-0 py-2 text-center text-sm text-white/40">
          {activeIndex + 1} / {items.length}
        </p>
      )}

      {/* ── Thumbnail strip ────────────────────────────────────── */}
      {items.length > 1 && (
        <div className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 pb-5">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={
                item.type === "video" ? "Show video" : `Show image ${i + 1}`
              }
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === activeIndex
                  ? "border-white opacity-100"
                  : "border-white/20 opacity-50 hover:opacity-80"
              }`}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-white/10">
                  <Play size={16} className="text-white/70" />
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={`Thumbnail ${i + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
