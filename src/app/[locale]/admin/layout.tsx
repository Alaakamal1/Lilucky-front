import { Alexandria } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "../../globals.css";
import AdminHeader from "@/src/components/layout/AdminHeader";
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
      <section className={`${alexSans.variable} antialiased bg-background `}>
        <AppRouterCacheProvider>
          <div className="flex">
            <AdminHeader />
            {children}
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </AppRouterCacheProvider>

      </section >
  );
}
