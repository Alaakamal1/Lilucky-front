"use client";
import { useEffect, useState } from "react";
import CardItem from "@/src/components/ui/CardItem";

const Page = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/wishlist")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWishlist(Array.isArray(data) ? data : []);
      });
  }, []);

  if (wishlist.length === 0) {
    return <p className="text-center mt-10">Your wishlist is empty ❤️</p>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {wishlist.map((product) => (
        <CardItem key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Page;