'use client';

import MainButton from '@/src/components/ui/MainButton';
import DataTable from '@/src/components/ui/DataTable';
import Link from 'next/link';
import Swal from "sweetalert2";
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { useLocale, useTranslations } from 'next-intl';

export interface Category {
  _id: string;
  arName: string;
  enName?: string;
  categoryType: string;
  isActive: boolean;
  [key: string]: unknown;
}

const Page = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('availableCategory');
  const tr = useTranslations();
  const locale = useLocale();
    const withLocale = (path: string) => `/${locale}${path}`;


  const columns = [
    { id: 'name', label: t('name') },
    { id: 'categoryType', label: t('type') },
    { id: 'isActive', label: t('status') },
    { id: 'actions', label: t('actions'), isAction: true },
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(`${Endpoints.category}/get-all`);

        const categoryData = Array.isArray(res.data?.data?.categories)
          ? res.data.data.categories
          : [];

        const formattedData = categoryData.map((cat: Category) => ({
          ...cat,

          name: locale === "ar" ? cat.arName : cat.enName || cat.arName,
          categoryType:
            cat.categoryType === "boys"
              ? t("typeBoys")
              : cat.categoryType === "girls"
                ? tr("common.girls")
                : tr("common.all"),

          isActive: cat.isActive
            ? tr("common.available")
            : tr("common.notAvailable"),
        }));

        setCategory(formattedData);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError(tr('common.errors.unexpected'));
          toast.error(tr('common.errors.unexpected'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [locale, t,tr]);

  const handleEdit = (row: Category) => {
    
router.push(withLocale(`/admin/availableCategory/addCategory?id=${row._id}`));
  };

  const handleDelete = async (row: Category) => {
    const result = await Swal.fire({
      title: tr('common.confirmation.title'),
      text: tr('common.confirmation.text'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: tr('common.confirmation.confirm'),
      cancelButtonText: tr('common.confirmation.cancel'),
    });

    if (!result.isConfirmed) return;

    const token = sessionStorage.getItem("token");

    try {
      const res = await apiClient.delete(
        `${Endpoints.category}/${row._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) throw new Error(t('errors.deleteFail'));

      setCategory((prev) => prev.filter((c) => c._id !== row._id));

      toast.success(t('success.delete'));

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || t('errors.delete'));
      } else {
        toast.error(t('errors.unexpected'));
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">

      {/* LOADING */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <Typography align="center" className="my-6 text-red-500">
          {t('errors.load')}: {error}
        </Typography>
      )}

      {/* EMPTY */}
      {!loading && !error && category.length === 0 && (
        <div className='flex flex-col justify-center items-center gap-4 md:h-2/4'>
          <Link href={withLocale("/admin/availableCategory/addCategory")}>
            <MainButton
              text={t('addFirst')}
              className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md px-5 py-3"
            />
          </Link>

          <Typography className="text-gray-500 text-lg">
            {t('noData')}
          </Typography>
        </div>
      )}

      {!loading && !error && category.length > 0 && (
        <div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-6">

            <Typography variant="h5" className="font-semibold">
              {t('title')}
            </Typography>

            <Link href={withLocale("/admin/availableCategory/addCategory")}>
              <MainButton
                text={t('addNew')}
                className="bg-primary text-white px-5 py-3 rounded-md"
              />
            </Link>

          </div>

          <div className="w-full max-w-6xl mx-auto mb-16 overflow-x-auto">
            <DataTable<Category>
              columns={columns}
              rows={category}
              rowKey={(row) => row._id}
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