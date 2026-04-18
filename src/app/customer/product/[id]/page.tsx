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
import { Product, ProductVariant } from "@/src/interfaces/product";

type CartItem = {
  productId: string;
  size: string;
  color?: string;
  quantity: number;
};
export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.products}/${id}`);
        const data = res.data;
        setProduct(data.data);
        if (data.data.variants?.length) {
          setSelectedVariantIndex(0);
          setSelectedImageIndex(0);
          setSelectedSize(data.data.variants?.[0]?.sizes?.[0] ?? "");
        }

        if (!token) {
          const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
          setIsLiked(wishlist.includes(data.data._id));
        } else {
          setIsLiked(data.data.like || false);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleLike = async () => {
    if (!product?._id) return;
    if (!token) {
      let wishlist = JSON.parse(sessionStorage.getItem("likedProducts") || "[]");
      if (isLiked)
        wishlist = wishlist.filter((i: string) => i !== product._id);
      else wishlist.push(product._id);
      sessionStorage.setItem("likedProducts", JSON.stringify(wishlist));
      setIsLiked(!isLiked);
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
      const data = res.data;
      setIsLiked(data.data.like);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0);
    const variant = product?.variants?.[index];
    setSelectedSize(variant?.sizes?.[0] || "");
  };
  if (!product) {
  return (
    <div className="p-6 text-center">
      جاري التحميل...
    </div>
  );
}
  const currentVariant = product.variants?.[selectedVariantIndex];
  const images = currentVariant?.images || [];

  const imageSrc =
    images[selectedImageIndex]
      ? images[selectedImageIndex].startsWith("http")
        ? images[selectedImageIndex]
        : `http://localhost:5000/uploads/products/${images[selectedImageIndex]}`
      : "/placeholder.png";

  const availableColors =
    product.variants?.map((v, i) => ({
      color: v.color,
      index: i,
    })) || [];

  const handleAddToCart = () => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("token")
        : null;

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    if (!product) return;
    if (!selectedSize) {
      toast.error("من فضلك اختار المقاس");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: imageSrc,
      size: selectedSize,
      color: currentVariant?.color,
      quantity: quantity,
    };

    const existingCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item: CartItem) =>
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    sessionStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success("تم إضافة المنتج إلى السلة ");
  };

  return (
    <div className="p-6">

      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">

            <h2 className="text-lg font-semibold mb-4">تنبيه</h2>

            <p className="mb-4 text-gray-600">
              لازم تعمل تسجيل دخول الأول
            </p>

            <div className="flex gap-3 justify-center">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowLoginPopup(false)}
              >
                إلغاء
              </button>

              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => router.push("/customer/login")}
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8">

        {/* الصور */}
        <div>
          <img
            src={imageSrc}
            className="w-80 h-80 object-cover rounded-lg border"
          />

          <div className="flex gap-2 mt-3 overflow-x-auto">
            {images.map((img, i) => {
              const src = img.startsWith("http")
                ? img
                : `http://localhost:5000/uploads/products/${img}`;

              return (
                <img
                  key={i}
                  src={src}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2
                    ${selectedImageIndex === i
                      ? "border-blue-500"
                      : "border-gray-300"}
                  `}
                />
              );
            })}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-8 items-center">
            <Typography variant="h4">{product.name}</Typography>

            <div onClick={handleLike} className="cursor-pointer">
              {isLiked ? (
                <FavoriteIcon className="text-red-600" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
          </div>

          <Typography variant="h6" className="mt-2">
            {product.price} EGY
          </Typography>

          <Typography className="mt-2">
            {product.description}
          </Typography>

          {/* الألوان */}
          <div className="mt-4">
            <Typography className="mb-2">الالوان</Typography>

            <div className="flex gap-2">
              {availableColors.map((item) => (
                <button
                  key={item.index}
                  onClick={() => handleVariantChange(item.index)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${selectedVariantIndex === item.index
                      ? "border-blue-500 scale-110"
                      : "border-gray-300"}
                  `}
                  style={{ backgroundColor: item.color }}
                >
                  {selectedVariantIndex === item.index && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* المقاسات */}
          <div className="flex flex-col mt-4">
            <Typography className="mb-2">المقاس</Typography>

            {currentVariant?.sizes && (
              <OptionSelector
                className="p-3 my-2 rounded-lg"
                options={(currentVariant?.sizes ?? []) as string[]}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
            )}
          </div>

          <Counter
            value={quantity}
            onChange={setQuantity}
            max={product.stock}
          />

          <MainButton
            text="اضافه إلي السله"
            type="submit"
            className="w-full h-10 mt-2 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 px-6 bg-primary cursor-pointer"
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}