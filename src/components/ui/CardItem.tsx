"use client";
import MainButton from "./MainButton";
import { Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import Link from "next/link";
interface Product {
  _id?: string;
  name?: string;
  price?: string | number;
  image?: string;
  category?: string;
  isLiked?: boolean;
  variants?: {
    images?: string[];
  }[];
}

const CardItem = ({ product }: { product: Product }) => {
const [isLiked, setIsLiked] = useState(product?.like || false);

const handleLike = async () => {
  const newValue = !isLiked;
  setIsLiked(newValue); 

  try {
    const res = await fetch(
      `http://localhost:5000/api/products/like/${product._id}`,
      { method: "PATCH" }
    );

    const data = await res.json();
    setIsLiked(data.isLiked); // تأكيد من الباك
  } catch (err) {
    console.error(err);
    setIsLiked(!newValue); // rollback لو حصل error
  }
};

  const image = product?.variants?.[0]?.images?.[0];
  const imageSrc = image
    ? image.startsWith("http")
      ? image
      : `http://localhost:5000/uploads/products/${image.replace(/^\/?/, "")}`
    : "/placeholder.png";
  return (
    <>
      <Link href={`/customer/product/${product._id}`}>
        <div className="bg-background w-64 rounded-md shadow-lg text-center overflow-hidden m-8">
          <div className="relative">
            <div
      className="absolute top-2 right-2 cursor-pointer z-10"
        onClick={(e) => {
          e.preventDefault(); 
          e.stopPropagation();
          handleLike();
        }}
            >
              {isLiked ? (
                <FavoriteIcon className="text-red-600" />
              ) : (
                <FavoriteBorderIcon className="hover:text-red-500" />
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

          <div className="p-3">
            <Typography variant="h6">
              {product?.name || "اسم المنتج"}
            </Typography>

            <Typography variant="body1">
              {product?.price || "500"} EGY
            </Typography>

            <MainButton
              text={"اضافه إلي السله"}
              className="w-full h-10 mt-2 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 align-item px-6 bg-primary cursor-pointer"
            />
          </div>
        </div>
      </Link>
    </>
  );
};

export default CardItem;
