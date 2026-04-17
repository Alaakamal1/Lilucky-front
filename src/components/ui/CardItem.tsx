"use client";

import MainButton from "./MainButton";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id?: string;
  name?: string;
  price?: string | number;
  variants?: {
    images?: string[];
    color?: string;
    size?: string;
  }[];
  like?: boolean;
}

const CardItem = ({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const [open, setOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // ✅ Load like state from sessionStorage / backend
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedLikes = JSON.parse(sessionStorage.getItem("likedProducts") || "[]");

    if (!token) {
      setIsLiked(storedLikes.includes(product._id));
    } else {
      setIsLiked(product.like || false);
    }
  }, [product]);


const handleLike = async (productId?: string) => {
  if (!productId) return;

  const token = sessionStorage.getItem("token");

  const likedProducts = JSON.parse(sessionStorage.getItem("likedProducts") || "[]");
  const isCurrentlyLiked = likedProducts.includes(productId);

  // ✅ UI update فورًا
  setIsLiked(!isCurrentlyLiked);
  let updatedLikes;

  if (isCurrentlyLiked) {
    updatedLikes = likedProducts.filter((id: string) => id !== productId);
  } else {
    updatedLikes = [...likedProducts, productId];
  }

  sessionStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

  // 🔐 لو فيه token → ابعت للباك
  if (token) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/like/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`,
          },
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.log("Backend error:", data);
      }

    } catch (err) {
      console.error("Request failed:", err);
    }
  }
};

  // 🛒 Add to cart
  const handleAddToCartClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const token = sessionStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    setOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!selectedColor || !selectedSize) {
      alert("اختار اللون والمقاس");
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          color: selectedColor,
          size: selectedSize,
        }),
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const colors = [...new Set(product?.variants?.map((v) => v.color))];
  const sizes = [...new Set(product?.variants?.map((v) => v.size))];

  const image = product?.variants?.[0]?.images?.[0];
  const imageSrc = image?.startsWith("http")
    ? image
    : `http://localhost:5000/uploads/products/${image || ""}`;

  return (
    <>
      <Link href={`/customer/product/${product._id}`}>
        <div className="bg-background w-67 rounded-md shadow-lg text-center overflow-hidden m-8">

          <div className="relative">

            {/* ❤️ Like Button */}
            <div
              className="absolute top-2 right-2 cursor-pointer z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike(product._id);
              }}
            >
              {isLiked ? (
                <FavoriteIcon className="text-red-600 scale-110 transition" />
              ) : (
                <FavoriteBorderIcon className="hover:text-red-500 transition" />
              )}
            </div>

            <div className="w-full h-40 overflow-hidden">
              <img
                src={imageSrc}
                alt={product?.name || "product"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <Typography variant="h6">
              {product?.name || "منتج مؤقت"}
            </Typography>

            <Typography variant="body1">
              {product?.price || 0} EGY
            </Typography>

            <div className="flex gap-1">
              <MainButton
                text="عرض المنتج"
                className="w-full h-10 text-sm rounded-md text-primary border border-primary"
              />

              <MainButton
                text="أضف إلى السلة"
                onClick={handleAddToCartClick}
                className="w-full h-10 text-sm rounded-md text-white bg-primary"
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Dialog اختيار اللون والمقاس */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>اختار التفاصيل</DialogTitle>

        <DialogContent>
          <div className="mb-4">
            <p>اللون:</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {colors?.map((color: any) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 border rounded ${
                    selectedColor === color ? "bg-primary text-white" : ""
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p>المقاس:</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {sizes?.map((size: any) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === size ? "bg-primary text-white" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleConfirmAdd}>تأكيد</Button>
        </DialogActions>
      </Dialog>

      {/* Login Popup */}
      <Dialog open={showLoginPopup} onClose={() => setShowLoginPopup(false)}>
        <DialogTitle>تسجيل الدخول مطلوب</DialogTitle>

        <DialogContent>
          لازم تسجل دخول الأول
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowLoginPopup(false)}>إلغاء</Button>

          <Link href="/customer/login">
            <Button>تسجيل الدخول</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardItem;