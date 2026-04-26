import { Alexandria } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import { UserProvider } from "../context/UserContext";
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
    <html lang="ar" dir="rtl">
      <body className={`${alexSans.variable} antialiased bg-background `}>
        <AppRouterCacheProvider>
        <UserProvider>{children}</UserProvider>
        </AppRouterCacheProvider>

      </body>
    </html>
  );
}
