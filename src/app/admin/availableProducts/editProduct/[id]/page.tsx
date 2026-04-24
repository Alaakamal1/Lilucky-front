'use client';

import ProductForm from '@/src/components/ui/ProductForm';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Product } from '@/src/interfaces/product';
export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [initialData, setInitialData] = useState<Product | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(
          `${Endpoints.products}/${productId}`
        );
        const data = res.data;
        const product = data.data;
        setInitialData(product);
      } catch (err) {
        console.error(err);
        toast.error("فشل تحميل البيانات");
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiClient.patch(
        `${Endpoints.products}/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (res.status === 200) {
        toast.success("تم تعديل المنتج");
      } else {
        toast.error("حدث خطأ أثناء التعديل");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("فشل التحديث");
      }
    }
  };
  if (!initialData) return <p>جارٍ تحميل البيانات...</p>;
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">تعديل المنتج</h2>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}