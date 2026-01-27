"use client";
import Image from "next/image";
import MainButton from "./MainButton";
import { Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";

// Define Product type
interface Product {
  name?: string;
  oldPrice?: string | number;
  price?: string | number;
}

const CardItem = ({ product }: { product: Product }) => {
  const[isLiked , setIsLiked] = useState(false);
  const handelLike = () => {
    setIsLiked(!isLiked);
  }
  return (
    <>
      <div className="bg-background w-70 h-80 rounded-md shadow-lg text-center relative overflow-hidden">
        <div className="relative">
          <div
          className="absolute top-2 right-2 cursor-pointer z-10"
          onClick={handelLike}>
            {isLiked ?(<FavoriteIcon className="text-red-600 transition-colors duration-300" />
            ) : ( <FavoriteBorderIcon className=" hover:text-red-500 transition-colors duration-300" />
          )}
          </div>
          <Image src="./HomeImage.svg" width={400} height={700} />
        </div>
        <div className="">
          <Typography variant="h4" component="h4">
           {product?.name ||"اسم المنتج"}
          </Typography>
          <div className=" flex justify-around w-auto flex-row-reverse">
            <Typography variant="body1" gutterBottom  className="line-through text-gray-400">
              {product?.oldPrice || "600"} EGY
            </Typography>
            <Typography variant="body1" gutterBottom>
            {product?.price || "500"} EGY
            </Typography>
          </div>
          <MainButton
            text={"اضافه إلي السله"}
            className={
              "w-40 h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 align-item  px-6 bg-primary"
            }
          />
        </div>
      </div>
    </>
  );
};

export default CardItem;
