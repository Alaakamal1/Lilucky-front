"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/src/context/UserContext";

interface User {
  firstName: string;
  lastName?: string;
  email?: string;
  role?: string;
}

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { user, setUser } = useUser();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) return;

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      console.error("Invalid user in sessionStorage", err);
      sessionStorage.removeItem("user");
    }
  }, [setUser]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    router.replace("/customer/login");
  };

  const links = [
    { href: "/admin", label: "لوحه التحكم" },
    { href: "/admin/availableProducts", label: "قسم المنتجات" },
    { href: "/admin/availableCategory", label: "قسم الفئات" },
    { href: "/admin/orders", label: "قسم الطلبات" },
    { href: "/admin/clients", label: "قسم العملاء" },
  ];

  return (
    <header className="w-2xs flex flex-col bg-thirdary text-primary font-semibold">
      <div>
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-primary absolute left-4"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* DESKTOP */}
      <nav className="hidden md:flex flex-col justify-evenly items-center py-2 h-dvh">
        <Link href="/" className="flex items-center">
          <Image src="/Lilucky.svg" alt="logo" width={100} height={100} />
        </Link>

        {user?.firstName && (
          <Link href="/admin/account" className="text-lg">
            مرحباً، {user.firstName}
          </Link>
        )}

        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg py-2 px-4 rounded-md duration-300 ease-in hover:bg-primary hover:text-background ${
                isActive ? "bg-primary text-background font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="rounded-md bg-primary py-2.5 px-4.5 hover:bg-primary-hover text-background"
        >
          تسجيل الخروج
        </button>
      </nav>

      {/* MOBILE */}
      {menuOpen && (
        <nav className="flex flex-col items-center gap-4 py-4 bg-thirdary md:hidden">
          {user?.firstName && (
            <Link href="/admin/account">مرحباً، {user.firstName}</Link>
          )}

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="border rounded-md border-primary py-1.5 px-3"
          >
            تسجيل الخروج
          </button>
        </nav>
      )}
    </header>
  );
};

export default AdminHeader;