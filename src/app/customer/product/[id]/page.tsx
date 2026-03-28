"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography } from "@mui/material";
interface Product {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  gender?: string;
  variants?: {
    images?: string[];
    color?: string;
    sizes?: string;
  }[];
  image?: string;
}

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);

  const image = product?.variants?.[0]?.images?.[0];
  const imageSrc = image
    ? image.startsWith("http")
      ? image
      : `http://localhost:5000/uploads/products/${image.replace(/^\/?/, "")}`
    : "/placeholder.png";

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const data = await res.json();
        setProduct(data.data);
        console.log("Fetched product data:", data);
      } catch (err) {
        console.log(err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <img
        src={imageSrc}
        className="w-80 h-80 object-cover"
      />
      <h1 className="text-2xl font-bold">{product?.name}</h1>
      <Typography  variant="h6" className="mt-4">{product?.description}</Typography>
      <Typography  variant="h6" className="mt-4">{product?.price} EGY</Typography>
      <Typography variant="h6" className="mt-4">Gender: {product?.gender}</Typography>
      {/* Add more product details as needed */}
      <Typography variant="h6" className="mt-4">
        Variants:
      </Typography>
      {product?.variants?.map((variant, index) => (
        <div key={index} className="border p-2 mt-2">
          <Typography>Color: {variant.color}</Typography>
          <Typography>Size: {variant.sizes}</Typography>
        </div>
      ))}

    </div>
  );
}