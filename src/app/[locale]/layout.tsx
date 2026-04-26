import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/src/context/LanguageContext";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const locales = ["ar", "en"];

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageProvider>
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          {children}
        </div>
      </LanguageProvider>
    </NextIntlClientProvider>
  );
}