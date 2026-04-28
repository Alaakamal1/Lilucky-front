import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { UserProvider } from "@/src/context/UserContext";
const locales = ["ar", "en"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  const messages = (await import(`@/src/messages/${locale}.json`)).default;

  return (

       <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppRouterCacheProvider>
            <UserProvider>
          {children}
          </UserProvider>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}