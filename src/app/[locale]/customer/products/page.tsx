"use client";

import CardItem from "@/src/components/ui/CardItem";
import Filter from "@/src/components/ui/Filter";
import { Category } from "@/src/interfaces/Category";
import { Product } from "@/src/interfaces/product";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Typography, Skeleton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

interface Option {
  label: string;
  value: string;
}

const Page = () => {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);

  const t = useTranslations("products");
  const locale = useLocale();

  /* ================= PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const query = new URLSearchParams();

        if (selectedGender !== "all") {
          query.append("gender", selectedGender);
        }

        if (selectedCategory !== "all") {
          query.append("category", selectedCategory);
        }

        const res = await apiClient.get(
          `${Endpoints.products}/get-all-products?${query.toString()}`
        );

        if (res?.status === 200) {
          setProducts(res.data?.data ?? []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedGender, selectedCategory]);

  /* ================= CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(
          `${Endpoints.category}/names?lang=${locale}`
        );

        const categoriesData: Category[] =
          res.data?.data?.categoryNames ?? [];

        setCategories([
          { label: t("all"), value: "all" },
          ...categoriesData.map((cat) => ({
            label: cat.name,
            value: cat._id,
          })),
        ]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [locale, t]);

  /* ================= OPTIONS ================= */
  const genderOptions: Option[] = useMemo(
    () => [
      { value: "all", label: t("all") },
      { value: "boys", label: t("boys") },
      { value: "girls", label: t("girls") },
    ],
    [t]
  );

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchGender =
        selectedGender === "all" || product.gender === selectedGender;

      const matchCategory =
        selectedCategory === "all" ||
        product.category?._id === selectedCategory;

      return matchGender && matchCategory;
    });
  }, [products, selectedGender, selectedCategory]);

  return (
    <div>
      {/* TITLE */}
      <Typography variant="h5" className="text-secondary-text mb-4">
        {selectedCategory !== "all"
          ? t("title_products")
          : t("title_all")}
      </Typography>

      {/* FILTERS */}
      <div className="bg-thirdary py-4 rounded-xl mb-4">
        <div className="flex gap-4 px-5 md:w-200">

          {/* Gender */}
          <Filter
            label={t("gender")}
            options={genderOptions}
            selected={selectedGender}
            onChange={(value: Option | string) => {
              const finalValue =
                typeof value === "string" ? value : value.value;

              setSelectedGender(finalValue);
            }}
          />

          {/* Category */}
          <Filter
            label={t("category")}
            options={categories}
            selected={selectedCategory}
            onChange={(value: Option | string) => {
              const finalValue =
                typeof value === "string" ? value : value.value;

              setSelectedCategory(finalValue);
            }}
          />

        </div>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 justify-items-center gap-3">

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={160}
              height={220}
              className="rounded-xl"
            />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardItem key={product._id} product={product} />
          ))
        ) : (
          <Typography variant="h6">
            {t("no_products")}
          </Typography>
        )}

      </div>
    </div>
  );
};

export default Page;