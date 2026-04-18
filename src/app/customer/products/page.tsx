"use client";

import CardItem from "@/src/components/ui/CardItem";
import Filter from "@/src/components/ui/Filter";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
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

        const res = await apiClient.get(
          `${Endpoints.products}/get-all?${query.toString()}`
        );
        if (res.status !== 200) throw new Error("Failed to fetch product data");
        const data = res.data;
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
        const res = await apiClient.get(
          `${Endpoints.category}/names?lang=ar&gender=${selectedGender || "all"}`
        );
        const data =  res.data;
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
      <Typography variant="h4" component="h4" className="text-secondary-text mb-4">
        {selectedCategory
          ? `منتجات ${selectedCategory}`
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