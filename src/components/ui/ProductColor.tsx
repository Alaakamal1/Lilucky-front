"use client";
import { useState } from "react";
interface ProductColorProps {
  colors: string[];
}
const ProductColor = ({ colors }: ProductColorProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  return (
    <>
      <div className=" flex gap-2 items-center">
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-7 h-7 rounded-md cursor-pointer border-2 transition-all ${
              selectedColor === color
                ? "border-gray-900 scale-105"
                : "border-gray-200"
            }`}
            style={{ background: color }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default ProductColor;
