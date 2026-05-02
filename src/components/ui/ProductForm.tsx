// 'use client';

// import Image from "next/image";
// import Dropdown from "@/src/components/ui/DropDown";
// import InputField from "@/src/components/ui/InputField";
// import MainButton from "@/src/components/ui/MainButton";
// import TextArea from "@/src/components/ui/TextArea";
// import { Typography } from "@mui/material";
// import { useState, useEffect } from "react";
// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// import { Category } from "@/src/interfaces/Category";
// import { Product, ProductVariant } from "@/src/interfaces/product";
// import { useId } from "react";
// /* ================= TYPES ================= */

// type Age = '1Y' | '2Y' | '3Y' | '4Y' | '5Y' | '6Y' | '7Y' | '8Y';

// interface Variant {
//   id: string; 
//   color: string;
//   sizes: Age[];
//   images: File[];
//   previews: string[];
// }

// interface ProductFormProps {
//   initialData?: Product;
//   onSubmit: (formData: FormData) => Promise<boolean | void>;
// }

// /* ================= CONSTANTS ================= */

// const availableColors = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#f5a623"];

// const ageRangeOptions: { value: Age; label: string }[] = [
//   { value: "1Y", label: "سنة" },
//   { value: "2Y", label: "سنتين" },
//   { value: "3Y", label: "3 سنوات" },
//   { value: "4Y", label: "4 سنوات" },
//   { value: "5Y", label: "5 سنوات" },
//   { value: "6Y", label: "6 سنوات" },
//   { value: "7Y", label: "7 سنوات" },
//   { value: "8Y", label: "8 سنوات" },
// ];

// const genderOptions = [
//   { value: "boys", label: "ذكر" },
//   { value: "girls", label: "انثى" },
// ];

// /* ================= COMPONENT ================= */

// export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {

//   const [productName, setProductName] = useState<string>(initialData?.name || "");
//   const [gender, setGender] = useState<string>(initialData?.gender || "");

//   const [productCategory, setProductCategory] = useState<string>(
//     typeof initialData?.category === "object" && initialData?.category !== null
//       ? initialData.category._id
//       : initialData?.category || ""
//   );

//   const [productMaterial, setProductMaterial] = useState<string>(initialData?.material || "");
//   const [productDescription, setProductDescription] = useState<string>(initialData?.description || "");
//   const [productMainPrice, setProductMainPrice] = useState<string>(
//     initialData?.main_price ? String(initialData.main_price) : "");
//   const [productSitePrice, setProductSitePrice] = useState<string>(
//     initialData?.price ? String(initialData.price) : "");
//   const [stockQuantity, setStockQuantity] = useState<string>(
//     initialData?.stock ? String(initialData.stock) : "");
//   const [productDataCategory, setProductDataCategory] = useState<{ value: string; label: string }[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
//   const [variants, setVariants] = useState<Variant[]>(
//     initialData?.variants?.map((v: ProductVariant) => ({
//       id: crypto.randomUUID(),
//       color: v.color || "",
//       sizes: v.sizes || [],
//       images: [],
//       previews: v.images || [],
//     })) || [{id: crypto.randomUUID(), color: "", sizes: [], images: [], previews: [] }]
//   );

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (gender) {
//       fetchCategories(gender);
//     }
//   }, [gender]);

//   const fetchCategories = async (selectedGender: string) => {
//     try {
//       setLoadingCategories(true);
//       const res = await apiClient.get<{ data: { categoryNames: Category[] } }>(
//         `${Endpoints.category}/names?lang=ar&gender=${selectedGender}`
//       );

//       const formatted = (res.data.data.categoryNames as Category[]).map((cat) => ({
//         value: cat._id,
//         label: cat.arName ?? cat.name,
//       }));
//       setProductDataCategory(formatted);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   /* ================= HANDLERS ================= */

//   const addVariant = () =>
//     setVariants((prev) => [...prev, { id: crypto.randomUUID(), color: "", sizes: [], images: [], previews: [] }]);

// const handleColorChange = (id: string, color: string) => {
//   setVariants((prev) =>
//     prev.map((v) =>
//       v.id === id
//         ? { ...v, color: v.color === color ? "" : color }
//         : v
//     )
//   );
// };

// const handleRemoveVariant = (id: string) => {
//   setVariants((prev) => prev.filter((v) => v.id !== id));
// };

// const handleSizesChange = (id: string, size: Age) => {
//   setVariants((prev) =>
//     prev.map((v) =>
//       v.id === id
//         ? {
//             ...v,
//             sizes: v.sizes.includes(size)
//               ? v.sizes.filter((s) => s !== size)
//               : [...v.sizes, size],
//           }
//         : v
//     )
//   );
// };

//  const handleImagesChange = (id: string, files: FileList | null) => {
//   if (!files) return;
//   const fileArray = Array.from(files);
//   const previews = fileArray.map((file) => URL.createObjectURL(file));
//   setVariants((prev) =>
//     prev.map((v) =>
//       v.id === id
//         ? { ...v, images: fileArray, previews }
//         : v
//     )
//   );
// };

//   const resetForm = () => {
//     setProductName("");
//     setGender("");
//     setProductCategory("");
//     setProductMaterial("");
//     setProductDescription("");
//     setProductMainPrice("");
//     setProductSitePrice("");
//     setStockQuantity("");
//     setVariants([{id: crypto.randomUUID(), color: "", sizes: [], images: [], previews: [] }]);
//   };

//   const handleNumberChange = (value: string, setter: (val: string) => void) => {
//     if (/^\d*$/.test(value)) {
//       setter(value);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData();

//     formData.append("name", productName);
//     formData.append("gender", gender);
//     formData.append("category", productCategory);
//     formData.append("material", productMaterial);
//     formData.append("description", productDescription);
//     formData.append("main_price", String(productMainPrice));
//     formData.append("price", String(productSitePrice));
//     formData.append("stock", String(stockQuantity));
//     formData.append(
//       "variants",
//       JSON.stringify(
//         variants.map((v) => ({
//           color: v.color,
//           sizes: v.sizes,
//         }))
//       )
//     );

//     variants.forEach((variant, index) => {
//       variant.images.forEach((file) => {
//         formData.append(`variants[${index}][images]`, file);
//       });
//     });

// //     formData.append(
// //   "variants",
// //   JSON.stringify(
// //     variants.map((v) => ({
// //       color: v.color,
// //       sizes: v.sizes,
// //     }))
// //   )
// // );
//     const result = await onSubmit(formData);
//     if (result) resetForm();
//   };

//   /* ================= UI ================= */

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="w-full p-6 bg-background rounded-md shadow-md">

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField label="اسم المنتج" value={productName} onChange={(e) => setProductName(e.target.value)} />

//           <Dropdown
//             label="النوع"
//             options={genderOptions}
//             value={gender}
//             onChange={(e) => {
//               const value = e.target.value;
//               setGender(value);
//               setProductCategory("");
//             }}
//           />

//           <Dropdown
//             label="التصنيف"
//             options={productDataCategory}
//             value={productCategory}
//             onChange={(e) => setProductCategory(e.target.value)}
//             disabled={loadingCategories}
//           />

//           <InputField label="الخامة" value={productMaterial} onChange={(e) => setProductMaterial(e.target.value)} />
//         </div>

//         <TextArea label="الوصف" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <InputField
//             label="السعر الاصلي"
//             value={productMainPrice}
//             onChange={(e) =>
//               handleNumberChange(e.target.value, setProductMainPrice)
//             }
//           />

//           <InputField
//             label="سعر الموقع"
//             value={productSitePrice}
//             onChange={(e) =>
//               handleNumberChange(e.target.value, setProductSitePrice)
//             }
//           />

//           <InputField
//             label="المخزون"
//             value={stockQuantity}
//             onChange={(e) =>
//               handleNumberChange(e.target.value, setStockQuantity)
//             }
//           />
//         </div>

//         <Typography variant="h6" className="text-primary">الالوان والمقاسات</Typography>

//         {variants.map((variant, index) => (
//           <div key={index} className="relative border-2 border-primary p-4 rounded-md mt-4">

//             {variants.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => handleRemoveVariant(variant.id)}
//                 className="absolute top-2 left-2 text-red-500 text-2xl"
//               >
//                 ×
//               </button>
//             )}

//             <div className="flex gap-2 mb-2">
//               {availableColors.map((c) => (
//                 <button
//                   key={c}
//                   type="button"
// onClick={() => handleColorChange(variant.id, c)}
//                   className={`w-8 h-8 rounded-full border-2 ${variant.color === c ? "border-blue-500" : "border-gray-300"
//                     }`}
//                   style={{ backgroundColor: c }}
//                 />
//               ))}
//             </div>

//             <div className="flex flex-wrap gap-4 mb-2">
//               {ageRangeOptions.map((age) => (
//                 <button
//                   key={age.value}
//                   type="button"
// onClick={() => handleSizesChange(variant.id, age.value)}
//                   className={`py-2 px-4 border rounded ${variant.sizes.includes(age.value)
//                     ? "bg-primary text-white"
//                     : "bg-gray-100"
//                     }`}
//                 >
//                   {age.label}
//                 </button>
//               ))}
//             </div>

//             <input
//               type="file"
//               multiple
// onChange={(e) => handleImagesChange(variant.id, e.target.files)}
// />

//             <div className="flex gap-2 mt-2">
//               {variant.previews.map((img, i) => (
//                 <Image
//                   key={i}
//                   src={img}
//                   width={70}
//                   height={70}
//                   alt="preview"
//                   className="rounded border"
//                 />
//               ))}
//             </div>

//           </div>
//         ))}

//         <button type="button" onClick={addVariant} className="mt-4 text-lg">
//           + اضافة لون جديد
//         </button>

//         <MainButton
//           text="انشاء منتج"
//           type="submit"
//           className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 px-6 bg-primary cursor-pointer"
//         />

//       </div>
//     </form>
//   );
// }


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

/* ================= TYPES ================= */

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
  "#f5a623"
];

const ageRangeOptions: { value: Age; label: string }[] = [
  { value: "1Y", label: "سنة" },
  { value: "2Y", label: "سنتين" },
  { value: "3Y", label: "3 سنوات" },
  { value: "4Y", label: "4 سنوات" },
  { value: "5Y", label: "5 سنوات" },
  { value: "6Y", label: "6 سنوات" },
  { value: "7Y", label: "7 سنوات" },
  { value: "8Y", label: "8 سنوات" },
];

const genderOptions = [
  { value: "boys", label: "ذكر" },
  { value: "girls", label: "انثى" },
];

/* ================= COMPONENT ================= */

export default function ProductForm({
  initialData,
  onSubmit,
}: ProductFormProps) {

  const [productName, setProductName] = useState<string>(
    initialData?.name || ""
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

  const [productMaterial, setProductMaterial] = useState<string>(
    initialData?.material || ""
  );

  const [productDescription, setProductDescription] = useState<string>(
    initialData?.description || ""
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

            // keep old + new
            images: fileArray,
            previews: [...v.previews, ...previews],
          }
          : v
      )
    );
  };

  const resetForm = () => {

    setProductName("");
    setGender("");
    setProductCategory("");
    setProductMaterial("");
    setProductDescription("");
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

    formData.append("name", productName);
    formData.append("gender", gender);
    formData.append("category", productCategory);
    formData.append("material", productMaterial);
    formData.append("description", productDescription);
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

          // keep only server images
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
            label="اسم المنتج"
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
          />

          <Dropdown
            label="النوع"
            options={genderOptions}
            value={gender}
            onChange={(e) => {

              const value = e.target.value;

              setGender(value);

              setProductCategory("");
            }}
          />

          <Dropdown
            label="التصنيف"
            options={productDataCategory}
            value={productCategory}
            onChange={(e) =>
              setProductCategory(e.target.value)
            }
            disabled={loadingCategories}
          />

          <InputField
            label="الخامة"
            value={productMaterial}
            onChange={(e) =>
              setProductMaterial(e.target.value)
            }
          />
        </div>

        {/* ================= DESCRIPTION ================= */}

        <TextArea
          label="الوصف"
          value={productDescription}
          onChange={(e) =>
            setProductDescription(e.target.value)
          }
        />

        {/* ================= PRICES ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <InputField
            label="السعر الاصلي"
            value={productMainPrice}
            onChange={(e) =>
              handleNumberChange(
                e.target.value,
                setProductMainPrice
              )
            }
          />

          <InputField
            label="سعر الموقع"
            value={productSitePrice}
            onChange={(e) =>
              handleNumberChange(
                e.target.value,
                setProductSitePrice
              )
            }
          />

          <InputField
            label="المخزون"
            value={stockQuantity}
            onChange={(e) =>
              handleNumberChange(
                e.target.value,
                setStockQuantity
              )
            }
          />
        </div>

        {/* ================= VARIANTS ================= */}

        <Typography
          variant="h6"
          className="text-primary"
        >
          الالوان والمقاسات
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

            <div className="flex gap-2 mb-2">

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

            {/* ================= PREVIEWS ================= */}

            <div className="flex gap-2 mt-2 flex-wrap">

              {variant.previews
                .filter(Boolean)
                .map((img, i) => (

                  <div
                    key={i}
                    className="relative w-[70px] h-[70px]"
                  >

                    {/* DELETE BUTTON */}
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

                              // حذف الصورة الجديدة لو blob
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

                    {/* IMAGE */}

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
          + اضافة لون جديد
        </button>

        {/* ================= SUBMIT ================= */}

        <MainButton
          text="انشاء منتج"
          type="submit"
          className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 px-6 bg-primary cursor-pointer"
        />

      </div>
    </form>
  );
}