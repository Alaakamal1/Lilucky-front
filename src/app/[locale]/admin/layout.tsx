import { Alexandria } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "../../globals.css";
import AdminHeader from "@/src/components/layout/AdminHeader";
import { ToastContainer } from "react-toastify";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <section className="bg-background antialiased">
  <AppRouterCacheProvider>

    <div className="md:flex min-h-screen">

      <AdminHeader />

      {/* 👇 ده المهم */}
      <main className="flex-1 w-full md:w-auto">
        {children}
      </main>

    </div>
    <ToastContainer position="top-right" autoClose={3000} />
  </AppRouterCacheProvider>
</section>
  );
}
