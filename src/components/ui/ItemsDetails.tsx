"use client";

import { Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import MainButton from "./MainButton";
import Image from "next/image";
import ProductColor from "./ProductColor";
import Counter from "./Counter";
import OptionSelector from "./OptionSelector";
import { Product } from "@/src/interfaces/product";

interface Props {
  product: Product;
}

const ItemsDetails = ({ product }: Props) => {
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  /* ================= MEMOIZED DATA ================= */

  const availableColors = useMemo(() => {
    return [...new Set(product?.variants?.map(v => v.color) || [])];
  }, [product]);

  const availableSizes = useMemo(() => {
    return [...new Set(product?.variants?.flatMap(v => v.sizes) || [])];
  }, [product]);

  /* ================= UI ================= */

  return (
    <div className="flex bg-amber-100 items-center md:m-20">

      {/* IMAGE */}
      <div>
        <Image
          src="/test.jpg"
          width={300}
          height={300}
          alt={product?.name || "product image"}
        />
      </div>

      <div className="flex flex-col mx-4 gap-1 align-baseline">

        {/* NAME */}
        <Typography variant="h4">
          {product?.name ?? "اسم المنتج"}
        </Typography>

        {/* PRICE */}
        <Typography variant="h6">
          {product?.price ? `${product.price} EGP` : "300 EGP"}
        </Typography>

        {/* DESCRIPTION */}
        <Typography variant="body2" className="w-50">
          {product?.description ??
            "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة..."}
        </Typography>

        {/* COLORS */}
        <div>
          <Typography variant="body1">
            {availableColors.length > 0
              ? "الألوان المتاحة"
              : "لا توجد ألوان متاحة"}
          </Typography>

          <ProductColor colors={availableColors} />
        </div>

        {/* SIZES */}
        <div>
          <Typography variant="body1" className="mb-2">
            {availableSizes.length > 0
              ? "المقاسات المتاحة"
              : "لا توجد مقاسات متاحة"}
          </Typography>

          <OptionSelector
            label=""
            options={availableSizes.length > 0 ? availableSizes : ["S", "M", "L"]}
            selected={size}
            onSelect={setSize}
            className="px-4 py-2 border rounded-md cursor-pointer transition-all"
          />
        </div>

        {/* QUANTITY */}
        <div>
          <Typography variant="body1" className="mb-2">
            الكمية
          </Typography>

          <Counter
            value={qty}
            onChange={setQty}
            max={10}
          />
        </div>

        {/* BUTTON */}
        <MainButton
          text="إضافه الي السله"
          className="bg-primary hover:bg-primary-hover duration-300 ease-in-out rounded-md w-32 py-3 my-2 text-background"
        />
      </div>
    </div>
  );
};

export default ItemsDetails;