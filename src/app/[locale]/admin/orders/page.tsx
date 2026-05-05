'use client';

import DataTable, { Column } from '@/src/components/ui/DataTable';
import { Order, OrderStatus } from '@/src/interfaces/order';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import {
  Typography,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

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

/* ================= STATUS ================= */
const statusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

/* ================= COLORS ================= */
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'shipped':
      return 'bg-purple-100 text-purple-700';
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const Page = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const locale = useLocale();
  const t = useTranslations('admin_orders');

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (
    id: string,
    newStatus: OrderStatus
  ) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      await apiClient.patch(
        `${Endpoints.order}/${id}/status`,
        { orderStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRows((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= COLUMNS ================= */
  const columns: Column<OrderRow>[] = [
    { id: 'orderId', label: t('columns.orderId') },
    { id: 'customerName', label: t('columns.customerName') },
    { id: 'totalPrice', label: t('columns.totalPrice') },
    { id: 'orderDate', label: t('columns.orderDate') },
    { id: 'paymentMethod', label: t('columns.paymentMethod') },

    {
      id: 'orderStatus',
      label: t('columns.orderStatus'),
      render: (row: OrderRow) => (
        <Select
          value={row.orderStatus}
          size="small"
          onChange={(e) =>
            handleStatusChange(
              row._id,
              e.target.value as OrderStatus
            )
          }
          className={getStatusColor(row.orderStatus)}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {t(`status.${status}`)}
            </MenuItem>
          ))}
        </Select>
      ),
    },

    {
      id: 'actions',
      label: t('columns.actions'),
      isAction: true,
    },
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const res = await apiClient.get<any>(
          `${Endpoints.order}/all_orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const orders: Order[] = Array.isArray(res?.data?.data?.orders)
          ? res.data.data.orders
          : [];

        const mapped: OrderRow[] = orders.map((order) => ({
          _id: order._id ?? '',
          orderId: order._id?.slice(-6) ?? '---',

          customerName:
            typeof order.userId === 'object' && order.userId
              ? `${order.userId.firstName ?? ''} ${order.userId.lastName ?? ''}`
              : '---',

          totalPrice: order.totalAmount ?? 0,

          orderDate: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString(locale)
            : '---',

          paymentMethod: (order as any).paymentMethod ?? 'cash',
          orderStatus: order.orderStatus ?? 'pending',
        }));

        setRows(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [locale]);

  /* ================= SEARCH ================= */
  const filteredRows = useMemo(() => {
    return rows.filter((o) => {
      const q = search.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.orderId.toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

  /* ================= VIEW ================= */
  const handleView = (row: OrderRow) => {
    window.location.href = `/${locale}/admin/orders/${row._id}`;
  };

  /* ================= DELETE ================= */
  const handleDelete = (row: OrderRow) => {
    setRows((prev) => prev.filter((o) => o._id !== row._id));
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">

      <Typography variant="h5" className="mb-4 text-secondary-text">
        {t('title')}
      </Typography>

      {rows.length > 0 && (
        <input
          type="text"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3 mb-4"
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : rows.length === 0 ? (
        <Typography className="text-center text-gray-500">
          {t('no_orders')}
        </Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => row._id}
          onView={handleView}
          onEdit={() => {}}
          onDelete={handleDelete}
          actions={{ view: true, edit: false, delete: false }}
        />
      )}
    </div>
  );
};

export default Page;