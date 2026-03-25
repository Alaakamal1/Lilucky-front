import { Alexandria } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Header from "../../components/layout/Header";
import "../globals.css";
import Footer from "../../components/layout/Footer";
import { ToastContainer } from "react-toastify";
const alexSans = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <section  className={`${alexSans.variable} antialiased bg-background `}>
        <AppRouterCacheProvider>
        <Header />{children}
        <Footer/>
        </AppRouterCacheProvider>
      </section >
  );
}
