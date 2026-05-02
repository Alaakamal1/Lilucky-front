"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import { useLocale, useTranslations } from "next-intl";
import LanguageIcon from "@mui/icons-material/Language";

const AdminHeader = () => {
  const locale = useLocale();
  const t = useTranslations("adminHeader");

  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      sessionStorage.removeItem("user");
    }
  }, [setUser]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    router.replace(`/${locale}/customer/login`);
  };

  const handleChangeLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  const withLocale = (path: string) => `/${locale}${path}`;

  const links = [
    { href: withLocale("/admin"), label: t("dashboard") },
    { href: withLocale("/admin/availableProducts"), label: t("products") },
    { href: withLocale("/admin/availableCategory"), label: t("categories") },
    { href: withLocale("/admin/orders"), label: t("orders") },
    { href: withLocale("/admin/clients"), label: t("clients") },
    { href: withLocale("/admin/settings"), label: t("settings") }
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <header className="hidden md:flex w-2xs flex-col bg-thirdary text-primary font-semibold h-screen">

        <nav className="flex flex-col justify-evenly items-center py-2 h-full">

          <Link href="/">
            <Image src="/Lilucky.svg" alt="logo" width={100} height={100} />
          </Link>

          <button
            onClick={handleChangeLanguage}
            className="flex items-center gap-2 rounded-md border border-primary py-2 px-3"
          >
            <LanguageIcon />
            {locale === "ar" ? "ع" : "EN"}
          </button>

          {user?.firstName && (
            <div className="text-lg">
              {t("hello")} {user.firstName}
            </div>
          )}

          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg py-2 px-4 rounded-md ${
                  isActive ? "bg-primary text-background font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="rounded-md bg-primary py-2.5 px-4 text-background"
          >
            {t("logout")}
          </button>

        </nav>
      </header>

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden flex justify-between items-center p-3 bg-thirdary text-primary">

        <Image src="/Lilucky.svg" alt="logo" width={70} height={70} />

        <button onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </button>

      </div>

      {/* ================= MOBILE OVERLAY MENU ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">

          {/* SIDEBAR DRAWER */}
          <div className="absolute top-0 left-0 w-64 h-full bg-thirdary text-primary flex flex-col p-4 gap-4">

            {/* CLOSE ICON */}
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end"
            >
              <CloseIcon />
            </button>

            <button
              onClick={handleChangeLanguage}
              className="flex items-center gap-2 rounded-md border border-primary py-2 px-3"
            >
              <LanguageIcon />
              {locale === "ar" ? "EN" : "ع"}
            </button>

            {user?.firstName && (
              <div>
                {t("hello")} {user.firstName}
              </div>
            )}

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2"
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="border rounded-md border-primary py-2 px-3"
            >
              {t("logout")}
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default AdminHeader;