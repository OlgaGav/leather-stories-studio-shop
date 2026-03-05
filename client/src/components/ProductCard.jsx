import { useMemo, useState } from "react";
import PersonalizationModal from "./PersonalizationModal";
import { findVariant, formatMoney } from "../utils/productVariant";

export default function ProductCard({ product, onOrderNow }) {
  const [colorId, setColorId] = useState(product.colors?.[0]?.id || "");
  const [leatherId, setLeatherId] = useState(product.leathers?.[0]?.id || "");
  const [personalization, setPersonalization] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedColor = useMemo(
    () => (product.colors || []).find((c) => c.id === colorId),
    [product.colors, colorId],
  );

  const selectedLeather = useMemo(
    () => (product.leathers || []).find((l) => l.id === leatherId),
    [product.leathers, leatherId],
  );

  const variant = useMemo(
    () => findVariant(product, { colorId, leatherId }),
    [product, colorId, leatherId],
  );

  const mainImage = variant?.images?.[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      {/* Image */}
      <div className="bg-[#efe7dc]">
        <div className="aspect-[1/1] w-full">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-neutral-800">
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              {product.description}
            </p>
          </div>

          <div className="text-lg font-semibold text-[#b26a2a]">
            {formatMoney(product.price, product.currency)}
          </div>
        </div>

        {/* Color */}
        <div className="mt-6">
          <div className="text-s uppercase tracking-widest text-neutral-600">
            Color: {selectedColor?.name || "—"}
          </div>

          <div className="mt-3 flex gap-3">
            {(product.colors || []).map((c) => {
              const active = c.id === colorId;
              return (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  className={`h-9 w-9 rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent ${
                    active
                      ? "border-gold-accent ring-2 ring-gold-accent/60 shadow-[0_0_10px_rgba(212,175,55,0.6),0_0_20px_rgba(212,175,55,0.3)] scale-105"
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

        {/* Leather (only if product has leathers) */}
        {(product.leathers?.length || 0) > 0 && (
          <div className="mt-6">
            <div className="text-s uppercase tracking-widest text-neutral-600">
              Leather: {selectedLeather?.name || "—"}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.leathers.map((l) => {
                const active = l.id === leatherId;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLeatherId(l.id)}
                    className={`rounded-full border px-3 py-1 text-s transition ${
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
          </div>
        )}

        {/* Personalization */}
        {/* <div className="mt-6">
          <button
            className="text-s uppercase tracking-widest text-[#b26a2a] hover:opacity-80"
            onClick={() => setModalOpen(true)}
          >
            + Add personalization
          </button>

          {personalization?.text && (
            <div className="mt-2 text-sm text-neutral-700">
              <span className="font-medium">Personalization:</span> “
              {personalization.text}”{" "}
              <span className="text-neutral-500">
                (
                {product.fonts?.find((f) => f.id === personalization.fontId)
                  ?.name || personalization.fontId}
                )
              </span>
            </div>
          )}
        </div> */}

        {/* Order now */}
        <button
          className="mt-6 w-full rounded-md bg-[#8b4a1f] px-5 py-3 text-sm font-medium text-white hover:bg-[#7a401b]"
          onClick={() => {
            if (!colorId) {
              alert("Please select a color");
              return;
            }
            if (product.leathers?.length && !leatherId) {
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
              personalization, // {text,fontId} or null
              quantity: 1,
            });
          }}
        >
          Order Now — {formatMoney(product.price, product.currency || "USD")}
        </button>

        {/* Modal */}
        <PersonalizationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={setPersonalization}
          product={product}
          initialValue={personalization}
        />
      </div>
    </div>
  );
}
