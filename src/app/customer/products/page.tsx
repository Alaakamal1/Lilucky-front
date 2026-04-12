"use client";

import CardItem from "@/src/components/ui/CardItem";
import Filter from "@/src/components/ui/Filter";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  _id?: string;
  name?: string;
  price?: string | number;
  image?: string;
  category?: any;
  gender?: string;
}

interface Category {
  _id: string;
  name: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const selectedGender = searchParams.get("gender");
  const selectedCategory = searchParams.get("category");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();

        if (selectedGender && selectedGender !== "all") {
          query.append("gender", selectedGender);
        }

        if (selectedCategory && selectedCategory !== "all") {
          query.append("category", selectedCategory);
        }

        const res = await fetch(
          `http://localhost:5000/api/products/get-all?${query.toString()}`
        );

        if (!res.ok) throw new Error("Failed to fetch product data");

        const data = await res.json();
        setProducts(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching products:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [selectedGender, selectedCategory]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/category/names?lang=ar&gender=${selectedGender || "all"}`
        );

        const data = await res.json();
        setCategories(data.data.categoryNames);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [selectedGender]);
  const categoryOptions = [
    { value: "all", label: "الكل" },
    ...categories.map((cat) => ({
      value: cat._id,
      label: cat.name
    }))
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {/* Gender Filter */}
        <Filter
          label={"النوع"}
          options={[
            { value: "all", label: "الكل" },
            { value: "boys", label: "الأولاد" },
            { value: "girls", label: "البنات" }
          ]}
          selected={selectedGender}
          onChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            if (value === "all") {
              newSearchParams.delete("gender");
            } else {
              newSearchParams.set("gender", value);
            }
            newSearchParams.delete("category");

            window.history.pushState({}, "", `?${newSearchParams.toString()}`);
          }}
        />

        {/* Category Filter */}
        <Filter
          label={"الفئة"}
          options={categoryOptions}
          selected={selectedCategory}
          onChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            if (value === "all") {
              newSearchParams.delete("category");
            } else {
              newSearchParams.set("category", value);
            }

            window.history.pushState({}, "", `?${newSearchParams.toString()}`);
          }}
        />
      </div>
      <Typography variant="h4" className="text-secondary-text mb-4">
        {selectedGender
          ? `منتجات ${
              selectedGender === "boys" ? "الأولاد" : "البنات"
            }`
          : "أشيك لبس لأجمل عيال"}
      </Typography>
      <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center ">
        {products.length > 0 ? (
          products.map((product) => (
            <CardItem key={product._id} product={product}  />
          ))
        ) : (
          <Typography variant="h6" component="p">
            لا توجد منتجات في هذا القسم.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Page;