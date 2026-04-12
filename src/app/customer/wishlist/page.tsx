'use client';

import { useEffect, useState } from "react";
import CardItem from "@/src/components/ui/CardItem";
import HeartBrokenRoundedIcon from "@mui/icons-material/HeartBrokenRounded";
import { Typography } from "@mui/material";

const Page = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const query = new URLSearchParams();
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
    }, []);

  const fetchWishlist = async () => {
    const token = sessionStorage.getItem("token");

    const wishlistLocal = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );

    let products: any[] = [];
    if (token) {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token.trim()}`,
            },
          }
        );
        const json = await res.json();
        products = Array.isArray(json.data) ? json.data : [];
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        products = [];
      }
    } 
    else {
      try {
        const productPromises = wishlistLocal.map(async (id: string) => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/products/${id}`
            );

            if (!res.ok) return null;
            const json = await res.json();
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