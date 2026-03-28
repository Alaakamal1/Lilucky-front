'use client';

import { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import MainButton from '@/src/components/ui/MainButton';
import Link from 'next/link';
import ProductTable from '@/src/components/ui/BasicTable';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

const Page = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const columns = [
    { id: 'arName', label: 'اسم الفئه' },
    { id: 'categoryType', label: ' نوع الفئه' },
    { id: 'isActive', label: 'الحاله' },
    { id: 'actions', label: 'تفاصيل \\ تعديل \\ حذف', isAction: true },
  ];
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/category/get-all');
        if (!res.ok) throw new Error('Failed to fetch category data');
        const data = await res.json();
        console.log('Fetched categories:', data);
        const categoryData = Array.isArray(data.data.categories)
          ? data.data.categories
          : Array.isArray(data.data.categories)
            ? data.data.categories
            : [];
        setCategory(categoryData);
         categoryData.forEach((category: any) => {
              category.isActive = category.isActive === true ? 'متوفر' : 'غير متوفر';
            });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  
  const handleEdit = (row: any) => {

    router.push(`/admin/availableCategory/editCategory/${row._id}`);
};
   const handleDelete = async (row: any) => {
        const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });
    if (!result.isConfirmed) return;
      const token = sessionStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/category/${row._id}`, {
          method: 'DELETE',
           headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        });
        if (!res.ok) throw new Error('فشل حذف الفئه');
        setCategory((prev) => prev.filter((c) => c._id !== row._id));
        toast.success("تم حذف الفئه بنجاح");
      } catch (err: any) {
        toast.error("Error message");
      }
    };
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">

      {loading && (
        <div className="flex justify-center my-10">
          <CircularProgress color="primary" />
        </div>
      )}

      {error && (
        <Typography align="center" className="my-6">
          حدث خطأ أثناء تحميل البيانات: {error}
        </Typography>
      )}
      {!loading && !error && category.length === 0 && (
        <div className='flex flex-col justify-around items-center md:h-2/4 '>
           <Link href="/admin/availableCategory/addCategory">
              <MainButton
                text="اضافه اول فئه"  
                className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
              />
            </Link>
        <Typography align="center" className="my-10 text-gray-500 text-lg">
          لا توجد بيانات حالياً
        </Typography>
        </div>
      )}
      {!loading && !error && category.length > 0 && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-6">
            <Typography
              variant="h5"
              className="text-center text-secondary-text font-semibold"
            >
              ال فئات المتاحة
            </Typography>
            <Link href="/admin/availablecategory/addProduct">
              <MainButton
                text="اضافة فئه جديدة"
                className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
              />
            </Link>
          </div>
          <div className="w-full max-w-6xl mx-auto mb-16 overflow-x-auto">
            <ProductTable
              columns={columns}
              rows={category}
              onEdit={handleEdit}
onDelete={handleDelete}
/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
