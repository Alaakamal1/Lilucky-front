"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import SearchInput from "../ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import Avatar from "../ui/Avatar";
import { useCartWishlist } from "@/src/context/CartWishlistContext";
import { useTranslations, useLocale } from "next-intl";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, setUser } = useUser();
  const { cart, wishlist } = useCartWishlist();

  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();

  const fName = user?.firstName ?? null;
  const isAuth = Boolean(user);

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);

  /* ================= LANGUAGE ================= */
  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const path = window.location.pathname.replace(/^\/(ar|en)/, "");
    router.push(`/${newLocale}${path}`);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("firstName");
    setUser(null);
    router.replace(`/${locale}/customer/login`);
  };

  /* ================= LINKS ================= */
  const links = [
    { href: `/${locale}/customer`, label: t("home") },
    { href: `/${locale}/customer/products`, label: t("products") },
  ];

  return (
    <header className="w-full bg-thirdary  text-primary font-semibold shadow-md relative z-50">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 py-2 md:justify-center relative md:bg-background">

        <Link href={`/${locale}/customer`}>
          <Image
            src="/Lilucky.svg"
            alt="logo"
            width={80}
            height={80}
            priority
            className="w-20 h-auto"
          />

        </Link>

        <button
          className="md:hidden absolute left-4"
          onClick={toggleMenu}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex justify-evenly items-center py-3">

        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}

        {fName ? (
          <button onClick={handleLogout}>{t("logout")}</button>
        ) : (
          <Link href={`/${locale}/customer/login`}>{t("login")}</Link>
        )}

        <div className="flex items-center gap-4 ">

          {/* <SearchInput /> */}

          <button onClick={toggleLanguage} className="flex items-center gap-1">
            <LanguageIcon />
            <span className="text-xs">
              {locale === "ar" ? "AR" : "EN"}
            </span>
          </button>

          <Link href={`/${locale}/customer/wishlist`} className="relative">
            <FavoriteBorderIcon />
            {wishlist?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </Link>

          <Link href={`/${locale}/customer/cart`} className="relative">
            <ShoppingCartOutlinedIcon />
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                {cart.length > 9 ? "9+" : cart.length}
              </span>
            )}
          </Link>

          {isAuth && (
            <Link href={`/${locale}/customer/account`}>
              <Avatar fName={fName ?? ""} />
            </Link>
          )}

        </div>
      </nav>

      {/* ================= MOBILE FLOATING MENU ================= */}
      {menuOpen && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeMenu}
          />

          {/* MENU */}
          <div className="fixed top-0 left-0 w-full z-50 bg-thirdary shadow-lg flex flex-col gap-4 px-4 py-6">

            {/* CLOSE BUTTON (X) */}
            <div className="flex justify-end">
              <button onClick={closeMenu}>
                <CloseIcon />
              </button>
            </div>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            {fName ? (
              <button onClick={() => { handleLogout(); closeMenu(); }}>
                {t("logout")}
              </button>
            ) : (
              <Link href={`/${locale}/customer/login`} onClick={closeMenu}>
                {t("login")}
              </Link>
            )}

            <div className="flex items-center gap-4">

              {/* <SearchInput /> */}

              <button onClick={toggleLanguage} className="flex items-center gap-1">
                <LanguageIcon />
                <span className="text-xs">
                  {locale === "ar" ? "AR" : "EN"}
                </span>
              </button>

              <Link href={`/${locale}/customer/wishlist`} onClick={closeMenu}>
                <FavoriteBorderIcon />
              </Link>

              <Link href={`/${locale}/customer/cart`} onClick={closeMenu}>
                <ShoppingCartOutlinedIcon />
              </Link>

              {isAuth && (
                <Link href={`/${locale}/customer/account`} onClick={closeMenu}>
                  <Avatar fName={fName ?? ""} />
                </Link>
              )}

            </div>
          </div>
        </>
      )}

    </header>
  );
}