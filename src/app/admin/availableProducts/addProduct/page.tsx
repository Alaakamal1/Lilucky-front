"use client";
import Image from "next/image";
import Dropdown from "@/src/components/ui/DropDown";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import TextArea from "@/src/components/ui/TextArea";
import { Typography } from "@mui/material";
import { useState } from "react";

const Page = () => {
    const [productName, setProductName] = useState<string>('');
    const [ageRange, setAgeRange] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [productCategory, setProductCategory] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [productMainPrice, setProductMainPrice] = useState<string>('');
    const [productSitePrice, setProductSitePrice] = useState<string>('');
    const [stockQuantity, setStockQuantity] = useState<string>('');
    const [productImage, setProductImage] = useState<File | null | string>(null);
    const [productColor, setProductColor] = useState<string>('');
    const [productNameError, setProductNameError] = useState<string>('');
    const [AgeRangeError, setAgeRangeError] = useState<string>('');
    const [genderError, setGenderError] = useState<string>('');
    const [productCategoryError, setProductCategoryError] = useState<string>('');
    const [productDescriptionError, setProductDescriptionError] = useState<string>('');
    const [productMainPriceError, setProductMainPriceError] = useState<string>('');
    const [productSitePriceError, setProductSitePriceError] = useState<string>('');
    const [stockQuantityError, setStockQuantityError] = useState<string>('');
    const [productImageError, setProductImageError] = useState<string>('');
    const [productColorError, setProductColorError] = useState<string>('');

    const AgeRangeCategory = [
        { Value: '1', Label: '1-2 سنوات' },
        { Value: '2', Label: '3-4 سنوات' },
        { Value: '3', Label: '5-6 سنوات' },
        { Value: '4', Label: '7-8 سنوات' },
    ];
    const genderCategory = [
        { value: "0", label: "ذكر" },
        { value: "1", label: "انثى" },
    ];
    const productDataCategory = [
        { value: "", label: "التيشيرتات" },
        { value: "", label: "البناطيل" },
        { value: "", label: "الشورتات" },
        { value: "", label: "الفساتين" },
        { value: "", label: "الجاكيت والمعطف" },
        { value: "", label: "البيجامات" },
        { value: "", label: "الفساتين" },
        { value: "", label: "الفساتين" },
        { value: "", label: "الفساتين" },

    ];

    const handelAgeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAgeRange(e.target.value);
    }
    const handelGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGender(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setProductDescription(value);
        setProductDescriptionError(value.trim() === '' ? 'الوصف مطلوب' : '');
    }
    const handleMainPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProductMainPrice(value);
        setProductMainPriceError(value.trim() === '' ? 'السعر الاصلي مطلوب' : '');
    }
    const handleSitePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProductSitePrice(value);
        setProductSitePriceError(value.trim() === '' ? 'السعر في الموقع مطلوب' : '');   
    }
    const handleStockQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const value = e.target.value;
        setStockQuantity(value);
        setStockQuantityError(value.trim() === '' ? 'كمية المخزون مطلوبة' : '');
    }
const handleProductCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {         
    setProductCategory(e.target.value);
}

    return (
        <>
        <div className="">
                <Typography variant="h4" className="mb-4  text-primary">
                    اضافة منتج جديد
                </Typography>
            <div className='md:w-3xl flex bg-background my-5 center p-6 rounded-md mx-20 shadow-md flex-col gap-4'>

                <form>
                        <Typography variant="h5" className="mb-4  text-secondary-text">
                          البيانات العامه للمنتج
                        </Typography>
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <InputField
                                label="اسم المنتج"
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="اكتب اسم المنتج"
                            />
                            {productNameError && (
                                <Typography className="text-red-500 text-sm mt-1">{productNameError}</Typography>
                            )}
                        </div>
                        <div>
                            <Dropdown label="اختر الفئه العمريه" options={AgeRangeCategory} value={ageRange} onChange={handelAgeRangeChange} />
                            {AgeRangeError && <Typography className="text-red-500 text-sm mt-1">{AgeRangeError}</Typography>}
                        </div>

                        <div>
                            <Dropdown label="اختر النوع" options={genderCategory} value={gender} onChange={handelGenderChange} />
                            {genderError && <Typography className="text-red-500 text-sm mt-1">{genderError}</Typography>}
                        </div>
                           <div>
                            <Dropdown label="اختر تصنيف القطعه" options={productDataCategory} value={productCategory} onChange={handleProductCategoryChange} />
                            {productCategoryError && <Typography className="text-red-500 text-sm mt-1">{productCategoryError}</Typography>}
                        </div>
                        <div>
                            <TextArea label="الوصف" value={productDescription} onChange={handleDescriptionChange} placeholder="اكتب العنوان التفصيلي هنا" rows={3} />
                            {productDescriptionError && <Typography className="text-red-500 text-sm mt-1">{productDescriptionError}</Typography>}
                        </div>
                    </div>
                        <Typography variant="h5" className="mb-4 text-secondary-text">
                           التسعير و المخزون
                        </Typography>
                    <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div >
                            <InputField
                                label="السعر الاصلي للمنتج"
                                type="text"
                                value={productMainPrice}
                                onChange={handleMainPriceChange}
                                placeholder="اكتب السعر الاصلي للمنتج"
                            />
                            {productMainPriceError && (
                                <Typography className="text-red-500 text-sm mt-1">{productMainPriceError}</Typography>
                            )}
                        </div>
                        <div>
                            <InputField
                                label="السعرعلي الموقع"
                                type="text"
                                value={productSitePrice}
                                onChange={handleSitePriceChange}
                                placeholder="اكتب السعر علي الموقع"
                            />
                            {productSitePriceError && (
                                <Typography className="text-red-500 text-sm mt-1">{productSitePriceError}</Typography>
                            )}
                        </div>
                        <div>
                            <InputField
                                label="الكميه المتوفره في المخزون"
                                type="text"
                                value={stockQuantity}
                                onChange={handleStockQuantityChange}
                                placeholder="اكتب الكمية المتوفرة في المخزون"
                            />
                            {stockQuantityError && (
                                <Typography className="text-red-500 text-sm mt-1">{stockQuantityError}</Typography>
                            )}
                        </div>
                    </div>

                    <div>
                        {/* Image and coloring form fields can be added here */}
                    </div>
                    <MainButton
            text="اضافة منتج جديد"
            className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md  p-3  "
          />
                </form>
            </div>
            </div>

        </>
    )
}

export default Page;