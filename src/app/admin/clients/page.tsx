'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import DataTable from '@/src/components/ui/DataTable';
import { apiClient } from '@/src/utils/apiClient';
import { Endpoints } from '@/src/utils/endpoints';
import { User } from '@/src/interfaces';
type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
};

const Page = () => {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [search, setSearch] = useState('');  
  const columns = [
    { id: 'name', label: 'اسم المستخدم' },
    { id: 'email', label: 'البريد الإلكتروني' },
    { id: 'phone', label: 'رقم الهاتف' },
    { id: 'role', label: 'الصلاحية' },
    { id: 'createdAt', label: 'تاريخ الإنشاء' },
    { id: 'actions', label: 'الإجراءات', isAction: true },
  ];
  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await apiClient.get(`${Endpoints.user}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        const users = Array.isArray(data.data) ? data.data : data;
        const mappedUsers: UserRow[] = users.map((user: User) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          role: user.role,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }));
        setRows(mappedUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= FILTER SEARCH ================= */
  const filteredRows = useMemo(() => {
    return rows.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  /* ================= DELETE ================= */
  const handleDeleteClick = (row: UserRow) => {
    setSelectedUser(row);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const token = sessionStorage.getItem('token');
      await apiClient.delete(
        `${Endpoints.user}/users/${selectedUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRows((prev) =>
        prev.filter((u) => u.id !== selectedUser.id)
      );
      setOpenDelete(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className="w-full px-4 md:px-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <Typography variant="h5" className="font-semibold text-secondary-text">
          إدارة المستخدمين
        </Typography>
        <TextField
          size="small"
          placeholder="ابحث باسم المستخدم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80"
        />

      </div>

      {/* Content */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="h-6 bg-gray-300 rounded w-40"></div>
      <div className="h-10 bg-gray-300 rounded w-40"></div>
    </div>

    {/* Table Skeleton */}
    <div className="w-full overflow-x-auto rounded-lg">
      <div className="min-w-[800px] space-y-3">

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
        ) : filteredRows.length === 0 ? (
          <Typography className="text-center text-gray-500 py-10">
            لا يوجد مستخدمين
          </Typography>

        ) : (
          <DataTable
            columns={columns}
            rows={filteredRows}
            rowKey="id"
            viewRoute={(row) => `/admin/clients/${row.id}`}
            onDelete={handleDeleteClick}
           actions={{ view: true, edit: false, delete: true }}

          />
        )}


      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>

        <DialogContent>
          هل أنت متأكد أنك تريد حذف المستخدم:
          <b> {selectedUser?.name}</b> ؟
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>إلغاء</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Page;