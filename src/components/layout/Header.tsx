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
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const fName =
    user?.firstName ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("firstName")
      : null);
  const isAuth = !!user || !!sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("firstName");
    setUser(null);
    router.replace("/customer/login");
  };

  const links = [
    { href: "/customer", label: "الصفحه الرئيسيه" },
    { href: "/customer/boys", label: "اطقم ولادي" },
    { href: "/customer/girls", label: "اطقم بناتي" },
  ];

  return (
    <header className="w-full bg-thirdary text-primary font-semibold shadow-md">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-2 md:justify-center relative md:bg-background">
        <Link href="/" className="flex items-center">
          <Image src="/Lilucky.svg" alt="logo" width={80} height={80} />
        </Link>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-primary absolute left-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav className="hidden md:flex justify-evenly items-center py-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}

        {fName ? <Link href="/customer/account">مرحباً، {fName}</Link> : null}

        {fName ? (
          <div className="">
            <button
              onClick={handleLogout}
              className="border rounded-md  border-primary py-1.5 px-3 ml-4 hover:bg-primary hover:text-background duration-300 ease-in"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <Link href="/customer/login">تسجيل الدخول</Link>
        )}

        <div className="flex items-center gap-4">
          <SearchInput />
          <Link href="/customer/wishlist">
            <FavoriteBorderIcon className="cursor-pointer hover:text-primary-hover" />
          </Link>
          <Link href="/customer/cart">
            <ShoppingCartOutlinedIcon className="cursor-pointer hover:text-primary-hover" />
          </Link>
          {/* {isAuth && ( */}
          <Link href="/customer/account">
            <Avatar fName={fName} />
            {/* <AccountCircleOutlinedIcon className=" cursor-pointer hover:text-primary-hover" /> */}
          </Link>
          {/* )} */}
        </div>
      </nav>
      {menuOpen && (
        <nav className="flex flex-col items-center gap-4 py-4 bg-thirdary border-t border-gray-300 md:hidden transition-all duration-300">
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
                className="border rounded-md  border-primary py-1.5 px-3 ml-4 hover:bg-primary hover:text-background duration-300 ease-in"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link href="/customer/login" onClick={() => setMenuOpen(false)}>
              تسجيل الدخول
            </Link>
          )}

          <div className="flex items-center gap-4">
            <SearchInput />
            <Link href="/customer/wishlist">
              <FavoriteBorderIcon className="cursor-pointer hover:text-primary-hover" />
            </Link>
            <Link href="/customer/cart">
              <ShoppingCartOutlinedIcon className="cursor-pointer hover:text-primary-hover" />
            </Link>
            {isAuth && (
              <Link href="/customer/account" title={`مرحباً، ${fName}`}>
                <Avatar fName={fName} />
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
