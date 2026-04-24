'use client';

import DataTable from '@/src/components/ui/DataTable';
import { Order, OrderStatus } from '@/src/interfaces/order';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

/* ================= UI MODEL ================= */
type OrderRow = {
  _id: string;
  orderId: string;
  customerName: string;
  totalPrice: number;
  orderDate: string;
  paymentMethod: string;
  orderStatus: OrderStatus;
};

const Page = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'orderId', label: 'رقم الطلب' },
    { id: 'customerName', label: 'اسم العميل' },
    { id: 'totalPrice', label: 'اجمالي السعر' },
    { id: 'orderDate', label: 'تاريخ العملية' },
    { id: 'paymentMethod', label: 'طريقة الدفع' },
    { id: 'orderStatus', label: 'حالة الطلب' },
    { id: 'actions', label: 'تفاصيل / تعديل / حذف', isAction: true },
  ];

  /* ================= FETCH ORDERS (SAFE) ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const res = await apiClient.get(`${Endpoints.order}/all_orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        // 🔥 SAFE NORMALIZATION (fix map error)
        const orders: Order[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.orders)
              ? data.orders
              : Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data?.data?.orders)
                  ? data.data.orders
                  : [];

        const mapped: OrderRow[] = orders.map((order) => ({
          _id: order._id,
          orderId: order._id.slice(-6),

          customerName: order.userId
            ? typeof order.userId === 'string'
              ? order.userId
              : `${order.userId.firstName} ${order.userId.lastName}`
            : '---',

          totalPrice: order.totalAmount,
          orderDate: new Date(order.createdAt).toLocaleDateString(),

          paymentMethod: 'cash',
          orderStatus: order.orderStatus,
        }));

        setRows(mapped);
      } catch (err) {
        console.error('Fetch orders error:', err);
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
      if (!token) return;

      await apiClient.patch(
        `${Endpoints.order}/${row._id}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRows((prev) =>
        prev.map((o) =>
          o._id === row._id ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (row: OrderRow) => {
    setRows((prev) => prev.filter((o) => o._id !== row._id));
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
        <DataTable<OrderRow>
          columns={columns}
          rows={rows}
          rowKey={(row) => row._id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
};

export default Page;