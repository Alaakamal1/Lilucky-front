"use client";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import MainButton from "./MainButton";
import Image from "next/image";
import ProductColor from "./ProductColor";
import Counter from "./Counter";
import OptionSelector from "./OptionSelector";
interface Product {
  image?: string;
  name?: string;
  description?:string;
  oldPrice?: string | number;
  price?: string | number;
  colors?:string[];
  sizes?:string[];
}
const ItemsDetails = ({ product }: { product: Product }) => {
      const [size, setSize] = useState<string>("");
  
  const availableColors = ["red", "white", "black", "green"];
  return (
    <>
      <div className="flex bg-amber-100  items-center md:m-20">
        <div>
          {/*Image */}
          <Image src="/test.jpg" width={300} height={300} />
        </div>
        <div className="flex flex-col mx-4 gap-1 align-baseline">
          <Typography variant="h4" component="h4" className="">
           {product?.name || "اسم المنتج"}
          </Typography>
          <Typography variant="h6" component="h6" className="">
            {product?.price || "300 Egy"}
          </Typography>
          <Typography variant="body2" className=" w-50">
            {/*Product details */}
            {product?.description || "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى."}
          </Typography>
          <div className="">
            {/*coloring */}
            <Typography variant="body1" className="">
             {product?.colors ? "الألوان المتاحة" : "لا توجد ألوان متاحة"}
            </Typography>
            <ProductColor colors={availableColors} />
          </div>
          <div>{/*sizing */}

            <Typography variant="body1" className=" mb-2">
             {product?.sizes ? "المقاسات المتاحة" : "لا توجد مقاسات متاحة"}
            </Typography>
              <OptionSelector
  label=""
  options={["XS", "S", "M", "L", "XL"]}
  selected={size}
  onSelect={setSize}
  className = {"px-4 py-2 border  rounded-md cursor-pointer transition-all"}
/>
   
          </div>
          <div>{/*quntity */}
            <Typography variant="body1" className=" mb-2">
              الكمية
            </Typography>
            <Counter/>
          </div>
          <MainButton
            text="إضافه الي السله "
            className="bg-primary hover:bg-primary-hover duration-300 ease-in-out rounded-md w-32 py-3 my-2 text-background"
          />
        </div>
      </div>
    </>
  );
};

export default ItemsDetails;
