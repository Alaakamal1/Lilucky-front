"use client";

import MainButton from "../../../components/ui/MainButton";
import OptionSelector from "../../../components/ui/OptionSelector";
import CardItem from "@/src/components/ui/CardItem";
import { Typography } from "@mui/material";
import { Link } from "@/src/i18n/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Product } from "@/src/interfaces/product";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function Page() {
  const [size, setSize] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("home");

  /* ================= FETCH SETTINGS ================= */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.settings}/settings`);
        const data = res.data;
        setSettings(data?.data || []);
      } catch (err) {
        console.log("settings error:", err);
      }
    };

    fetchSettings();
  }, []);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`${Endpoints.products}/get-all-products`);

        if (res.status !== 200) throw new Error("Failed to fetch product data");

        setProducts(res.data.data);
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  /* ================= HEROES ================= */
  const heroes = (settings || [])
    .filter((s: any) => s.type === "hero")
    .sort((a: any, b: any) => a.position - b.position);

  const hero1 = heroes?.[0];
  const hero2 = heroes?.[1];
  const hero3 = heroes?.[2];

  /* ================= LANGUAGE HELPER ================= */
  const getText = (field: any) => {
    if (!field) return "";
    return field?.[locale] || "";
  };

  return (
    <>
      {/* ================= HERO 1 ================= */}
      <div
        className="h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${hero1?.image || "/Home 1.jpg"})`,
        }}
      >
        <div className="flex flex-col min-w-10/12 items-end">

          <Typography variant="h5"
            style={{ color: hero1?.textColors?.title || "#fff" }}
          >
            {getText(hero1?.title)}
          </Typography>

          <Typography variant="h5"
            style={{ color: hero1?.textColors?.subtitle || "#fff" }}
          >
            {getText(hero1?.subtitle)}
          </Typography>

          <Link href={`/customer/products`}>
            <MainButton
              text={t("shopNow")}
              className="cursor-pointer bg-background hover:bg-background-hover duration-300 rounded-md w-40 p-3 m-6 text-2xl text-secondary-text"
            />
          </Link>
        </div>
      </div>

      {/* ================= BEST SELLERS ================= */}
      <div className="my-4">
        <Typography
          sx={{
            fontSize: "1.6rem",
            fontWeight: 600,
          }}
          className="text-primary-text text-center"
        >
          {t("bestSelling")}
        </Typography>

        <div className="grid grid-cols-3 gap-2 justify-items-center">
          {products.slice(0, 3).map((product) => (
            <CardItem key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* ================= HERO 2 ================= */}
      <div
        className="min-h-140 bg-cover bg-center flex justify-center flex-col"
        style={{
          backgroundImage: `url(${hero2?.image || "/Home 2.jpg"})`,
        }}
      >
        <div className="mx-8">
          <Typography variant="h4">
            {getText(hero2?.title) || t("hero2Title")}
          </Typography>
        </div>

        <Link href={`/customer/products`}>
          <MainButton
            text={t("shopNow")}
            className="cursor-pointer bg-background hover:bg-background-hover duration-300 rounded-md w-40 p-3 m-10 text-2xl text-secondary-text"
          />
        </Link>
      </div>

      {/* ================= AGE FILTER ================= */}
      <div className="my-4">
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
          className="text-primary-text text-center"
        >
          {t("ageCategory")}
        </Typography>

        <div className="flex justify-center gap-6 flex-col md:flex-row my-16">

          <OptionSelector
            label=""
            options={[
              t("age1"),
              t("age2"),
              t("age3"),
              t("age4"),
              t("age5"),
              t("age6"),
              t("age7"),
              t("age8"),
            ]}
            selected={size}
            onSelect={(value: string) => {
              const ageMap: Record<string, string> = {
                [t("age1")]: "1Y",
                [t("age2")]: "2Y",
                [t("age3")]: "3Y",
                [t("age4")]: "4Y",
                [t("age5")]: "5Y",
                [t("age6")]: "6Y",
                [t("age7")]: "7Y",
                [t("age8")]: "8Y",
              };

              const mappedAge = ageMap[value];

              window.location.href = `/${locale}/customer/products?age=${mappedAge}`;
            }}
            className="p-6 border bg-primary-text text-white rounded-md cursor-pointer"
          />

        </div>
      </div>

      {/* ================= HERO 3 ================= */}
      <div
        className="min-h-140 bg-cover bg-center flex justify-center items-end flex-col px-12"
        style={{
          backgroundImage: `url(${hero3?.image || "/Home 3.jpg"})`,
        }}
      >
        <div className="w-full">

          <Typography variant="h4">
            {getText(hero3?.title) || t("offersTitle")}
          </Typography>

          <Link href={`/customer/products`}>
            <MainButton
              text={t("shopNow")}
              className="cursor-pointer bg-background hover:bg-background-hover duration-300 rounded-md w-40 p-3 m-10 text-2xl text-secondary-text"
            />
          </Link>

        </div>
      </div>
    </>
  );
}