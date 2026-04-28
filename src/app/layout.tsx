import type { ReactNode } from "react";
import { LanguageProvider } from "../context/LanguageContext";
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}