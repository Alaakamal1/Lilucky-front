'use client';

import MainButton from '@/src/components/ui/MainButton';
import DataTable from '@/src/components/ui/DataTable';
import Link from 'next/link';
import Swal from "sweetalert2";
import { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { Category } from '@/src/interfaces/Category';
const Page = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const columns = [
    { id: 'arName', label: 'اسم الفئه' },
    { id: 'categoryType', label: 'نوع الفئه' },
    { id: 'isActive', label: 'الحاله' },
    { id: 'actions', label: 'تفاصيل \\ تعديل \\ حذف', isAction: true },
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`${Endpoints.category}/get-all`);
        const data = res.data;
        const categoryData = Array.isArray(data?.data?.categories)
          ? data?.data?.categories
          : [];
        const formattedData = categoryData.map((cat: Category) => ({
          ...cat,
          isActive: cat.isActive ? 'متوفر' : 'غير متوفر',
        }));

        setCategory(formattedData);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError('حدث خطأ غير متوقع');
          toast.error('حدث خطأ غير متوقع');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);
  const handleEdit = (row: Category) => {
    router.push(`/admin/availableCategory/addCategory?id=${row._id}`);
  };
  const handleDelete = async (row: Category) => {
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
      const res = await apiClient.delete(`${Endpoints.category}/${row._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) throw new Error('فشل حذف الفئه');

      setCategory((prev) => prev.filter((c) => c._id !== row._id));

      toast.success("تم حذف الفئه بنجاح");

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "حدث خطأ أثناء الحذف");
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-10">
          <CircularProgress />
        </div>
      )}
      {error && (
        <Typography align="center" className="my-6 text-red-500">
          حدث خطأ أثناء تحميل البيانات: {error}
        </Typography>
      )}
      {!loading && !error && category.length === 0 && (
        <div className='flex flex-col justify-center items-center gap-4 md:h-2/4'>

          <Link href="/admin/availableCategory/addCategory">
            <MainButton
              text="اضافه اول فئه"
              className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
            />
          </Link>

          <Typography align="center" className="text-gray-500 text-lg">
            لا توجد بيانات حالياً
          </Typography>
        </div>
      )}

      {/* Table */}
      {!loading && !error && category.length > 0 && (
        <div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-6">

            <Typography variant="h5" className="text-secondary-text font-semibold">
              الفئات المتاحة
            </Typography>
            <Link href="/admin/availableCategory/addCategory">
              <MainButton
                text="اضافة فئه جديدة"
                className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
              />
            </Link>

          </div>
          <div className="w-full max-w-6xl mx-auto mb-16 overflow-x-auto">

            <DataTable
              columns={columns}
              rows={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
actions={{ view: false, edit: true, delete: true }}
/>
          </div>

        </div>
      )}
    </div>
  );
};

export default Page;