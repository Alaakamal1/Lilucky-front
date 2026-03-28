'use client';

import Image from "next/image";
import Dropdown from "@/src/components/ui/DropDown";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import TextArea from "@/src/components/ui/TextArea";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface Variant {
color: string;
sizes: string[];
images: File[];
previews: string[];
}

interface ProductFormProps {
initialData?: any;
onSubmit: (formData: FormData) => void;
}

const availableColors = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#f5a623"];

const ageRangeOptions = [
{ value: "1Y", label: "سنة" },
{ value: "2Y", label: "سنتين" },
{ value: "3Y", label: "3 سنوات" },
{ value: "4Y", label: "4 سنوات" },
{ value: "5Y", label: "5 سنوات" },
];

const genderOptions = [
{ value: "0", label: "ذكر" },
{ value: "1", label: "انثى" },
];

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
const [productName, setProductName] = useState(initialData?.name || "");
const [gender, setGender] = useState(initialData?.gender || "");
const [productCategory, setProductCategory] = useState(initialData?.category || "");
const [productDescription, setProductDescription] = useState(initialData?.description || "");
const [productMainPrice, setProductMainPrice] = useState(initialData?.main_price || "");
const [productSitePrice, setProductSitePrice] = useState(initialData?.price || "");
const [stockQuantity, setStockQuantity] = useState(initialData?.stock || "");
const [productDataCategory, setProductDataCategory] = useState<{ value: string; label: string }[]>([]);

const [variants, setVariants] = useState<Variant[]>(initialData?.variants?.map((v: any) => ({
color: v.color,
sizes: v.sizes || [],
images: [],
previews: v.images || [],
})) || [{ color: "#000000", sizes: [], images: [], previews: [] }] );

useEffect(() => {
fetchCategories();
}, []);

const fetchCategories = async () => {
const res = await fetch("http://localhost:5000/api/category/names?lang=ar");
const data = await res.json();
const formatted = data.data.categoryNames.map((cat: any) => ({
value: cat._id,
label: cat.name,
}));
setProductDataCategory(formatted);
};

const addVariant = () => setVariants([...variants, { color: "#000000", sizes: [], images: [], previews: [] }]);

const handleColorChange = (index: number, color: string) => {
const updated = [...variants];
updated[index].color = color;
setVariants(updated);
};

const handleSizesChange = (index: number, size: string) => {
const updated = [...variants];
if (updated[index].sizes.includes(size)) {
updated[index].sizes = updated[index].sizes.filter(s => s !== size);
} else {
updated[index].sizes.push(size);
}
setVariants(updated);
};

const handleImagesChange = (index: number, files: FileList | null) => {
if (!files) return;
const fileArray = Array.from(files);
const previews = fileArray.map((file) => URL.createObjectURL(file));
const updated = [...variants];
updated[index].images = fileArray;
updated[index].previews = previews;
setVariants(updated);
};

const resetForm = () => {
  setProductName("");
  setGender("");
  setProductCategory("");
  setProductDescription("");
  setProductMainPrice("");
  setProductSitePrice("");
  setStockQuantity("");
  setVariants([{ color: "#000000", sizes: [], images: [], previews: [] }]);
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
const formData = new FormData();
formData.append("name", productName);
formData.append("gender", gender);
formData.append("category", productCategory);
formData.append("description", productDescription);
formData.append("main_price", productMainPrice);
formData.append("price", productSitePrice);
formData.append("stock", stockQuantity);
formData.append("variants", JSON.stringify(variants.map(v => ({ color: v.color, sizes: v.sizes }))));
variants.forEach((variant, index) => {
  variant.images.forEach((file) => {
    formData.append(`variants[${index}][images]`, file);
  });
});
  const result = await onSubmit(formData);
  if (result) {
    resetForm();
  }
};


return ( 
<form onSubmit={handleSubmit} className="space-y-4">
<InputField label="اسم المنتج" value={productName} onChange={(e) => setProductName(e.target.value)} />
<Dropdown label="النوع" options={genderOptions} value={gender} onChange={(e) => setGender(e.target.value)} />
<Dropdown label="التصنيف" options={productDataCategory} value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />
<TextArea label="الوصف" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
<InputField label="السعر الاصلي" value={productMainPrice} onChange={(e) => setProductMainPrice(e.target.value)} />
<InputField label="سعر الموقع" value={productSitePrice} onChange={(e) => setProductSitePrice(e.target.value)} />
<InputField label="المخزون" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />

  <Typography variant="h5" className="mt-6">الالوان والمقاسات</Typography>
  {variants.map((variant, index) => (
    <div key={index} className="border p-4 rounded-md mt-4">
      <div className="flex gap-2 mb-2">
        {availableColors.map((c) => (
          <button key={c} type="button" onClick={() => handleColorChange(index, c)}
            className={`w-8 h-8 rounded-full border-2 ${variant.color === c ? "border-blue-500" : "border-gray-300"}`}
            style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {ageRangeOptions.map((age) => (
          <button key={age.value} type="button" onClick={() => handleSizesChange(index, age.value)}
            className={`px-2 py-1 border rounded ${variant.sizes.includes(age.value) ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
            {age.label}
          </button>
        ))}
      </div>
      <input type="file" multiple onChange={(e) => handleImagesChange(index, e.target.files)} />
      <div className="flex gap-2 mt-2">
        {variant.previews.map((img, i) => (
          <Image key={i} src={img} width={70} height={70} alt="preview" className="rounded border" />
        ))}
      </div>
    </div>
  ))}
  <button type="button" onClick={addVariant} className="mt-4 text-lg">+ اضافة لون جديد</button>
  <MainButton text="انشاء منتج"   type="submit"  className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 align-item px-6 bg-primary cursor-pointer" />
</form>
);
}
