import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PersonalizationModal from "./PersonalizationModal";
import { findVariant, formatMoney } from "../utils/productVariant";
import { features } from "../config/features";

function useCarousel(images) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  // Reset to first slide whenever the image set changes (variant switch)
  useEffect(() => {
    setIndex(0);
  }, [images]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return { index, setIndex, prev, next, onTouchStart, onTouchEnd };
}

export default function ProductCard({ product, onOrderNow }) {
  const [colorId, setColorId] = useState(product.defaultColorId || product.colors?.[0]?.id || "");
  const [leatherId, setLeatherId] = useState(product.leathers?.[0]?.id || "");
  const [personalization, setPersonalization] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedColor = useMemo(
    () => (product.colors || []).find((c) => c.id === colorId),
    [product.colors, colorId]
  );

  const selectedLeather = useMemo(
    () => (product.leathers || []).find((l) => l.id === leatherId),
    [product.leathers, leatherId]
  );

  const variant = useMemo(
    () => findVariant(product, { colorId, leatherId }),
    [product, colorId, leatherId]
  );

  const images = useMemo(() => {
    const imgs = variant?.images?.length ? variant.images : product.defaultImages;
    return imgs || [];
  }, [variant, product.defaultImages]);

  const { index, setIndex, prev, next, onTouchStart, onTouchEnd } = useCarousel(images);
  const multi = images.length > 1;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      {/* Image carousel */}
      <div className="relative group bg-[#efe7dc]">
        <Link to={`/products/${product.slug}?color=${colorId}&leather=${leatherId}`} className="block">
          <div
            className="aspect-[1/1] w-full overflow-hidden"
            onTouchStart={multi ? onTouchStart : undefined}
            onTouchEnd={multi ? onTouchEnd : undefined}
          >
            {images.length > 0 ? (
              <img
                key={images[index]}
                src={images[index]}
                alt={`${product.name} — view ${index + 1}`}
                className="h-full w-full object-contain p-4 transition-opacity duration-300"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
        </Link>

        {/* Prev / Next arrows — outside Link, always in DOM for layout stability */}
        {multi && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow transition opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white"
            >
              <ChevronLeft size={16} className="text-neutral-700" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow transition opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white"
            >
              <ChevronRight size={16} className="text-neutral-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-4 bg-neutral-700"
                      : "w-1.5 bg-neutral-400/70 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-6">
          <Link to={`/products/${product.slug}?color=${colorId}&leather=${leatherId}`} className="min-w-0">
            <h3 className="text-3xl font-semibold tracking-tight text-neutral-800 hover:text-[#8b4a1f]">
              {product.name}
            </h3>
          </Link>

          <div className="shrink-0 text-2xl font-semibold text-[#b26a2a]">
            {formatMoney(product.price, product.currency || "USD")}
          </div>
        </div>

        {/* Description */}
        <p className="mt-5 text-lg leading-relaxed text-neutral-600">
          {product.description}
        </p>

        {/* Color */}
        <div className="mt-10">
          <div className="text-[15px] uppercase tracking-[0.18em] text-neutral-600">
            Color: {selectedColor?.name || "—"}
          </div>

          <div className="mt-5 flex gap-4">
            {(product.colors || []).map((c) => {
              const active = c.id === colorId;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  className={`h-12 w-12 rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent ${
                    active
                      ? "border-gold-accent ring-4 ring-gold-accent/25 scale-105 shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                      : "border-neutral-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Select color ${c.name}`}
                  title={c.name}
                />
              );
            })}
          </div>
        </div>

        {/* Leather */}
        <div className="mt-10">
          <div className="text-[15px] uppercase tracking-[0.18em] text-neutral-600">
            Leather: {selectedLeather?.name || "—"}
          </div>

          {(product.leathers?.length || 0) > 1 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {product.leathers.map((l) => {
                const active = l.id === leatherId;

                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLeatherId(l.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-neutral-900 bg-white"
                        : "border-neutral-300 bg-white/60 hover:bg-white"
                    }`}
                    title={l.name}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-8">
          <Link
            to={`/products/${product.slug}?color=${colorId}&leather=${leatherId}`}
            className="inline-block text-sm uppercase tracking-[0.18em] text-[#b26a2a] hover:opacity-80"
          >
            View details
          </Link>
        </div>

        {/* Order now */}
        <button
          className="mt-8 w-full rounded-md bg-[#8b4a1f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a401b]"
          onClick={() => {
            if (!colorId) {
              alert("Please select a color");
              return;
            }

            if ((product.leathers?.length || 0) > 1 && !leatherId) {
              alert("Please select leather");
              return;
            }

            onOrderNow?.({
              productId: product.id,
              name: product.name,
              price: product.price,
              currency: product.currency || "USD",
              colorId,
              leatherId: product.leathers?.length ? leatherId : "",
              personalization: features.personalization ? personalization : null,
              quantity: 1,
              imageUrl: variant?.images?.[0] || product.defaultImages?.[0] || null,
            });
          }}
        >
          Order Now — {formatMoney(product.price, product.currency || "USD")}
        </button>

        {/* Modal */}
        {features.personalization && (
          <PersonalizationModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={setPersonalization}
            product={product}
            initialValue={personalization}
          />
        )}
      </div>
    </div>
  );
}