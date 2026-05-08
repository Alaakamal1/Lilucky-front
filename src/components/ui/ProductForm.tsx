'use client';

import Image from "next/image";
import Dropdown from "@/src/components/ui/DropDown";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import TextArea from "@/src/components/ui/TextArea";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Category } from "@/src/interfaces/Category";
import { Product, ProductVariant } from "@/src/interfaces/product";
import { useTranslations } from "next-intl";


type Age =
  | '1Y'
  | '2Y'
  | '3Y'
  | '4Y'
  | '5Y'
  | '6Y'
  | '7Y'
  | '8Y';

interface Variant {
  id: string;
  color: string;
  sizes: Age[];
  images: File[];
  previews: string[];
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (formData: FormData) => Promise<boolean | void>;
}

/* ================= CONSTANTS ================= */

const availableColors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#f5a623",
  "#ff69b4",
  "#ffb6c1",
  "#ffc0cb",
  "#ffd700",
  "#ffff00",
  "#87ceeb",
  "#00bfff",
  "#1e90ff",
  "#9370db",
  "#ba55d3",
  "#ff8c00",
  "#ffa500",
  "#98fb98",
  "#32cd32",
  "#20b2aa",
  "#40e0d0",
  "#a0522d",
  "#d2b48c",
  "#c0c0c0",
  "#808080",
  "#f08080",
  "#e6e6fa",
  "#fffacd",
  "#add8e6",
  "#ffe4e1"
];



/* ================= COMPONENT ================= */

export default function ProductForm({
  initialData,
  onSubmit,
}: ProductFormProps) {

  const [productNameEn, setProductNameEn] = useState(
    typeof initialData?.name === "object"
      ? initialData.name?.en || ""
      : ""
  );

  const [productNameAr, setProductNameAr] = useState(
    typeof initialData?.name === "object"
      ? initialData.name?.ar || ""
      : ""
  );

  const [productDescriptionEn, setProductDescriptionEn] = useState(
    typeof initialData?.description === "object"
      ? initialData.description?.en || ""
      : ""
  );

  const [productDescriptionAr, setProductDescriptionAr] = useState(
    typeof initialData?.description === "object"
      ? initialData.description?.ar || ""
      : ""
  );

   const [productMaterialAr, setProductMaterialAr] = useState(
    typeof initialData?.material === "object"
      ? initialData.material?.ar || ""
      : ""
  );

     const [productMaterialEn, setProductMaterialEn] = useState(
    typeof initialData?.material === "object"
      ? initialData.material?.ar || ""
      : ""
  );

  const [gender, setGender] = useState<string>(
    initialData?.gender || ""
  );

  const [productCategory, setProductCategory] = useState<string>(
    typeof initialData?.category === "object" &&
      initialData?.category !== null
      ? initialData.category._id
      : initialData?.category || ""
  );

 

  const [productMainPrice, setProductMainPrice] = useState<string>(
    initialData?.main_price
      ? String(initialData.main_price)
      : ""
  );

  const [productSitePrice, setProductSitePrice] = useState<string>(
    initialData?.price
      ? String(initialData.price)
      : ""
  );

  const [stockQuantity, setStockQuantity] = useState<string>(
    initialData?.stock
      ? String(initialData.stock)
      : ""
  );

  const [productDataCategory, setProductDataCategory] = useState<
    { value: string; label: string }[]
  >([]);

  const [loadingCategories, setLoadingCategories] =
    useState<boolean>(false);

  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants?.map((v: ProductVariant) => ({
      id: crypto.randomUUID(),
      color: v.color || "",
      sizes: v.sizes || [],
      images: [],
      previews: Array.isArray(v.images)
        ? v.images.filter(Boolean)
        : [],
    })) || [
      {
        id: crypto.randomUUID(),
        color: "",
        sizes: [],
        images: [],
        previews: [],
      },
    ]
  );

  const t = useTranslations();

  const ageRangeOptions: { value: Age; label: string }[] = [
    { value: "1Y", label: t("common.age1") },
    { value: "2Y", label: t("common.age2") },
    { value: "3Y", label: t("common.age3") },
    { value: "4Y", label: t("common.age4") },
    { value: "5Y", label: t("common.age5") },
    { value: "6Y", label: t("common.age6") },
    { value: "7Y", label: t("common.age7") },
    { value: "8Y", label: t("common.age8") },
  ];

  const genderOptions = [
    { value: "boys", label: t("common.boys") },
    { value: "girls", label: t("common.girls") },
  ];

  /* ================= FETCH ================= */

  useEffect(() => {
    if (gender) {
      fetchCategories(gender);
    }
  }, [gender]);

  const fetchCategories = async (selectedGender: string) => {
    try {

      setLoadingCategories(true);

      const res = await apiClient.get<{
        data: { categoryNames: Category[] }
      }>(
        `${Endpoints.category}/names?lang=ar&gender=${selectedGender}`
      );

      const formatted = (
        res.data.data.categoryNames as Category[]
      ).map((cat) => ({
        value: cat._id,
        label: cat.arName ?? cat.name,
      }));

      setProductDataCategory(formatted);

    } catch (err) {

      console.error("Error fetching categories:", err);

    } finally {

      setLoadingCategories(false);
    }
  };

  /* ================= HANDLERS ================= */

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        color: "",
        sizes: [],
        images: [],
        previews: [],
      },
    ]);
  };

  const handleColorChange = (
    id: string,
    color: string
  ) => {

    setVariants((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
            ...v,
            color: v.color === color ? "" : color,
          }
          : v
      )
    );
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) =>
      prev.filter((v) => v.id !== id)
    );
  };

  const handleSizesChange = (
    id: string,
    size: Age
  ) => {

    setVariants((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
            ...v,

            sizes: v.sizes.includes(size)
              ? v.sizes.filter((s) => s !== size)
              : [...v.sizes, size],
          }
          : v
      )
    );
  };

  const handleImagesChange = (
    id: string,
    files: FileList | null
  ) => {

    if (!files) return;

    const fileArray = Array.from(files);

    const previews = fileArray.map((file) =>
      URL.createObjectURL(file)
    );

    setVariants((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
            ...v,
            images: fileArray,
            previews: [...v.previews, ...previews],
          }
          : v
      )
    );
  };

  const resetForm = () => {
    setProductNameEn("");
    setProductNameAr("");
    setProductDescriptionEn("");
    setProductDescriptionAr("");
    setGender("");
    setProductCategory("");
    setProductMaterialAr("");
    setProductMaterialEn("");
    setProductMainPrice("");
    setProductSitePrice("");
    setStockQuantity("");

    setVariants([
      {
        id: crypto.randomUUID(),
        color: "",
        sizes: [],
        images: [],
        previews: [],
      },
    ]);
  };

  const handleNumberChange = (
    value: string,
    setter: (val: string) => void
  ) => {

    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "name",
      JSON.stringify({
        en: productNameEn,
        ar: productNameAr,
      })
    );

    formData.append(
      "description",
      JSON.stringify({
        en: productDescriptionEn,
        ar: productDescriptionAr,
      })
    );
    formData.append("material",
        JSON.stringify({
        en: productMaterialEn,
        ar: productMaterialAr,
      })
       );

    formData.append("gender", gender);
    formData.append("category", productCategory);
    formData.append("main_price", String(productMainPrice));
    formData.append("price", String(productSitePrice));
    formData.append("stock", String(stockQuantity));

    /* ================= VARIANTS ================= */

    formData.append(
      "variants",
      JSON.stringify(
        variants.map((v) => ({

          color: v.color,
          sizes: v.sizes,
          images: v.previews.filter(
            (img) =>
              typeof img === "string" &&
              !img.startsWith("blob:")
          ),
        }))
      )
    );

    /* ================= NEW FILES ================= */

    variants.forEach((variant, index) => {

      variant.images.forEach((file) => {

        if (file instanceof File) {

          formData.append(
            `variants[${index}][images]`,
            file
          );
        }
      });
    });

    const result = await onSubmit(formData);

    if (result) {
      resetForm();
    }
  };

  /* ================= UI ================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <div className="w-full p-6 bg-background rounded-md shadow-md">

        {/* ================= TOP ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">



          <InputField
            label={t("products.adminProducts.arname")}
            value={productNameAr}
            onChange={(e) => setProductNameAr(e.target.value)}
          />

          <InputField
            label={t("products.adminProducts.enname")}
            value={productNameEn}
            onChange={(e) => setProductNameEn(e.target.value)}
          />
          <Dropdown
            label={t("products.adminProducts.gender")}
            options={genderOptions}
            value={gender}
            onChange={(e) => {
              const value = e.target.value;
              setGender(value);
              setProductCategory("");
            }}
          />

          <Dropdown
            label={t("products.adminProducts.categoryType")}
            options={productDataCategory}
            value={productCategory}
            onChange={(e) =>
              setProductCategory(e.target.value)
            }
            disabled={loadingCategories}
          />

             <InputField
            label={t("products.adminProducts.materialAR")}
            value={productMaterialAr}
            onChange={(e) =>
              setProductMaterialAr(e.target.value)
            }
          />
           <InputField
            label={t("products.adminProducts.materialEN")}
            value={productMaterialEn}
            onChange={(e) =>
              setProductMaterialEn(e.target.value)
            }
          />


        </div>

        {/* ================= DESCRIPTION ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <TextArea
            label={t("products.adminProducts.ardescription")}
            value={productDescriptionAr}
            onChange={(e) => setProductDescriptionAr(e.target.value)}
          />
          <TextArea
            label={t("products.adminProducts.endescription")}
            value={productDescriptionEn}
            onChange={(e) => setProductDescriptionEn(e.target.value)}
          />


        </div>

        {/* ================= PRICES ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       
          <InputField
            label={t("products.adminProducts.Inventory")}
            value={stockQuantity}
            onChange={(e) =>
              handleNumberChange(
                e.target.value,
                setStockQuantity
              )
            }
          />
          <InputField
            label={t("products.adminProducts.mainPrice")}
            value={productMainPrice}
            onChange={(e) =>
              handleNumberChange(
                e.target.value,
                setProductMainPrice
              )
            }
          />

          <InputField
            label={t("products.adminProducts.sitePrice")}
            value={productSitePrice}
            onChange={(e) =>
              handleNumberChange(
                e.target.value,
                setProductSitePrice
              )
            }
          />


        </div>

        {/* ================= VARIANTS ================= */}

        <Typography
          variant="h6"
          className="text-primary"
        >
          {t("products.adminProducts.variants")}
        </Typography>

        {variants.map((variant) => (

          <div
            key={variant.id}
            className="relative border-2 border-primary p-4 rounded-md mt-4"
          >

            {variants.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  handleRemoveVariant(variant.id)
                }
                className="absolute top-2 left-2 text-red-500 text-2xl"
              >
                ×
              </button>
            )}

            {/* ================= COLORS ================= */}

            <div className="flex flex-wrap gap-2 mb-2">

              {availableColors.map((c) => (

                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    handleColorChange(variant.id, c)
                  }
                  className={`w-8 h-8 rounded-full border-2 ${variant.color === c
                    ? "border-blue-500"
                    : "border-gray-300"
                    }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* ================= SIZES ================= */}

            <div className="flex flex-wrap gap-4 mb-2">

              {ageRangeOptions.map((age) => (

                <button
                  key={age.value}
                  type="button"
                  onClick={() =>
                    handleSizesChange(
                      variant.id,
                      age.value
                    )
                  }
                  className={`py-2 px-4 border rounded ${variant.sizes.includes(age.value)
                    ? "bg-primary text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {age.label}
                </button>
              ))}
            </div>

            {/* ================= FILE INPUT ================= */}

            <input
              type="file"
              multiple
              onChange={(e) =>
                handleImagesChange(
                  variant.id,
                  e.target.files
                )
              }
            />

            {/* ================= PREVIEWS ================= */}

            <div className="flex gap-2 mt-2 flex-wrap">

              {variant.previews
                .filter(Boolean)
                .map((img, i) => (

                  <div
                    key={i}
                    className="relative w-[70px] h-[70px]"
                  >

                    <button
                      type="button"
                      onClick={() => {

                        setVariants((prev) =>
                          prev.map((v) => {

                            if (v.id !== variant.id) return v;

                            return {

                              ...v,

                              previews: v.previews.filter(
                                (_, index) => index !== i
                              ),
                              images: img.startsWith("blob:")
                                ? v.images.filter(
                                  (_, index) => index !== (
                                    v.previews.filter((p) =>
                                      p.startsWith("blob:")
                                    ).indexOf(img)
                                  )
                                )
                                : v.images,
                            };
                          })
                        );
                      }}
                      className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>

                    <Image
                      src={
                        !img || img === "undefined"
                          ? "/no-image.png"
                          : img.startsWith("blob:")
                            ? img
                            : img.startsWith("http")
                              ? img
                              : `${process.env.NEXT_PUBLIC_API_URL}${img}`
                      }
                      width={70}
                      height={70}
                      alt="preview"
                      className="rounded border object-cover w-full h-full"
                      unoptimized
                    />

                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* ================= ADD VARIANT ================= */}

        <button
          type="button"
          onClick={addVariant}
          className="mt-4 text-lg"
        >
          {t("products.adminProducts.addVariant")}
        </button>

        {/* ================= SUBMIT ================= */}

        <MainButton
          text={t("products.adminProducts.createProduct")}
          type="submit"
          className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 px-6 bg-primary cursor-pointer"
        />

      </div>
    </form>
  );
}