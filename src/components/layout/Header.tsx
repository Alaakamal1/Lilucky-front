"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import Avatar from "../ui/Avatar";
import { useCartWishlist } from "@/src/context/CartWishlistContext";

/* ================= TYPES ================= */

type User = {
  firstName?: string;
};

/* ================= COMPONENT ================= */

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const { user, setUser } = useUser();
  const { cart, wishlist } = useCartWishlist(); 
  // 👈 مهم: بدون أي cast نهائيًا

  const router = useRouter();

  const fName = user?.firstName ?? null;
  const isAuth = Boolean(user);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("firstName");
    }

    setUser(null); // ✔ بدون any
    router.replace("/customer/login");
  };

  /* ================= LINKS ================= */

  const links: { href: string; label: string }[] = [
    { href: "/customer", label: "الصفحه الرئيسيه" },
    { href: "/customer/products", label: "منتجاتنا" },
  ];

  return (
    <header className="w-full bg-thirdary text-primary font-semibold shadow-md">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 py-2 md:justify-center relative md:bg-background">

        <Link href="/">
          <Image src="/Lilucky.svg" alt="logo" width={80} height={80} />
        </Link>

        <button
          className="md:hidden absolute left-4"
          onClick={() => setMenuOpen((p) => !p)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* DESKTOP */}
      <nav className="hidden md:flex justify-evenly items-center py-2">

        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}

        {fName ? (
          <button onClick={handleLogout}>تسجيل الخروج</button>
        ) : (
          <Link href="/customer/login">تسجيل الدخول</Link>
        )}

        <div className="flex items-center gap-4">

          <SearchInput />

          {/* Wishlist */}
          <Link href="/customer/wishlist" className="relative">
            <FavoriteBorderIcon />
            {wishlist?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/customer/cart" className="relative">
            <ShoppingCartOutlinedIcon />
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                {cart.length > 9 ? "9+" : cart.length}
              </span>
            )}
          </Link>

          {isAuth && (
            <Link href="/customer/account">
              <Avatar fName={fName ?? ""} />
            </Link>
          )}

        </div>
      </nav>

      {/* MOBILE */}
      {menuOpen && (
        <nav className="flex flex-col items-center gap-4 py-4 md:hidden">

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {fName ? (
            <>
              <span>مرحباً، {fName}</span>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link
              href="/customer/login"
              onClick={() => setMenuOpen(false)}
            >
              تسجيل الدخول
            </Link>
          )}

          <div className="flex gap-4">

            <Link href="/customer/wishlist" className="relative">
              <FavoriteBorderIcon />
              {wishlist?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/customer/cart" className="relative">
              <ShoppingCartOutlinedIcon />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {isAuth && (
              <Link href="/customer/account">
                <Avatar fName={fName ?? ""} />
              </Link>
            )}

          </div>
        </nav>
      )}
    </header>
  );
}