"use client";

import { useEffect, useState } from "react";
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

import Link from "next/link";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import MainButton from "./MainButton";

/* ================= TYPES ================= */
interface Variant {
  images?: string[];
  color?: string;
  size?: string;
}

interface Product {
  _id?: string;
  name?: string;
  price?: string | number;
  variants?: Variant[];
  like?: boolean;
}

const CardItem = ({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const [open, setOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  /* ================= LIKE ================= */
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedLikes: string[] = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );

    if (!token) {
      setIsLiked(product._id ? storedLikes.includes(product._id) : false);
    } else {
      setIsLiked(product.like ?? false);
    }
  }, [product]);

  const handleLike = async (productId?: string) => {
    if (!productId) return;

    const token = sessionStorage.getItem("token");

    const stored: string[] = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );

    const isLikedNow = stored.includes(productId);

    const updated = isLikedNow
      ? stored.filter((id) => id !== productId)
      : [...stored, productId];

    sessionStorage.setItem("likedProducts", JSON.stringify(updated));
    setIsLiked(!isLikedNow);

    if (token) {
      try {
        await apiClient.patch(
          `${Endpoints.products}/like/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* ================= CART ================= */
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    if (!selectedColor || !selectedSize) return;
    const token = sessionStorage.getItem("token");
    try {
      await apiClient.post(
        `${Endpoints.cart}/add-to-cart`,
        {
          productId: product._id,
          color: selectedColor,
          size: selectedSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SAFE VARIANTS ================= */
  const colors = Array.from(
    new Set(product?.variants?.map((v) => v.color).filter(Boolean))
  ) as string[];

  const sizes = Array.from(
    new Set(product?.variants?.map((v) => v.sizes).filter(Boolean))
  ) as string[];

  const image = product?.variants?.[0]?.images?.[0];

  const imageSrc = image?.startsWith("http")
    ? image
    : `http://localhost:5000/uploads/products/${image || ""}`;

  return (
    <>
      {/* ================= CARD ================= */}
      <Link href={`/customer/product/${product._id}`}>
        <div className="bg-white w-67 rounded-lg shadow-md text-center overflow-hidden m-6">
          <div className="relative">
            <div
              className="absolute top-2 right-2 z-10 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike(product._id);
              }}
            >
              {isLiked ? (
                <FavoriteIcon className="text-red-600" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>

            <img
              src={imageSrc}
              alt={product?.name || "product"}
              className="w-full h-40 object-cover"
            />
          </div>
          <div className="p-3">
            <Typography variant="h6">
              {product?.name || "منتج"}
            </Typography>
            <Typography>
              {product?.price || 0} EGY
            </Typography>
            <div className="flex gap-2 mt-2">

              <MainButton
                text="عرض المنتج"
                className="w-full cursor-pointer border py-2 rounded-md border-primary text-primary"
              />
              <MainButton
                text="أضف للسلة"
                onClick={handleAddToCartClick}
                className="w-full bg-primary py-2 rounded-md text-white cursor-pointer"
              />

            </div>
          </div>
        </div>
      </Link>

      {/* ================= POPUP ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white w-[92%] max-w-md rounded-3xl shadow-2xl p-6">

            <h2 className="text-xl font-bold mb-6 text-center">
              اختار التفاصيل
            </h2>
            {/* COLORS */}
            <div className="mb-6">
              <p className="mb-3 font-medium">اللون</p>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      relative w-10 h-10 rounded-full border-2 transition
                      ${
                        selectedColor === color
                          ? "border-primary scale-110"
                          : "border-gray-300"
                      }
                    `}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* SIZES */}
            <div className="mb-6">
              <p className="mb-3 font-medium">المقاس</p>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-4 py-2 rounded-full border text-sm font-medium transition
                      ${
                        selectedSize === size
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 justify-end">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmAdd}
                disabled={!selectedColor || !selectedSize}
                className={`
                  px-5 py-2 rounded-md text-white transition
                  ${
                    selectedColor && selectedSize
                      ? "bg-primary hover:opacity-90"
                      : "bg-gray-300 cursor-not-allowed"
                  }
                `}
              >
                تأكيد
              </button>

            </div>
          </div>
        </div>
      )}

      {/* LOGIN */}
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