'use client';

import { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import MainButton from '@/src/components/ui/MainButton';
import Link from 'next/link';
import Filter from '@/src/components/ui/Filter';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from '@/src/components/ui/DataTable';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { Category } from '@/src/interfaces/Category';
import { Product, ProductVariant } from '@/src/interfaces/product';

type Age = '1Y' | '2Y' | '3Y' | '4Y' | '5Y' | '6Y' | '7Y' | '8Y';
const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState<Age | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [categories, setCategories] = useState<{ label: string; value: string }[]
  >([{ label: "الكل", value: "all" }]);
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
        const res = await apiClient.get(`${Endpoints.category}/names?lang=ar`);
        const data = res.data;
        const categoriesData = data.data.categoryNames;
        const formatted = [
          { label: "الكل", value: "all" },
          ...categoriesData.map((cat: Category) => ({
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
        const res = await apiClient.get(`${Endpoints.products}/get-all-products`);
        const data = res.data;
        const productsData = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.products)
            ? data.products
            : [];
        const formattedProducts = productsData.map((product: Product) => {
          const firstImage = product.variants?.[0]?.images?.[0];
          return {
            ...product,
            image: firstImage
              ? `${firstImage.replace(/^\/?/, "")}`
              : "/no-image.png",
            isActive: product.isActive ? "متوفر" : "غير متوفر",
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

  const handleDelete = async (row: Product) => {
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

  if (!token) {
    toast.error("يجب تسجيل الدخول أولاً");
    return;
  }
  try {
    await apiClient.delete(`${Endpoints.products}/${row._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProducts((prev) => prev.filter((p) => p._id !== row._id));
    toast.success("تم حذف المنتج بنجاح");
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }
};
  const handleEdit = (row: Product) => {
    router.push(`/admin/availableProducts/editProduct/${row._id}`);
  };
  const handleView = (row: Product) => {
    router.push(`/admin/availableProducts/${row._id}`);
  };
    const filteredProducts = products.filter((p) => {
    const matchGender =
      selectedType === "all" || p.gender === selectedType;
    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "available" ? p.isActive === true : p.isActive === false);
    const matchCategory =
      selectedCategory === "all" ||
      (typeof p.category === "object"
        ? p.category._id === selectedCategory
        : p.category === selectedCategory);
    const matchAge =
      selectedAgeRange === "all" ||
      p.variants?.some((v: ProductVariant) =>
        v.sizes?.includes(selectedAgeRange)
      );

    return matchGender && matchStatus && matchCategory && matchAge;
  });

  return (
    <div className="w-full px-3 sm:px-6 md:px-8 lg:px-10 py-4 space-y-6">

  {/* Loading */}
  {loading && (
    <div className="flex justify-center items-center py-16">
      <CircularProgress color="primary" />
    </div>
  )}

  {/* Error */}
  {error && (
    <Typography align="center" className="my-6">
      حدث خطأ أثناء تحميل البيانات: {error}
    </Typography>
  )}

  {/* No Data */}
  {!loading && !error && products.length === 0 && (
    <div className="flex flex-col justify-center items-center gap-6 min-h-[50vh] text-center">

      <Link href="/admin/availableProducts/addProduct">
        <MainButton
          text="اضافه اول منتج "
          className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
        />
      </Link>

      <Typography className="text-gray-500 text-base sm:text-lg">
        لا توجد بيانات حالياً
      </Typography>
    </div>
  )}

  {/* Content */}
  {!loading && !error && products.length > 0 && (
    <div className="space-y-6">

      {/* Filters */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-thirdary text-secondary-text p-4 sm:p-6 rounded-md shadow-sm items-stretch">

  <div className="w-full">
    <Filter
      label="الفئه العمريه"
      options={ageRange}
      selected={selectedAgeRange}
      onChange={(value) => setSelectedAgeRange(value as Age | "all")}
    />
  </div>

  <div className="w-full">
    <Filter
      label="نوع المنتج"
      options={categories}
      selected={selectedCategory}
      onChange={setSelectedCategory}
    />
  </div>

  <div className="w-full">
    <Filter
      label="النوع"
      options={types}
      selected={selectedType}
      onChange={setSelectedType}
    />
  </div>

  <div className="w-full">
    <Filter
      label="الحاله"
      options={statuses}
      selected={selectedStatus}
      onChange={setSelectedStatus}
    />
  </div>

</div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 sm:px-2">

        <Typography
          variant="h5"
          className="text-secondary-text font-semibold text-center sm:text-right w-full sm:w-auto"
        >
          المنتجات المتاحة
        </Typography>

        <Link href="/admin/availableProducts/addProduct" className="w-full sm:w-auto">
          <MainButton
            text="اضافة منتج جديد"
            className="w-full sm:w-auto cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3 shadow"
          />
        </Link>

      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg">
        <div className="min-w-[700px]">
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

    </div>
  )}
</div>
  );
};

export default Page;
