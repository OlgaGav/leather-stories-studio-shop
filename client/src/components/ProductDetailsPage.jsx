import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { Play } from "lucide-react";
import { useCart } from "../context/CartContext";
import PersonalizationModal from "./PersonalizationModal";
import MediaLightbox from "./MediaLightbox";
import { products } from "../data/products";
import { findVariant, formatMoney } from "../utils/productVariant";
import { features } from "../config/features";

// ---------------------------------------------------------------------------
// Media gallery helpers
// ---------------------------------------------------------------------------

/** Normalise variant data into a flat mediaItems list */
function buildMediaItems(variant, defaultImages) {
  const imgs = variant?.images?.length ? variant.images : (defaultImages || []);
  const items = imgs.map((src) => ({ type: "image", src }));
  if (variant?.video) items.push({ type: "video", src: variant.video });
  return items;
}

function VideoThumbnail() {
  return (
    <div className="h-20 w-20 flex flex-col items-center justify-center gap-1 bg-neutral-100">
      <Play size={20} className="text-neutral-500" />
      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
        Video
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route guard — keeps hooks unconditional
// ---------------------------------------------------------------------------

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-12 md:px-8 md:pt-28">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </section>
    );
  }

  return <ProductDetailsContent product={product} />;
}

// ---------------------------------------------------------------------------
// Content — all hooks live here
// ---------------------------------------------------------------------------

function ProductDetailsContent({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  // Seed selection from query params (passed by ProductCard).
  // Validate each param against the product's actual options so a
  // hand-crafted or stale URL can never set an invalid variant.
  const initialColorId =
    product.colors?.find((c) => c.id === searchParams.get("color"))?.id ??
    product.defaultColorId ??
    product.colors?.[0]?.id ??
    "";
  const initialLeatherId =
    product.leathers?.find((l) => l.id === searchParams.get("leather"))?.id ??
    product.leathers?.[0]?.id ??
    "";

  const [colorId, setColorId] = useState(initialColorId);
  const [leatherId, setLeatherId] = useState(initialLeatherId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [personalization, setPersonalization] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const videoRef = useRef(null);

  const selectedColor = useMemo(
    () => product.colors?.find((c) => c.id === colorId),
    [product, colorId],
  );

  const selectedLeather = useMemo(
    () => product.leathers?.find((l) => l.id === leatherId),
    [product, leatherId],
  );

  const variant = useMemo(
    () => findVariant(product, { colorId, leatherId }),
    [product, colorId, leatherId],
  );

  const mediaItems = useMemo(
    () => buildMediaItems(variant, product.defaultImages),
    [variant, product.defaultImages],
  );

  // Reset gallery and pause any playing video when the variant changes
  useEffect(() => {
    setActiveIndex(0);
    if (videoRef.current) videoRef.current.pause();
  }, [variant]);

  const activeItem = mediaItems[activeIndex] ?? mediaItems[0];

  const selectVariantColor = (id) => {
    setColorId(id);
    // activeIndex reset handled by the variant useEffect above
  };

  const selectVariantLeather = (id) => {
    setLeatherId(id);
  };

  const orderNow = () => {
    if (!colorId) {
      alert("Please select a color");
      return;
    }
    if ((product.leathers?.length || 0) > 1 && !leatherId) {
      alert("Please select leather");
      return;
    }

    addToCart({
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

    navigate("/cart");
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-12 md:px-8 md:pt-28">
      <Link
        to="/#products"
        className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#a35a22] hover:opacity-80"
      >
        ← Back to Shop
      </Link>

      <nav aria-label="Breadcrumb" className="mt-4 mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <li>
            <Link to="/" className="hover:text-[#8b4a1f]">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/#products" className="hover:text-[#8b4a1f]">Shop</Link>
          </li>
          <li>/</li>
          <li className="text-neutral-800">{product.name}</li>
        </ol>
      </nav>

      <div className="grid items-start gap-10 md:grid-cols-2 lg:gap-14">
        {/* ---------------------------------------------------------------- */}
        {/* Media gallery                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div>
          {/* Main viewer — click to open lightbox */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open fullscreen gallery"
            className="group w-full overflow-hidden rounded-3xl border border-border bg-[#efe7dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b26a2a]"
          >
            <div className="relative aspect-[4/5] w-full">
              {activeItem?.type === "video" ? (
                <video
                  ref={videoRef}
                  key={activeItem.src}
                  src={activeItem.src}
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : activeItem?.type === "image" ? (
                <img
                  key={activeItem.src}
                  src={activeItem.src}
                  alt={`${product.name} — view ${activeIndex + 1}`}
                  className="h-full w-full object-contain p-4 transition-opacity group-hover:opacity-90"
                />
              ) : (
                <div className="h-full w-full" />
              )}
              {/* Expand hint */}
              <div className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              </div>
            </div>
          </button>

          {/* Thumbnail strip — shown only when there is more than one item */}
          {mediaItems.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {mediaItems.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={
                    item.type === "video"
                      ? "Show video"
                      : `Show image ${i + 1}`
                  }
                  className={`overflow-hidden rounded-xl border transition ${
                    i === activeIndex
                      ? "border-[#b26a2a] ring-1 ring-[#b26a2a]/30"
                      : "border-border hover:border-[#b26a2a]/40"
                  }`}
                >
                  {item.type === "video" ? (
                    <VideoThumbnail />
                  ) : (
                    <img
                      src={item.src}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="h-20 w-20 object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Product details                                                   */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#b26a2a]">
            {product.subtitle}
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-neutral-900">
            {product.name}
          </h1>

          <p className="mt-3 text-sm text-neutral-500">{product.badgeLine}</p>

          <div className="mt-6 text-2xl font-semibold text-[#b26a2a]">
            {formatMoney(product.price, product.currency)}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-neutral-700">
            {product.details?.intro}
          </p>

          {/* Color */}
          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-neutral-500">
              Color: {selectedColor?.name || "—"}
            </div>
            <div className="mt-3 flex gap-3">
              {(product.colors || []).map((c) => {
                const active = c.id === colorId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectVariantColor(c.id)}
                    className={`h-10 w-10 rounded-full border transition ${
                      active
                        ? "border-[#b26a2a] ring-2 ring-[#b26a2a]/40"
                        : "border-border"
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
          {(product.leathers?.length || 0) > 1 && (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-widest text-neutral-500">
                Leather: {selectedLeather?.name || "—"}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.leathers.map((l) => {
                  const active = l.id === leatherId;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => selectVariantLeather(l.id)}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        active
                          ? "border-neutral-900 bg-white"
                          : "border-neutral-300 bg-white/60 hover:bg-white"
                      }`}
                    >
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            className="mt-8 w-full rounded-md bg-[#8b4a1f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a401b]"
            onClick={orderNow}
          >
            Add to Cart —{" "}
            {formatMoney(product.price, product.currency || "USD")}
          </button>

          {features.personalization && (
            <button
              className="mt-3 text-sm uppercase tracking-widest text-[#b26a2a] hover:opacity-80"
              onClick={() => setModalOpen(true)}
            >
              + Add personalization
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {product.details?.features?.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900">
              {feature.title}
            </h2>
            <p className="mt-3 leading-relaxed text-neutral-700">
              {feature.text}
            </p>
          </div>
        ))}
      </div>

      {/* Specs */}
      <div className="mt-12 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Specifications
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-500">
              Material
            </div>
            <div className="mt-1 text-neutral-800">
              {product.details?.specs?.material}
            </div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-500">
              Stitching
            </div>
            <div className="mt-1 text-neutral-800">
              {product.details?.specs?.stitching}
            </div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-500">
              Dimensions
            </div>
            <div className="mt-1 text-neutral-800">
              {product.details?.specs?.dimensions}
            </div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-500">
              Capacity
            </div>
            <div className="mt-1 text-neutral-800">
              {product.details?.specs?.capacity}
            </div>
          </div>
        </div>

        <p className="mt-6 text-neutral-700">{product.details?.giftReady}</p>
      </div>

      {features.personalization && (
        <PersonalizationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={setPersonalization}
          product={product}
          initialValue={personalization}
        />
      )}

      {lightboxOpen && (
        <MediaLightbox
          items={mediaItems}
          initialIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          productName={product.name}
        />
      )}
    </section>
  );
}
