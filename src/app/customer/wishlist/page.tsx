'use client';

import CardItem from "@/src/components/ui/CardItem";
import HeartBrokenRoundedIcon from "@mui/icons-material/HeartBrokenRounded";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Product } from "@/src/interfaces/product";

const Page = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const query = new URLSearchParams();
          const res = await apiClient.get(
            `${Endpoints.products}/get-all-products?${query.toString()}`
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
    }, []);

  const fetchWishlist = async () => {
    const token = sessionStorage.getItem("token");

    const wishlistLocal = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );
    let products: Product[] = [];
    if (token) {
      try {
        const res = await apiClient.get(
          `${Endpoints.products}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
            },
          }
        );
        const json = res.data;
        products = Array.isArray(json) ? json : [];
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        products = [];
      }
    } 
    else {
      try {
        const productPromises = wishlistLocal.map(async (id: string) => {
          try {
            const res = await apiClient.get(
              `${Endpoints.products}/${id}`
            );
            if (res.status !== 200) return null;
            const json = res.data;
            return json.data;
          } catch {
            return null;
          }
        });
        const results = await Promise.all(productPromises);
        products = results.filter(Boolean);
      } catch (err) {
        console.error(err);
        products = [];
      }
    }
    setWishlist(products);
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();

    const handleStorageChange = () => {
      fetchWishlist();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!wishlist.length) {
    return (
      <div className="my-20 flex flex-col items-center">
        <HeartBrokenRoundedIcon
          className="text-secondary-text"
          style={{ fontSize: 200 }}
        />
        <Typography className="text-center mt-4 text-secondary-text" variant="h6">
          Your wishlist is empty
        </Typography>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-wrap justify-center">
      {wishlist.map((product) => (
        <CardItem
          key={product._id}
          product={product}
        />
      ))}
    </div>

           <div className=" my-4">
        <Typography
          variant="h4"
          component="h4"
          className="text-primary-text text-center"
        >
         منتجات مقترحه ليك 
        </Typography>
<div className="grid grid-cols-3 md:grid-cols-3 gap-1 justify-items-center">
  {products.length > 0 ? (
    products.slice(0, 3).map((product) => (
      <CardItem key={product._id} product={product} />
    ))
  ) : null}
</div>
      </div>
    </>
  );
};

export default Page;