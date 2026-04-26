"use client";

import CardItem from "@/src/components/ui/CardItem";
import Filter from "@/src/components/ui/Filter";
import { Category } from "@/src/interfaces/Category";
import { Product } from "@/src/interfaces/product";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

// 👇 type للـ options بتاعة الفلتر
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

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();

        if (selectedGender !== "all") {
          query.append("gender", selectedGender);
        }

        if (selectedCategory !== "all") {
          query.append("category", selectedCategory);
        }

        console.log("QUERY:", query.toString());

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

    fetchProduct();
  }, [selectedGender, selectedCategory]);

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(
          `${Endpoints.category}/names?lang=ar`
        );

        const categoriesData: Category[] =
          res.data?.data?.categoryNames ?? [];

        const formatted: Option[] = [
          { label: "الكل", value: "all" },
          ...categoriesData.map((cat) => ({
            label: cat.name,
            value: cat._id,
          })),
        ];

        setCategories(formatted);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Gender Options
  const genderOptions: Option[] = [
    { value: "all", label: "الكل" },
    { value: "boys", label: "أولاد" },
    { value: "girls", label: "بنات" },
  ];

  // ✅ 🔥 فلترة فرونت (fallback)
  const filteredProducts = products.filter((product) => {
    const matchGender =
      selectedGender === "all" || product.gender === selectedGender;

    const matchCategory =
      selectedCategory === "all" ||
      product.category?._id === selectedCategory;

    return matchGender && matchCategory;
  });

  return (
    <div>
      <Typography variant="h4" className="text-secondary-text mb-4">
        {selectedCategory !== "all"
          ? "منتجات"
          : "أشيك لبس لأجمل عيال"}
      </Typography>

      <div className="bg-thirdary py-4 rounded-xl mb-4 ">
        <div className="flex gap-4 col px-5 md:w-200">
          {/* Gender */}
          <Filter
            label="النوع"
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
            label="القسم"
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

      {/* ✅ Products */}
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
            لا توجد منتجات في هذا القسم.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Page;