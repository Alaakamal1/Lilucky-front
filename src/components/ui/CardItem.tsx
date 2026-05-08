"use client";

import { useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Link from "next/link";

import Typography from "@mui/material/Typography";

import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";

import MainButton from "./MainButton";

import { useLocale, useTranslations } from "next-intl";

import { Product } from "@/src/interfaces/product";

/* ================= SAFE TYPE ================= */

interface TranslatedField {
  en?: string;
  ar?: string;
}

/* ================= COMPONENT ================= */

const CardItem = ({ product }: { product: Product }) => {

  /* ================= STATES ================= */

  const [isLiked, setIsLiked] = useState(() => {

    if (typeof window === "undefined") {
      return false;
    }

    const token = sessionStorage.getItem("token");

    const storedLikes: string[] = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );

    return token
      ? product.like ?? false
      : storedLikes.includes(product._id);
  });

  const [open, setOpen] = useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  /* ================= LOCALE ================= */

  const locale = useLocale() as "en" | "ar";

  const withLocale = (path: string) =>
    `/${locale}${path}`;

  const t = useTranslations("products");

  const tr = useTranslations();

  /* ================= SAFE TRANSLATION ================= */

  const getText = (
    value?: TranslatedField
  ) => {

    if (!value) return "";

    return locale === "ar"
      ? value.ar || value.en || ""
      : value.en || value.ar || "";
  };

  /* ================= LIKE ================= */

  const handleLike = async (
    productId: string
  ) => {

    const token =
      sessionStorage.getItem("token");

    const stored: string[] = JSON.parse(
      sessionStorage.getItem("likedProducts") || "[]"
    );

    const isLikedNow =
      stored.includes(productId);

    const updated = isLikedNow
      ? stored.filter(
          (id) => id !== productId
        )
      : [...stored, productId];

    sessionStorage.setItem(
      "likedProducts",
      JSON.stringify(updated)
    );

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

        console.error(
          "Like error:",
          err
        );
      }
    }
  };

  /* ================= VARIANTS ================= */

  const colors = Array.from(
    new Set(
      product?.variants
        ?.map((v) => v.color)
        .filter(Boolean)
    )
  );

  const sizes = Array.from(
    new Set(
      product?.variants
        ?.flatMap(
          (v) => v.sizes || []
        )
        .filter(Boolean)
    )
  );

  const image =
    product?.variants?.[0]?.images?.[0];

  const imageSrc = image
    ? image.startsWith("http")
      ? image
      : `${Endpoints.prodUrl}/uploads/products/${image}`
    : "/placeholder.png";

  /* ================= ADD TO CART ================= */

  const handleAddToCartClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {

    e.preventDefault();

    e.stopPropagation();

    const token =
      sessionStorage.getItem("token");

    if (!token) {

      setShowLoginPopup(true);

      return;
    }

    setOpen(true);
  };

  const handleConfirmAdd = async () => {

    const token =
      sessionStorage.getItem("token");

    if (
      !product._id ||
      !selectedColor ||
      !selectedSize
    ) {
      return;
    }

    try {

      await apiClient.post(
        `${Endpoints.cart}/add-to-cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpen(false);

    } catch (err) {

      console.error(
        "Cart error:",
        err
      );
    }
  };

  /* ================= UI ================= */

  return (
    <>

      {/* ================= CARD ================= */}

      <Link
        href={withLocale(
          `/customer/product/${product._id}`
        )}
      >

        <div className="bg-white w-67 rounded-lg shadow-md text-center overflow-hidden m-6">

          {/* ================= IMAGE ================= */}

          <div className="relative">

            {/* LIKE */}

            <div
              className="absolute top-2 right-2 z-10 cursor-pointer"
              onClick={(e) => {

                e.preventDefault();

                e.stopPropagation();

                handleLike(product._id);
              }}
            >

              {isLiked
                ? <FavoriteIcon />
                : <FavoriteBorderIcon />
              }

            </div>

            {/* IMAGE */}

            <img
              src={imageSrc}
              alt={
                getText(product.name) ||
                "product"
              }
              className="w-full h-40 object-cover"
            />

          </div>

          {/* ================= INFO ================= */}

          <div className="p-3">

            <Typography variant="h6">

              {getText(product.name) ||
                t("adminProducts.name")}

            </Typography>

            <Typography>

              {product.price}{" "}
              {t("customerProducts.pound")}

            </Typography>

            <div className="flex gap-2 mt-2">

              <MainButton
                text={t(
                  "customerProducts.view_product"
                )}
                className="w-full border py-2 rounded-md border-primary text-primary"
              />

              <MainButton
                text={t(
                  "customerProducts.add_to_cart"
                )}
                onClick={handleAddToCartClick}
                className="w-full bg-primary py-2 rounded-md text-white"
              />

            </div>

          </div>

        </div>

      </Link>

      {/* ================= SELECT DETAILS POPUP ================= */}

      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          <div className="relative bg-white w-[92%] max-w-md rounded-3xl p-6">

            <h2 className="text-xl font-bold mb-6 text-center">

              {t(
                "customerProducts.select_details"
              )}

            </h2>

            {/* COLORS */}

            <div className="mb-6">

              <p className="mb-3 font-medium">

                {t("customerProducts.color")}

              </p>

              <div className="flex gap-3 flex-wrap">

                {colors.map((color) => (

                  <button
                    key={color}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-primary scale-110"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: color,
                    }}
                  />

                ))}

              </div>

            </div>

            {/* SIZES */}

            <div className="mb-6">

              <p className="mb-3 font-medium">

                {t("customerProducts.size")}

              </p>

              <div className="flex gap-2 flex-wrap">

                {sizes.map((size) => (

                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`px-4 py-2 rounded-full border ${
                      selectedSize === size
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
                onClick={() =>
                  setOpen(false)
                }
                className="px-4 py-2 border rounded-md"
              >

                {tr("common.cancel")}

              </button>

              <button
                onClick={handleConfirmAdd}
                disabled={
                  !selectedColor ||
                  !selectedSize
                }
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
              >

                {tr("common.confirm")}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= LOGIN POPUP ================= */}

      {showLoginPopup && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div
            className="absolute inset-0"
            onClick={() =>
              setShowLoginPopup(false)
            }
          />

          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md text-center">

            <h2 className="text-xl font-bold mb-3">

              {t(
                "customerProducts.login_required_title"
              )}

            </h2>

            <p className="mb-5 text-gray-600">

              {tr(
                "registration.login.login_message"
              )}

            </p>

            <div className="flex gap-2 justify-center">

              <button
                onClick={() =>
                  setShowLoginPopup(false)
                }
                className="px-4 py-2 border rounded-md"
              >

                {tr("common.cancel")}

              </button>

              <Link
                href={withLocale(
                  "/customer/login"
                )}
              >

                <button className="px-4 py-2 bg-primary text-white rounded-md">

                  {tr(
                    "common.login_button"
                  )}

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