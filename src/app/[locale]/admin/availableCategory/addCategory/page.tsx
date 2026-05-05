"use client";

import { Suspense } from "react";
import PageContent from "./PageContent";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("editHero");
  return (
    <Suspense fallback={<div>{t("loading")} </div>}>
      <PageContent />
    </Suspense>
  );
}