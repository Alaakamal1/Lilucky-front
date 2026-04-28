"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("aboutus");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* TITLE */}
      <Typography variant="h3" className="text-primary font-bold text-center">
        {t("title")}
      </Typography>

      {/* INTRO */}
      <div className="text-center text-gray-600 leading-relaxed">
        <p>{t("intro_1")}</p>
        <p className="mt-2">{t("intro_2")}</p>
      </div>

      {/* SECTION 1 */}
      <div>
        <Typography variant="h5" className="mb-2 font-semibold text-primary">
          {t("vision_title")}
        </Typography>
        <p className="text-gray-600 leading-relaxed">
          {t("vision_desc")}
        </p>
      </div>

      {/* SECTION 2 */}
      <div>
        <Typography variant="h5" className="mb-2 font-semibold text-primary">
          {t("mission_title")}
        </Typography>
        <p className="text-gray-600 leading-relaxed">
          {t("mission_desc")}
        </p>
      </div>

      {/* SECTION 3 */}
      <div>
        <Typography variant="h5" className="mb-2 font-semibold text-primary">
          {t("why_title")}
        </Typography>

        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>{t("why_1")}</li>
          <li>{t("why_2")}</li>
          <li>{t("why_3")}</li>
          <li>{t("why_4")}</li>
        </ul>
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 pt-6 border-t">
        <p>© {new Date().getFullYear()} {t("rights")}</p>
      </div>

    </div>
  );
}