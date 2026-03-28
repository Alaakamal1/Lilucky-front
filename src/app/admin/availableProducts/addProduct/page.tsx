'use client';

import { toast } from 'react-toastify';
import ProductForm from '../../../../components/ui/ProductForm';

export default function AddProductPage() {
  const handleSubmit = async (formData: FormData) => {
    try{
    const token = sessionStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/products/add-product", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
      if (!res.ok) {
      toast.error(data.message || "حدث خطأ");
      return;
    }
    toast.success("تم اضافة المنتج");
    return true; 
  }catch(err){
    toast.error("خطأ في الاتصال بالسيرفر");
  }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">اضافة منتج</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
