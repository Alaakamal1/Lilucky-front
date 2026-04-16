'use client';

import { Typography, CircularProgress } from '@mui/material';
import DataTable from '@/src/components/ui/DataTable';
import { useEffect, useState } from 'react';

const Page = () => {
  const [rows, setRows] = useState([]);
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

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await fetch(
          'http://localhost:5000/api/orders/all_orders',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();

        const orders = Array.isArray(data)
          ? data
          : data.orders || data.data || [];

        const mapped = orders.map((order) => ({
          id: order._id,
          orderId: order._id.slice(-6), // رقم مختصر
          customerName:
            `${order.user?.firstName || ''} ${order.user?.lastName || ''}`,
          totalPrice: order.totalPrice || 0,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          paymentMethod: order.paymentMethod || 'cash',
          orderStatus: order.status || 'pending',
        }));

        setRows(mapped);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================= EDIT (status) =================
  const handleEdit = async (row) => {
    try {
      const newStatus = prompt(
        'Enter new status (pending / shipped / delivered)',
        row.orderStatus
      );

      const token = sessionStorage.getItem('token');

      const res = await fetch(
        `http://localhost:5000/api/orders/${row.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error('Update failed');

      setRows((prev) =>
        prev.map((o) =>
          o.id === row.id ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE (frontend only or backend optional) =================
  const handleDelete = (row) => {
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