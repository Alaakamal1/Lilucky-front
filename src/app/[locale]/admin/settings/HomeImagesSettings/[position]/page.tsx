"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { toast } from "react-toastify";
export default function EditHeroPage() {
  const { position } = useParams();
  const [hero, setHero] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  /* ===========================
     FETCH HERO
  =========================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(
          `${Endpoints.settings}/hero/${position}`
        );

        setHero(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [position]);

  /* ===========================
     HANDLERS
  =========================== */
  const handleChange = (field: string, lang: string, value: string) => {
    setHero((prev: any) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleColor = (section: string, key: string, value: string) => {
    setHero((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleImage = (file: File) => {
    setImageFile(file);
  };

  /* ===========================
     SAVE (FIXED)
  =========================== */

  const handleSave = async () => {
  const formData = new FormData();

  formData.append("position", hero.position);

  formData.append("title_ar", hero.title?.ar || "");
  formData.append("title_en", hero.title?.en || "");

  // ✅ subtitle مسموح يكون فاضي
  formData.append("subtitle_ar", hero.subtitle?.ar || "");
  formData.append("subtitle_en", hero.subtitle?.en || "");

  formData.append("titleColor", hero.textColors?.title || "#000000");
  formData.append("subtitleColor", hero.textColors?.subtitle || "#666666");
  formData.append("buttonTextColor", hero.textColors?.buttonText || "#ffffff");
  formData.append("buttonBgColor", hero.button?.bgColor || "#000000");

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const token = sessionStorage.getItem("token");

  try {
    await apiClient.patch(
      `${Endpoints.settings}/hero/update`,
      formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      
    );
    toast.success(t("editHero.savedSuccess"));
  } catch (error) {
    toast.error(t("editHero.saveError"));
  }
};

  if (loading) return <p>Loading...</p>;
  if (!hero) return <p>No hero found</p>;

  return (
    <div className="p-10 space-y-6 md:w-4xl bg-white m-8 rounded-md shadow-md">

      <h1 className="text-2xl font-bold">
        {t("editHero.title")} {position}
      </h1>

      {/* ================= TEXT ================= */}
      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4">

        <InputField
          label={t("editHero.titleAr")}
          value={hero.title?.ar || ""}
          onChange={(e) =>
            handleChange("title", "ar", e.target.value)
          }
        />

        <InputField
          label={t("editHero.titleEn")}
          value={hero.title?.en || ""}
          onChange={(e) =>
            handleChange("title", "en", e.target.value)
          }
        />

        <InputField
          label={t("editHero.subtitleAr")}
          value={hero.subtitle?.ar || ""}
          onChange={(e) =>
            handleChange("subtitle", "ar", e.target.value)
          }
        />

        <InputField
          label={t("editHero.subtitleEn")}
          value={hero.subtitle?.en || ""}
          onChange={(e) =>
            handleChange("subtitle", "en", e.target.value)
          }
        />
      </div>

      {/* ================= COLORS ================= */}
      <div className="grid md:grid-cols-4 grid-cols-2 gap-4">

        <div className="flex flex-col gap-2">
          <label>{t("editHero.titleColor")}</label>
          <input
            type="color"
            value={hero.textColors?.title || "#000000"}
            onChange={(e) =>
              handleColor("textColors", "title", e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>{t("editHero.subtitleColor")}</label>
          <input
            type="color"
            value={hero.textColors?.subtitle || "#666666"}
            onChange={(e) =>
              handleColor("textColors", "subtitle", e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>{t("editHero.buttonTextColor")}</label>
          <input
            type="color"
            value={hero.textColors?.buttonText || "#ffffff"}
            onChange={(e) =>
              handleColor("textColors", "buttonText", e.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>{t("editHero.buttonBgColor")}</label>
          <input
            type="color"
            value={hero.button?.bgColor || "#000000"}
            onChange={(e) =>
              handleColor("button", "bgColor", e.target.value)
            }
          />
        </div>
      </div>

      {/* ================= IMAGE ================= */}
      {hero.image && (
        <img
          src={hero.image}
          className="w-40 h-40 object-cover rounded-md"
        />
      )}

      <input
        type="file"
        onChange={(e) =>
          handleImage(e.target.files?.[0] as File)
        }
      />

      {/* ================= SAVE BUTTON ================= */}
      <MainButton
        type="button"
        text={t("editHero.save")}
        onClick={handleSave}
        className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-300 my-4 bg-primary cursor-pointer"
      />

    </div>
  );
}