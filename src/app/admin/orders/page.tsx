'use client';

import DataTable from '@/src/components/ui/DataTable';
import { Order, OrderStatus } from '@/src/interfaces/order';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

/* ✅ UI Model */
type OrderRow = {
  id: string;
  orderId: string;
  customerName: string;
  totalPrice: number;
  orderDate: string;
  paymentMethod: string;
  orderStatus: OrderStatus;
};

const Page = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns = [
    { id: 'orderId', label: 'رقم الطلب' },
    { id: 'customerName', label: 'اسم العميل' },
    { id: 'totalPrice', label: 'اجمالي السعر' },
    { id: 'orderDate', label: 'تاريخ العملية' },
    { id: 'paymentMethod', label: 'طريقة الدفع' },
    { id: 'orderStatus', label: 'حالة الطلب' },
    { id: 'actions', label: 'تفاصيل / تعديل / حذف', isAction: true },
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');

        if (!token) throw new Error('No token');

        const res = await apiClient.get(`${Endpoints.order}/all_orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        const orders: Order[] = Array.isArray(data)
          ? data
          : data.orders || data.data || [];

        const mapped: OrderRow[] = orders.map((order) => ({
          id: order._id,
          orderId: order._id.slice(-6),

          customerName: order.userId
            ? typeof order.userId === 'string'
              ? order.userId
              : `${order.userId.firstName} ${order.userId.lastName}`
            : "---",

          totalPrice: order.totalAmount, // ✅ اسمه في backend كده
          orderDate: new Date(order.createdAt).toLocaleDateString(),

          paymentMethod: 'cash', // ❗ مش موجود في schema
          orderStatus: order.orderStatus,
        }));

        setRows(mapped);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= EDIT ================= */
  const handleEdit = async (row: OrderRow) => {
    try {
      const newStatus = prompt(
        'Enter new status (pending / confirmed / shipped / delivered / cancelled)',
        row.orderStatus
      ) as OrderStatus | null;

      if (!newStatus) return;

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token');

      await apiClient.patch(
        `${Endpoints.order}/${row.id}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRows((prev) =>
        prev.map((o) =>
          o.id === row.id ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (row: OrderRow) => {
    setRows((prev) => prev.filter((o) => o.id !== row.id));
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">

      <Typography variant="h5" className="mb-4 text-secondary-text">
        إدارة الطلبات
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : rows.length === 0 ? (
        <Typography className="text-center text-gray-500">
          لا يوجد طلبات
        </Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Page;