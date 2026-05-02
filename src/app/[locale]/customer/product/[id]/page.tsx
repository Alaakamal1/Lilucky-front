'use client';

import MainButton from "@/src/components/ui/MainButton";
import OptionSelector from "@/src/components/ui/OptionSelector";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Counter from "@/src/components/ui/Counter";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Product } from "@/src/interfaces/product";
import { useLocale, useTranslations } from "next-intl";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const locale = useLocale();
  const t = useTranslations("productDetails");

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("token")
      : null;

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.products}/${id}`);
        const data = res.data.data;

        setProduct(data);

        if (data.variants?.length) {
          setSelectedVariantIndex(0);
          setSelectedImageIndex(0);
          setSelectedSize(data.variants[0]?.sizes?.[0] || "");
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= VARIANT ================= */

  const currentVariant = product?.variants?.[selectedVariantIndex];
  const images = currentVariant?.images || [];

  const imageSrc =
    images[selectedImageIndex]
      ? images[selectedImageIndex].startsWith("http")
        ? images[selectedImageIndex]
        : `${Endpoints.prodUrl}/uploads/products/${images[selectedImageIndex]}`
      : "/placeholder.png";

  const availableColors =
    product?.variants?.map((v, i) => ({
      color: v.color,
      index: i,
    })) || [];

  /* ================= LIKE ================= */

  const handleLike = async () => {
    if (!product?._id) return;

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const res = await apiClient.patch(
        `${Endpoints.products}/like/${product._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsLiked(res.data.data.like);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ADD TO CART (BACKEND) ================= */

  const handleAddToCart = async () => {
    if (!product) return;

    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("token")
        : null;

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    if (!selectedSize) {
      toast.error(t("size_required"));
      return;
    }

    try {
      await apiClient.post(
        `${Endpoints.cart}/add-to-cart`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(t("toast_add_cart"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  /* ================= LOADING ================= */

  if (!product) {
    return (
      <div className="p-6 text-center">
        <Typography variant="h6">
          {t("product_not_found")}
        </Typography>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-6">

      {/* LOGIN POPUP */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center">

            <h2 className="text-lg font-semibold mb-4">تنبيه</h2>

            <p className="mb-4 text-gray-600">
              {t("login_required")}
            </p>

            <div className="flex gap-3 justify-center">

              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowLoginPopup(false)}
              >
                {t("cancel")}
              </button>

              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => router.push(`#/${locale}/customer/login`)}
              >
                {t("login")}
              </button>

            </div>

          </div>
        </div>
      )}

      <div className="flex gap-8">

        {/* IMAGES */}
        <div>

          <img
            src={imageSrc}
            className="w-90 h-90 object-cover rounded-lg border"
          />

          <div className="flex gap-2 mt-3 overflow-x-auto">

            {images.map((img, i) => {
              const src = img.startsWith("http")
                ? img
                : `${Endpoints.prodUrl}/uploads/products/${img}`;

              return (
                <img
                  key={i}
                  src={src}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2
                    ${selectedImageIndex === i ? "border-blue-500" : "border-gray-300"}
                  `}
                />
              );
            })}

          </div>
        </div>

        {/* INFO */}
        <div className="flex-1">

          <div className="flex gap-6 items-center">

            <Typography variant="h4">
              {product.name}
            </Typography>

            <div onClick={handleLike} className="cursor-pointer">
              {isLiked ? (
                <FavoriteIcon className="text-red-600" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>

          </div>

          <div className="flex gap-2">
            {/* <Typography className="mt-2">
            {t("price")}
          </Typography> */}
            <Typography className="mt-2" variant="h4" >
              {product.price}
            </Typography>
            <Typography className="mt-2">
              EGY
            </Typography>

          </div>

          <Typography className="mt-2">
            {t("description")}
          </Typography>

          <Typography className="mt-2">
            {product.description}
          </Typography>

          <Typography className="mt-2">
            {t("material")}
          </Typography>
          <Typography className="mt-2">
            {product.material}
          </Typography>

          {/* COLORS */}
          <div className="mt-2">
            <Typography className="mb-2">
              {t("colors")}
            </Typography>

            <div className="flex gap-2">

              {availableColors.map((item) => (
                <button
                  key={item.index}
                  onClick={() => {
                    setSelectedVariantIndex(item.index);
                    setSelectedImageIndex(0);
                  }}
                  className={`w-8 h-8 rounded-full border-2
                    ${selectedVariantIndex === item.index
                      ? "border-blue-500"
                      : "border-gray-300"}
                  `}
                  style={{ backgroundColor: item.color }}
                />
              ))}

            </div>

          </div>

          {/* SIZE */}
          <div className="mt-4">

            <Typography className="mb-2">
              {t("size")}
            </Typography>

            <OptionSelector
              options={currentVariant?.sizes || []}
              selected={selectedSize}
              onSelect={setSelectedSize}
              className="py-2 px-3 rounded-md"
            />

          </div>


          <div className="mt-4">
            <Typography className="mb-2">
              {t("quntity")}
            </Typography>
            <Counter
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
            />

          </div>

          {/* ADD TO CART */}
          <MainButton
            text={t("add_to_cart")}
            className="cursor-pointer bg-primary hover:bg-primary-hover duration-300 rounded-md w-40 md:w-80 p-3 my-2  text-white"
            onClick={handleAddToCart}
          />

        </div>
      </div>
    </div>
  );
}