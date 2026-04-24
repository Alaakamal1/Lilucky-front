"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/* ================= TYPE ================= */

export type Product = {
  id: string;
  name?: string;
  price?: number;
  image?: string;
};

/* ================= CONTEXT ================= */

type CartWishlistContextType = {
  cart: Product[];
  wishlist: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: string) => void;
};

const CartWishlistContext = createContext<CartWishlistContextType | null>(null);

/* ================= PROVIDER ================= */

export const CartWishlistProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  /* ================= LOAD ONCE ================= */

  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    const storedWishlist = sessionStorage.getItem("likedProducts");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(storedCart ? JSON.parse(storedCart) : []);
    setWishlist(storedWishlist ? JSON.parse(storedWishlist) : []);
  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("likedProducts", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ================= CART ================= */

  const addToCart = (item: Product) => {
    setCart((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= WISHLIST ================= */

  const addToWishlist = (item: Product) => {
    setWishlist((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

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
    throw new Error("useCartWishlist must be used within provider");
  }

  return context;
};