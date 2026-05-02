"use client";

import CardItem from "@/src/components/ui/CardItem";
import Filter from "@/src/components/ui/Filter";
import { Category } from "@/src/interfaces/Category";
import { Product } from "@/src/interfaces/product";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Typography, Skeleton, Button } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

interface Option {
  label: string;
  value: string;
}

type AgeOption =
  | "all"
  | "1Y"
  | "2Y"
  | "3Y"
  | "4Y"
  | "5Y"
  | "6Y"
  | "7Y"
  | "8Y";

const Page = () => {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<AgeOption>("all");

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);

  const t = useTranslations("products");
  const locale = useLocale();
  const searchParams = useSearchParams();

  /* ================= INIT FROM URL ================= */
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const genderFromUrl = searchParams.get("gender");
    const ageFromUrl = searchParams.get("age");

    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (genderFromUrl) setSelectedGender(genderFromUrl);
    if (ageFromUrl) setSelectedAge(ageFromUrl as AgeOption);
  }, [searchParams]);

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

        setProducts(res.data?.data ?? []);
      } catch (err) {
        console.error(err);
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
        console.error(err);
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

      const matchAge =
        selectedAge === "all" ||
        product.variants?.some((variant) =>
          variant.sizes?.includes(selectedAge)
        );

      return matchGender && matchCategory && matchAge;
    });
  }, [products, selectedGender, selectedCategory, selectedAge]);

  return (
    <div>

      {/* FILTERS */}
      <div className="bg-thirdary py-3 rounded-xl my-6">
        <div className="flex gap-4 px-5 md:w-200">

          <Filter
            label={t("gender")}
            options={genderOptions}
            selected={selectedGender}
            onChange={(value: any) =>
              setSelectedGender(value.value || value)
            }
          />

          <Filter
            label={t("category")}
            options={categories}
            selected={selectedCategory}
            onChange={(value: any) =>
              setSelectedCategory(value.value || value)
            }
          />

        </div>
      </div>

      <Typography variant="h5" className="text-secondary-text p-2">
        {t("title_all")}
      </Typography>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-center">
              <Skeleton
                variant="rectangular"
                width={160}
                height={220}
                sx={{ borderRadius: 2 }}
              />
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardItem key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">

            <SentimentDissatisfiedIcon sx={{ fontSize: 60 }} />

            <Typography variant="h6" className="mt-3">
              {t("no_products_match")}
            </Typography>

            <Button
              variant="outlined"
              onClick={() => {
                setSelectedGender("all");
                setSelectedCategory("all");
                setSelectedAge("all");
              }}
              sx={{ mt: 2 }}
            >
              {t("reset_filters")}
            </Button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Page;