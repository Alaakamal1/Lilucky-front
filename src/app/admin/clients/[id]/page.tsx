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

const Page = () => {
  const { id } = useParams();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await fetch(`http://localhost:5000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <Typography className="text-center mt-10 text-gray-500">
        لم يتم العثور على المستخدم
      </Typography>
    );
  }

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <Card className="shadow-md rounded-2xl">
        <CardContent>

          <Typography variant="h5" className="mb-4 text-secondary-text">
            تفاصيل المستخدم
          </Typography>

          <Divider className="mb-4" />

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Info label="الاسم الأول" value={user.firstName} />
            <Info label="الاسم الأخير" value={user.lastName} />
            <Info label="البريد الإلكتروني" value={user.email} />
            <Info label="رقم الهاتف" value={user.phoneNumber} />
            <Info label="المدينة" value={user.city} />
            <Info label="المحافظة" value={user.governorate} />
            <Info label="العنوان" value={user.address} />
            <Info label="توع المستخدم" value={user.role} />

            <Info
              label="تاريخ الإنشاء"
              value={new Date(user.createdAt).toLocaleDateString()}
            />

            <Info
              label="آخر تحديث"
              value={new Date(user.updatedAt).toLocaleDateString()}
            />

          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

/* 🔥 Component صغير لإعادة الاستخدام */
const Info = ({ label, value }: any) => (
  <div className="p-3 border rounded-lg bg-gray-50">
    <Typography variant="caption" className="text-gray-500">
      {label}
    </Typography>
    <Typography variant="body1" className="font-medium">
      {value || 'غير متوفر'}
    </Typography>
  </div>
);