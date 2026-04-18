'use client';

import ProductForm from '../../../../components/ui/ProductForm';
import { toast } from 'react-toastify';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
export default function AddProductPage() {

  const handleSubmit = async (formData: FormData) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول");
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

    toast.success("تم اضافة المنتج");
    return true;

  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("خطأ في الاتصال بالسيرفر");
    }
  }
};
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">اضافة منتج</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
