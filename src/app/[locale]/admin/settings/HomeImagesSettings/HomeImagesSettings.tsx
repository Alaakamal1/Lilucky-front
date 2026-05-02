"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";

export default function HomeImagesSettings() {
  const [heroes, setHeroes] = useState<any[]>([]);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const positions = [1, 2, 3];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.settings}/settings`);
        const data = res.data;
        const heroSections = data?.data?.filter(
          (s: any) => s.type === "hero"
        );

        const normalized = positions.map((pos) => {
          const existing = heroSections.find(
            (h: any) => h.position === pos
          );

          return (
            existing || {
              type: "hero",
              position: pos,
              title: { ar: "", en: "" },
              subtitle: { ar: "", en: "" },
              image: "",
            }
          );
        });

        setHeroes(normalized);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">{t("heroSettings.title")}</h1>

      <table className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-thirdary text-md text-secondary-text">
            <th className="p-3 text-center border-b border-gray-200">{t("heroSettings.position")}</th>
            <th className="p-3 text-center border-b border-gray-200">{t("heroSettings.titleCol")}</th>
            <th className="p-3 text-center border-b border-gray-200">{t("heroSettings.image")}</th>
            <th className="p-3 text-center border-b border-gray-200">{t("heroSettings.action")}</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map((hero) => (
            <tr key={hero.position} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="py-2 text-center text-secondary-text">
                {hero.position}
              </td>

              {/* TITLE (SHOW ONLY) */}
              <td className="text-center py-2">
                <div className="text-sm">
                  <p><b>{t("heroSettings.ar")}</b> {hero.title?.ar}</p>
                  <p><b>{t("heroSettings.en")}</b> {hero.title?.en}</p>
                </div>
              </td>

              <td className="text-center  py-2">
                {hero.image ? (
                  <img
                    src={hero.image}
                    className="w-20 h-20 object-cover mx-auto"
                  />
                ) : (
                  <span>{t("heroSettings.noImage")}</span>
                )}
              </td>

              {/* ACTION */}
              <td className="text-center py-4">
                <button
                  onClick={() =>
                    router.push(`/${locale}/admin/settings/HomeImagesSettings/${hero.position}`)
                  }
                  className="bg-primary text-white px-6 py-1 rounded hover:opacity-90 transition"
                >
                  {t("heroSettings.edit")}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}