'use client';
import ProductForm from '@/src/components/ui/ProductForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;
  const [initialData, setInitialData] = useState<any>(null);
  console.log("Editing product id:", productId);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`);
      const data = await res.json();
      setInitialData(data.data);
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (formData: FormData) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PATCH',
         headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) toast.success("تم تعديل المنتج");
    else toast.error(data.message);
  };

  if (!initialData) return <p>جارٍ تحميل البيانات...</p>;

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">تعديل المنتج</h2>
      <ProductForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}