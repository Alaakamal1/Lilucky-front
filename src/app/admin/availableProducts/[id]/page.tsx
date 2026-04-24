'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Typography,
  Skeleton,
  Box,
} from '@mui/material';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { Product } from '@/src/interfaces/product';

/* ================= TYPES ================= */

interface ApiResponse<T> {
  data: T;
}

/* ================= COMPONENT ================= */

const ProductDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* ================= MEMO ================= */

  const images = useMemo(() => {
    return product?.variants?.flatMap((v) => v.images) || [];
  }, [product]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get<ApiResponse<Product>>(
          `${Endpoints.products}/${id}`
        );

        const productData = res.data.data;

        setProduct(productData);

        setSelectedImage(
          productData?.variants?.[0]?.images?.[0] || null
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'حدث خطأ غير معروف'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= SKELETON ================= */

if (loading) {
  return (
    <div className="w-full p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* عنوان */}
        <Skeleton
          variant="text"
          width="40%"
          height={50}
          className="mx-auto mb-6"
        />

        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-10">

            {/* صورة */}
            <div className="space-y-4">
              <Skeleton
                variant="rectangular"
                height={300}
                className="rounded-lg"
              />

              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={64}
                    height={64}
                    className="rounded"
                  />
                ))}
              </div>
            </div>

            {/* تفاصيل */}
            <div className="space-y-5">

              <Skeleton height={35} width="70%" />

              <div className="space-y-3">
                <Skeleton height={25} width="50%" />
                <Skeleton height={30} width="40%" />
                <Skeleton height={20} width="30%" />
                <Skeleton height={20} width="35%" />
              </div>

              <Skeleton height={80} />

              <Skeleton height={20} width="40%" />
              <Skeleton height={20} width="30%" />

              <div className="flex gap-4">
                <Skeleton height={40} width={100} />
                <Skeleton height={40} width={100} />
              </div>
              <div className="space-y-3">
                <Skeleton height={25} width="50%" />
                <Skeleton height={60} />
                <Skeleton height={60} />
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <div className="w-full p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <Typography
          variant="h4"
          className="mb-6 text-center text-primary"
        >
          تفاصيل المنتج
        </Typography>
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-10">

            {/* ================= IMAGES ================= */}
            <div className="max-w-md w-full mx-auto">

              {/* MAIN IMAGE */}
              <div className="relative w-full h-[300px] border rounded-lg overflow-hidden">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="product"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    لا توجد صورة
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 cursor-pointer border rounded overflow-hidden transition ${
                      selectedImage === img
                        ? 'border-primary border-2 scale-105'
                        : 'border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ================= DETAILS ================= */}
            <div className="space-y-4">

              <Typography variant="h5" className="font-bold">
                {product.name}
              </Typography>

              {/* PRICE */}
              <div className="flex flex-col gap-2">
                <Typography className="text-lg font-bold text-gray-700">
                  السعر على الموقع
                </Typography>

                <Typography className="text-2xl font-bold text-primary">
                  {product.price} جنيه
                </Typography>

                <Typography className="text-sm text-gray-500">
                  السعر الأصلي
                </Typography>

                <Typography className="text-gray-400 line-through">
                  {product.main_price} جنيه
                </Typography>
              </div>

              {/* DESCRIPTION */}
              <Typography className="text-gray-600 leading-relaxed">
                {product.description}
              </Typography>

              {/* META */}
              <Typography className="text-sm text-gray-500">
                الفئة: {product.category?.arName || 'غير محدد'}
              </Typography>

              <Typography className="text-sm text-gray-500">
                الخامه: {product.material}
              </Typography>

              {/* STATUS */}
              <div className="flex gap-4">
                <div className="bg-gray-100 px-3 py-2 rounded">
                  المخزون: {product.stock || 0}
                </div>

                <div
                  className={`px-3 py-2 rounded font-medium ${
                    product.isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-500'
                  }`}
                >
                  {product.isActive ? 'متوفر' : 'غير متوفر'}
                </div>
              </div>

              {/* VARIANTS */}
              <div className="mt-4 space-y-3">
                <p className="font-semibold">الألوان والمقاسات:</p>

                {product.variants?.length ? (
                  product.variants.map((variant, i) => (
                    <div
                      key={i}
                      className="border p-3 rounded-lg"
                    >
                      {/* COLOR */}
                      <div className="flex items-center gap-2 mb-2">
                        <span>اللون:</span>
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: variant.color }}
                        />
                      </div>

                      {/* SIZES */}
                      <div className="flex flex-wrap gap-2">
                        {variant.sizes.map((size, index) => (
                          <span
                            key={`${size}-${index}`}
                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">
                    لا توجد بيانات
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;