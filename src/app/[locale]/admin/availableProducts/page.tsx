'use client';

import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
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
import { useLocale, useTranslations } from 'next-intl';


type Age = '1Y' | '2Y' | '3Y' | '4Y' | '5Y' | '6Y' | '7Y' | '8Y';
const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState<Age | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const t = useTranslations('availableProducts');
  const locale = useLocale();
  const router = useRouter();
  const [categories, setCategories] = useState<{ label: string; value: string }[]>(
    [{ label: t('typeAll'), value: "all" }]
  );


  const columns = [
    { id: 'name', label: t('name') },
    { id: 'image', label: t('image'), isImage: true },
    { id: 'price', label: t('price') },
    { id: 'stock', label: t('stock') },
    { id: 'isActive', label: t('status') },
    { id: 'actions', label: t('actions'), isAction: true },
  ];
  const ageRange = [
    { label: t('typeAll'), value: "all" },
    { label: t('type1Y'), value: "1Y" },
    { label: t('type2Y'), value: "2Y" },
    { label: t('type3Y'), value: "3Y" },
    { label: t('type4Y'), value: "4Y" },
    { label: t('type5Y'), value: "5Y" },
    { label: t('type6Y'), value: "6Y" },
    { label: t('type7Y'), value: "7Y" },
    { label: t('type8Y'), value: "8Y" },
  ];
  const types = [
    { label: t('typeAll'), value: "all" },
    { label: t('typeBoys'), value: "boys" },
    { label: t('typeGirls'), value: "girls" },
  ];

  const statuses = [
    { label: t('typeAll'), value: "all" },
    { label: t('available'), value: "available" },
    { label: t('notAvailable'), value: "unavailable" },
  ];
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.category}/names?lang=${locale}`);
        const data = res.data;
        const categoriesData = data.data.categoryNames;
        const formatted = [
          { label: t('typeAll'), value: "all" },
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
            isActive: product.isActive ? t('available') : t('notAvailable'),
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
      title: t('confirm.title'),
      text: t('confirm.text'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t('confirm.confirm'),
      cancelButtonText: t('confirm.cancel'),
    });

    if (!result.isConfirmed) return;

    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.error(t('errors.loginRequired'));
      return;
    }
    try {
      await apiClient.delete(`${Endpoints.products}/${row._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== row._id));
      toast.success(t('success.delete'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(t('errors.delete'));
      }
    }
  };
  const handleEdit = (row: Product) => {
    router.push(`/${locale}/admin/availableProducts/editProduct/${row._id}`);
  };
  const handleView = (row: Product) => {
    router.push(`/${locale}/admin/availableProducts/${row._id}`);
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
        <div className="space-y-6 animate-pulse">

          {/* Filters Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-thirdary p-4 sm:p-6 rounded-md">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
          </div>

          {/* Table Skeleton */}
          <div className="w-full overflow-x-auto rounded-lg">
            <div className="space-y-3">

              {/* Table Header */}
              <div className="grid grid-cols-6 gap-3 bg-gray-200 p-3 rounded">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-6 gap-3 p-3 border rounded items-center"
                >
                  <div className="h-4 bg-gray-200 rounded"></div>

                  {/* image */}
                  <div className="h-10 w-10 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>

                  {/* actions */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Error */}
      {error && (
        <Typography align="center" className="my-6">
          {t('errors.load')}: {error}
        </Typography>
      )}

      {/* No Data */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-6 min-h-[50vh] text-center">

          <Link href={`/${locale}/admin/availableProducts/addProduct`}>
            <MainButton
              text={t('addFirst')}

              className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
            />
          </Link>

          <Typography className="text-gray-500 text-base sm:text-lg">
            {t('noData')}
          </Typography>
        </div>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="space-y-6">

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-thirdary text-secondary-text p-4 sm:p-6 rounded-md shadow-sm items-stretch">

            <div className="w-full">
              <Filter
                label={t('age')}
                options={ageRange}
                selected={selectedAgeRange}
                onChange={(value) => setSelectedAgeRange(value as Age | "all")}
              />
            </div>

            <div className="w-full">
              <Filter
                label={t('category')}
                options={categories}
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>

            <div className="w-full">
              <Filter
                label={t('type')}
                options={types}
                selected={selectedType}
                onChange={setSelectedType}
              />
            </div>

            <div className="w-full">
              <Filter
                label={t('status')}
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
              {t('title')}
            </Typography>

            <Link href={`/${locale}/admin/availableProducts/addProduct`} className="w-full sm:w-auto">
              <MainButton
                text={t('addNew')}
                className="w-full sm:w-auto cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3 shadow"
              />
            </Link>

          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-lg">
            <div className="">
              <DataTable
                columns={columns}
                rows={filteredProducts}
                rowKey={(row) => row._id}
                viewRoute={(row) => `/${locale}/admin/availableProducts/${row._id}`}
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
