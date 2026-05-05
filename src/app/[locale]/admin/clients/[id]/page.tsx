'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Box,
} from '@mui/material';
import { User } from '@/src/interfaces';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { useTranslations } from 'next-intl';

const Page = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("userDetails");
  const tr = useTranslations("common");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await apiClient.get(`${Endpoints.user}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status !== 200) throw new Error('Failed to fetch user');

        setUser(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!user) {
    return (
      <Typography className="text-center mt-10 text-gray-500">
        {t("not_found")}
      </Typography>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="w-full px-4 md:px-10 py-6">
      <Card className="shadow-md rounded-2xl">
        <CardContent>

          <Typography variant="h5" className="mb-4 text-secondary-text">
            {t("title")}
          </Typography>

          <Divider className="mb-4" />

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Info label={t("fields.firstName")} value={user.firstName} fallback={tr("notAvailable")} />
            <Info label={t("fields.lastName")} value={user.lastName} fallback={tr("notAvailable")} />
            <Info label={t("fields.email")} value={user.email} fallback={tr("notAvailable")} />
            <Info label={t("fields.phone")} value={user.phoneNumber} fallback={tr("notAvailable")} />
            <Info label={t("fields.city")} value={user.city} fallback={tr("notAvailable")} />
            <Info label={t("fields.governorate")} value={user.governorate} fallback={tr("notAvailable")} />
            <Info label={t("fields.address")} value={user.address} fallback={tr("notAvailable")} />
            <Info label={t("fields.role")} value={user.role} fallback={tr("notAvailable")} />

            <Info
              label={t("fields.createdAt")}
              value={new Date(user.createdAt).toLocaleDateString()}
              fallback={tr("notAvailable")}
            />

            <Info
              label={t("fields.updatedAt")}
              value={new Date(user.updatedAt).toLocaleDateString()}
              fallback={tr("notAvailable")}
            />

          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;


// ================= REUSABLE COMPONENT =================

const Info = ({
  label,
  value,
  fallback,
}: {
  label: string;
  value: string | null;
  fallback: string;
}) => (
  <div className="p-3 border rounded-lg bg-gray-50">
    <Typography variant="caption" className="text-gray-500">
      {label}
    </Typography>

    <Typography variant="body1" className="font-medium">
      {value || fallback}
    </Typography>
  </div>
);