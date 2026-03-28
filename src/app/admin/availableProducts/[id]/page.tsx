'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, CircularProgress } from '@mui/material';
const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const images =
  product?.variants?.flatMap((v: any) => v.images || []) || [];
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data.data.product || data.data);
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
      <div className="flex justify-center my-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography align="center" className="my-6 text-red-500">
        حدث خطأ أثناء تحميل البيانات: {error}
      </Typography>
    );
  }

  if (!product) {
    return (
      <Typography align="center" className="my-6 text-gray-500">
        لم يتم العثور على المنتج
      </Typography>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Typography variant="h4" className="font-bold mb-6">
        تفاصيل المنتج
      </Typography>

<div className="grid grid-cols-3 gap-3">
  {images.map((img: string, index: number) => (
    <img
      key={index}
      src={img}
      alt={`product-image-${index}`}
      className="w-24 h-24 object-cover rounded-lg border"
    />
  ))}
</div>
      <Typography variant="h5" className="mb-2">
        {product.name}
      </Typography>
      <Typography variant="body1" className="mb-2">
        السعر: {product.price} جنيه
      </Typography>
      <Typography variant="body1" className="mb-2">
        الكمية: { product.stock || 0}
      </Typography>
      <Typography variant="body1">
        الحالة: {product.isActive === true ? 'متوفر' : 'غير متوفر'}
      </Typography>
    </div>
  );
};

export default ProductDetailsPage;