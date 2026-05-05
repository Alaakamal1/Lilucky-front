'use client';

import ProductForm from '../../../../../components/ui/ProductForm';
import { toast } from 'react-toastify';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { useTranslations } from 'next-intl';
export default function AddProductPage() {

  const t = useTranslations();
  const handleSubmit = async (formData: FormData) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error(t("common.errors.loginRequired"));
      return;
    }
    const res = await apiClient.post(
  `${Endpoints.products}/add-product`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    if (res.status >= 400) {
      toast.error(res.data.message || "حدث خطأ");
      return;
    }
    toast.success(t("products.adminProducts.addProduct"));
    return true;
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error(t("registration.server"));
    }
  }
};
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">{t("products.adminProducts.createProduct")}</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
