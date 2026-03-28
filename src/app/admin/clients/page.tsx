'use client';
import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import ProductTable from '@/src/components/ui/BasicTable';

const Page = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'orderId', label: 'رقم العميل' },
    { id: 'customerName', label: 'اسم العميل' },
    { id: 'totalPrice', label: 'الايميل' },
    { id: 'orderDate', label: 'رقم الهاتف' },
    { id: 'paymentMethod', label: 'اخر عمليه' },
    { id: 'orderStatus', label: 'العنوان' },
    { id: 'actions', label: 'ملحوظات', isAction: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) throw new Error('Failed to fetch customers');
        const data = await res.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <Typography variant="body1" className="text-center">
              لا يوجد عملاء بعد
            </Typography>
            <Typography variant="body2" className="text-center text-gray-400">
              سيتم عرض العملاء هنا بمجرد إضافتهم.
            </Typography>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <Typography
                variant="h5"
                className="text-center md:text-left text-secondary-text mb-4 md:mb-0"
              >
                العملاء
              </Typography>
            </div>
            <div className="min-w-md md:min-w-lg lg:min-w-2xl">
              <ProductTable
                columns={columns}
                rows={rows}
                onEdit={(row) => console.log('Edit', row)}
                onDelete={(row) => console.log('Delete', row)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
