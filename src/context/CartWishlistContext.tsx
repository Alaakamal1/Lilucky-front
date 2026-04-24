"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ================= TYPES ================= */

export interface CartItem {
  id: string;
  [key: string]: unknown;
}

export interface WishlistItem {
  id: string;
  [key: string]: unknown;
}

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
}

/* ================= CONTEXT ================= */

const CartWishlistContext = createContext<
  CartWishlistContextType | undefined
>(undefined);

/* ================= PROVIDER ================= */

interface ProviderProps {
  children: ReactNode;
}

export const CartWishlistProvider = ({ children }: ProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  /* ================= LOAD FROM SESSION ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    /* ===== CART ===== */
    const rawCart = sessionStorage.getItem("cart");

    let storedCart: CartItem[] = [];

    try {
      const parsedCart = rawCart ? JSON.parse(rawCart) : [];
      storedCart = Array.isArray(parsedCart) ? parsedCart : [];
    } catch (err) {
      console.error("Cart parse error:", err);
      storedCart = [];
    }

    /* ===== WISHLIST ===== */
    const rawWishlist = sessionStorage.getItem("likedProducts");

    let storedWishlist: WishlistItem[] = [];

    try {
      const parsedWishlist = rawWishlist ? JSON.parse(rawWishlist) : [];
      storedWishlist = Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch (err) {
      console.error("Wishlist parse error:", err);
      storedWishlist = [];
    }
    setCart(storedCart);
    setWishlist(storedWishlist);
  }, []);

  /* ================= SYNC TO SESSION ================= */

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("likedProducts", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ================= CART FUNCTIONS ================= */

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= WISHLIST FUNCTIONS ================= */

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= PROVIDER ================= */

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);

  if (!context) {
    throw new Error(
      "useCartWishlist must be used within CartWishlistProvider"
    );
  }

  return context;
};