import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  colorLabel: string;
  size: string;
  qty: number;
  image: string;
  slug: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateQty: (id: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "og-clothing-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const key = (item: Pick<CartItem, "id" | "color" | "size">) =>
    `${item.id}-${item.color}-${item.size}`;

  function addToCart(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => key(i) === key(item));
      if (existing) {
        return prev.map((i) =>
          key(i) === key(item) ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
  }

  function removeFromCart(id: string, color: string, size: string) {
    setItems((prev) => prev.filter((i) => key(i) !== key({ id, color, size })));
  }

  function updateQty(id: string, color: string, size: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(id, color, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (key(i) === key({ id, color, size }) ? { ...i, qty } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
