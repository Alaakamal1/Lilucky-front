"use client";

import CardItem from "@/src/components/ui/CardItem";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id?: number;
  name?: string;
  price?: string | number;
  image?: string;
  category?: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/get-all");

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
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((item) => item.category === selectedCategory)
    : products;

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
          <CardItem key={product.id} product={product} />
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