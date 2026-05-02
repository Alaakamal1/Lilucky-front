import type { ReactNode } from "react";
import { LanguageProvider } from "../context/LanguageContext";

import { Almarai } from "next/font/google";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <body  className={`${almarai.className} MuiTypography-root`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}