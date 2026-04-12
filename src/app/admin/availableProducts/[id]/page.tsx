'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, CircularProgress } from '@mui/material';
import Image from 'next/image';

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const images =
    product?.variants?.flatMap((v: any) => v.images || []) || [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        const productData = data.data.product || data.data;

        setProduct(productData);

        const firstImage =
          productData?.variants?.[0]?.images?.[0] || "";
        setSelectedImage(firstImage);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center my-20">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography align="center" className="my-10 text-red-500">
        {error}
      </Typography>
    );
  }

  if (!product) return null;

  return (
    <div className="w-full  p-4 md:p-6  justify-center items-center">

    <Typography variant="h4" className="mb-6 text-center text-primary">
      تفاصيل المنتج
    </Typography>
      <div className="max-w-5xl mx-auto bg-white justify-center items-center rounded-xl shadow p-4 md:p-6">

        <div className="grid md:grid-cols-2 gap-10">

          {/* الصور */}
          <div className="max-w-md w-full mx-auto">

            {/* الصورة الكبيرة */}
            <div className="w-full h-[280px] relative border rounded-lg overflow-hidden">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="product"
                  className="w-full h-full object-cover"

                  />
              )}
            </div>

            {/* thumbnails */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 relative cursor-pointer border rounded overflow-hidden ${selectedImage === img ? "border-primary border-2" : "border-gray-300"
                    }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* التفاصيل */}
          <div className="space-y-4">

            <Typography variant="h5" className="font-bold">
              {product.name}
            </Typography>

            <div className="flex-col gap-3 ">
              <Typography className="text-lg font-bold text-gray-700">
                السعر علي الموقع
              </Typography>
              <Typography className="text-lg font-bold text-primary">
                {product.price} جنيه
              </Typography>

              <Typography className="text-sm text-gray-500">
                السعر الأصلي
              </Typography>
              <Typography className="text-gray-400">
                {product.main_price} جنيه
              </Typography>
            </div>

            <Typography className="text-gray-600">
              {product.description}
            </Typography>

            {/* الحالة */}
            <div className="flex gap-4">
              <div className="bg-gray-100 px-3 py-2 rounded">
                المخزون: {product.stock || 0}
              </div>
              <div className={`px-3 py-2 rounded ${product.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                }`}>
                {product.isActive ? "متوفر" : "غير متوفر"}
              </div>
            </div>

            {/* 🔥 Variants (الأهم) */}
            <div className="mt-4 space-y-3">
              <p className="font-semibold">الألوان والمقاسات:</p>

              {product.variants.map((variant: any, i: number) => (
                <div key={i} className="border p-3 rounded-lg">

                  {/* اللون */}
                  <div className="flex items-center gap-2 mb-2">
                    <span>اللون:</span>
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: variant.color }}
                    />
                  </div>

                  {/* المقاسات */}
                  <div className="flex flex-wrap gap-2">
                    {variant.sizes.map((size: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;