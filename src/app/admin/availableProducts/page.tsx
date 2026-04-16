'use client';

import { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import MainButton from '@/src/components/ui/MainButton';
import Link from 'next/link';
import ProductTable from '@/src/components/ui/DataTable';
import Filter from '@/src/components/ui/Filter';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from '@/src/components/ui/DataTable';


const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [categories, setCategories] = useState<any[]>([
    { label: "الكل", value: "all" },
  ]);
  const router = useRouter();

  const columns = [
    { id: 'name', label: 'اسم المنتج' },
    { id: 'image', label: 'صوره المنتج', isImage: true },
    { id: 'price', label: 'السعر' },
    { id: 'stock', label: 'الكميه' },
    { id: 'isActive', label: 'الحاله' },
    { id: 'actions', label: 'تفاصيل \\ تعديل \\ حذف', isAction: true },
  ];
  const ageRange = [
    { label: "الكل", value: "all" },
    { label: "سنه", value: "1Y" },
    { label: "سنتين", value: "2Y" },
    { label: "3 سنوات", value: "3Y" },
    { label: "4 سنوات", value: "4Y" },
    { label: "5 سنوات", value: "5Y" },
    { label: "5 سنوات", value: "6Y" },
    { label: "7 سنوات", value: "7Y" },
    { label: "8 سنوات", value: "8Y" },
  ];
  const types = [
    { label: "الكل", value: "all" },
    { label: "ولاد", value: "boys" },
    { label: "بنات", value: "girls" },
  ];

  const statuses = [
    { label: "الكل", value: "all" },
    { label: "متوفر", value: "available" },
    { label: "غير متوفر", value: "unavailable" },
  ];
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/category/names?lang=ar");
        const data = await res.json();
      const categoriesData = data.data.categoryNames;

        const formatted = [
          { label: "الكل", value: "all" },
          ...categoriesData.map((cat: any) => ({
            label: cat.name,
            value: cat._id,
          })),
        ];
        setCategories(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/products/get-all-products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const productsData = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.products)
            ? data.products
            : [];
        const formattedProducts = productsData.map((product: any) => {
          const firstImage = product.variants?.[0]?.images?.[0];
          return {
            ...product,
            image: firstImage
              ? `${firstImage.replace(/^\/?/, "")}`
              : "/no-image.png",
            isActive: product.isActive,
            isActiveLabel: product.isActive ? "متوفر" : "غير متوفر",
          };
        });
        setProducts(formattedProducts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
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
      const res = await fetch(`http://localhost:5000/api/products/${row._id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('فشل حذف المنتج');
      setProducts((prev) => prev.filter((p) => p._id !== row._id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (err: any) {
      toast.error("Error message");
    }
  };

  const handleEdit = (row: any) => {
    router.push(`/admin/availableProducts/editProduct/${row._id}`);
  };

  const handleView = (row: any) => {
    router.push(`/admin/availableProducts/${row._id}`);
  };

  const filteredProducts = products.filter((p: any) => {

    // gender
    const matchGender =
      selectedType === "all" || p.gender === selectedType;

    // status
    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "available" ? p.isActive === true : p.isActive === false);

    // category
    const matchCategory =
      selectedCategory === "all" || p.category?._id === selectedCategory;

    // age (from variants.sizes)
    const matchAge =
      selectedAgeRange === "all" ||
      p.variants?.some((v: any) =>
        v.sizes?.includes(selectedAgeRange)
      );

    return matchGender && matchStatus && matchCategory && matchAge;
  });

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

      {/* No Data State */}
      {!loading && !error && products.length === 0 && (
        <div className='flex flex-col justify-around items-center md:h-2/4 '>
          <Link href="/admin/availableProducts/addProduct">
            <MainButton
              text="اضافه اول منتج "
              className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
            />
          </Link>
          <Typography align="center" className="my-10 text-gray-500 text-lg">
            لا توجد بيانات حالياً
          </Typography>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-4 justify-evenly bg-thirdary my-6 p-4 rounded-lg shadow-sm">
            <Filter
              label="الفئه العمريه"
              options={ageRange}
              selected={selectedAgeRange}
              onChange={setSelectedAgeRange}
            />
            <Filter
              label="نوع المنتج"
              options={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
            <Filter
              label="النوع"
              options={types}
              selected={selectedType}
              onChange={setSelectedType}
            />
            <Filter
              label="الحاله"
              options={statuses}
              selected={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-6">
            <Typography
              variant="h5"
              className="text-center text-secondary-text font-semibold"
            >
              المنتجات المتاحة
            </Typography>
            <Link href="/admin/availableProducts/addProduct">
              <MainButton
                text="اضافة منتج جديد"
                className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
              />
            </Link>
          </div>
          <div className="w-full max-w-6xl mx-auto mb-16 overflow-x-auto">
            <DataTable
              columns={columns}
              rows={filteredProducts}
              rowKey="_id"
              viewRoute={(row) => `/admin/availableProducts/${row._id}`}
              onView={handleView}
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
