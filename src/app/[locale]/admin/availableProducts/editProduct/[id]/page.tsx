'use client';

import ProductForm from '@/src/components/ui/ProductForm';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Product } from '@/src/interfaces/product';
import { useTranslations } from 'next-intl';
export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [initialData, setInitialData] = useState<Product | null>(null);
  const t = useTranslations();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(
          `${Endpoints.products}/get/${productId}`
        );
        const data = res.data;
        const product = data.data;
        setInitialData(product);
      } catch (err) {
        console.error(err);
        toast.error(t("common.load"));
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiClient.patch(
        `${Endpoints.products}/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (res.status === 200) {
        toast.success(t("products.adminProducts.product_updated"));
      } else {
        toast.error(t("products.adminProducts.update_error"));
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(t("products.adminProducts.update_failed"));
      }
    }
  };
  if (!initialData) return <p>{t("products.customerProducts.loading")}</p>;
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4"> {t("products.customerProducts.edit_product")}</h2>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}