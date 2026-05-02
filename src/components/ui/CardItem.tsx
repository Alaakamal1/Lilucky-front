"use client";

import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import MainButton from "./MainButton";
import { useLocale } from "next-intl";

/* ================= TYPES ================= */

interface Variant {
  images?: string[];
  color?: string;
  sizes?: string[]; // ✅ مصفوفة
}

interface Product {
  _id: string;
  name?: string;
  price?: number;
  variants?: Variant[];
  like?: boolean;
}

/* ================= COMPONENT ================= */

const CardItem = ({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const locale = useLocale();
  /* ================= LIKE ================= */

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedLikes: string[] = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLiked(storedLikes.includes(product._id));
    } else {
      setIsLiked(product.like ?? false);
    }
  }, [product._id, product.like]);

  const handleLike = async (productId: string) => {
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
        console.error("Like error:", err);
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
    const token = sessionStorage.getItem("token");

    if (!product._id || !selectedColor || !selectedSize ) return;

    try {
      await apiClient.post(
        `${Endpoints.cart}/add-to-cart`,
        {
          productId: product._id,
          quantity: 1, // 🔥 لازم
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpen(false);
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  /* ================= VARIANTS SAFE ================= */

  const colors: string[] = Array.from(
    new Set(
      product?.variants
        ?.map((v) => v.color)
        .filter((v): v is string => Boolean(v))
    )
  );

  // ✅ FIX: flatten sizes
  const sizes: string[] = Array.from(
    new Set(
      product?.variants
        ?.flatMap((v) => v.sizes || [])
        .filter((v): v is string => Boolean(v))
    )
  );

  const image = product?.variants?.[0]?.images?.[0];

  const imageSrc = image
    ? image.startsWith("http")
      ? image
      : `${Endpoints.prodUrl}/uploads/products/${image}`
    : "/placeholder.png";

  /* ================= UI ================= */

  return (
    <>
      {/* CARD */}
      <Link href={`/${locale}/customer/product/${product._id}`}>
        <div className="bg-white w-67 rounded-lg shadow-md text-center overflow-hidden m-6">

          {/* IMAGE + LIKE */}
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
              alt={product.name || "product"}
              className="w-full h-40 object-cover"
            />
          </div>

          {/* INFO */}
          <div className="p-3">
            <Typography variant="h6">
              {product.name || "منتج"}
            </Typography>

            <Typography>
              {Number(product.price ?? 0)} EGY
            </Typography>

            <div className="flex gap-2 mt-2">
              <MainButton
                text="عرض المنتج"
                className="w-full border py-2 rounded-md border-primary text-primary"
              />

              <MainButton
                text="أضف للسلة"
                onClick={handleAddToCartClick}
                className="w-full bg-primary py-2 rounded-md text-white"
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

          <div className="relative bg-white w-[92%] max-w-md rounded-3xl p-6">

            <h2 className="text-xl font-bold mb-6 text-center">
              اختار التفاصيل
            </h2>

            {/* COLORS */}
            <div className="mb-6">
              <p className="mb-3 font-medium">اللون</p>

              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === color
                        ? "border-primary scale-110"
                        : "border-gray-300"
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* SIZES */}
            <div className="mb-6">
              <p className="mb-3 font-medium">المقاس</p>

              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border ${selectedSize === size
                        ? "bg-primary text-white"
                        : "bg-white"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                إلغاء
              </button>

              <button
                onClick={handleConfirmAdd}
                disabled={!selectedColor || !selectedSize}
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
              >
                تأكيد
              </button>

            </div>
          </div>
        </div>
      )}

      {/* LOGIN */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowLoginPopup(false)}
          />

          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md text-center">

            <h2 className="text-xl font-bold mb-3">
              تسجيل الدخول مطلوب
            </h2>

            <p className="mb-5 text-gray-600">
              لازم تسجل دخول عشان تضيف المنتج للسلة
            </p>

            <div className="flex gap-2 justify-center">

              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 border rounded-md"
              >
                إلغاء
              </button>

              <Link href="/customer/login">
                <button className="px-4 py-2 bg-primary text-white rounded-md">
                  تسجيل الدخول
                </button>
              </Link>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CardItem;