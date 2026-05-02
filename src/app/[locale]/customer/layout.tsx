import { Alexandria } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Header from "../../../components/layout/Header";
import "../../globals.css";
import Footer from "../../../components/layout/Footer";
import { ToastContainer } from "react-toastify";
import { CartWishlistProvider } from "@/src/context/CartWishlistContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <section  className={` antialiased bg-background `}>
        <AppRouterCacheProvider>
          <CartWishlistProvider>
        <Header />{children}
        <ToastContainer />
        <Footer/>
          </CartWishlistProvider>
        </AppRouterCacheProvider>
      </section >
  );
}
