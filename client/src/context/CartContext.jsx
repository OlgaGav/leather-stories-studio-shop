import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
const STORAGE_KEY = "leather_cart_v1";

function itemKey(item) {
  const p = item.personalization || {};
  return [
    item.productId,
    item.colorId,
    item.leatherId || "",
    p.text || "",
    p.fontId || "",
  ].join("|");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(newItem) {
    setItems((prev) => {
      const key = itemKey(newItem);
      const idx = prev.findIndex((i) => i.key === key);

      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + (newItem.quantity || 1),
        };
        return copy;
      }

      return [
        ...prev,
        {
          ...newItem,
          key,
          id: crypto.randomUUID(),
          quantity: newItem.quantity || 1,
        },
      ];
    });
  }

  function updateQuantity(id, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const LAST_CLEARED_KEY = "leather_cart_last_cleared_session";

  function markSessionCleared(sessionId) {
    try {
      localStorage.setItem(LAST_CLEARED_KEY, sessionId);
    } catch {}
  }

  function wasSessionCleared(sessionId) {
    try {
      return localStorage.getItem(LAST_CLEARED_KEY) === sessionId;
    } catch {
      return false;
    }
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
