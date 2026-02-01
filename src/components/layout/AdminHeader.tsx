"use client";
import { useState} from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
    const pathname = usePathname();
    const fName = user?.firstName ||(typeof window !== "undefined") ? sessionStorage.getItem("firstName"):null;
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("firstName");
    setUser(null);
    router.replace("/customer/login");
  };

  const links = [
    { href: "/admin", label: "لوحه التحكم" },
    { href: "/admin/availableProducts", label: "قسم المنتجات" },
    { href: "/admin/orders", label: "قسم الطلبات" },
    { href: "/admin/clients", label: "قسم العملاء" },
  ];

  return (
    <header className="w-2xs flex flex-col bg-thirdary text-primary font-semibold ">
      <div className="">
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-primary absolute left-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav className="hidden md:flex flex-col justify-evenly items-center py-2 h-dvh ">
         <Link href="/" className="flex items-center">
          <Image src="/Lilucky.svg" alt="logo" width={80} height={80} />
        </Link>
        {fName ? (<Link href="#" className="text-lg">مرحباً، {fName}</Link>) : (
                    null)}
        {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg py-2 px-4 rounded-md duration-300 ease-in hover:bg-primary hover:text-background ${
              isActive ? "bg-primary text-background font-bold duration-100 ease-in" : ""
            }`}
          >
            {link.label}
          </Link>
        );
      })}
       
          <div className="">
            <button
              onClick={handleLogout}
              className=" rounded-md bg-primary py-2.5 px-4.5 hover:bg-primary-hover text-background hover:text-background duration-300 ease-in"
            >
              تسجيل الخروج
            </button>
          </div>
       

      </nav>
      {menuOpen && (
        <nav className="flex flex-col items-center gap-4 py-4 bg-thirdary border-t border-gray-300 md:hidden transition-all duration-300">
             {fName ? (<Link href="#">مرحباً، {fName}</Link>) : (
                    null)}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

         
            <>
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
        </nav>
      )}
    </header>
  );
}

export default AdminHeader