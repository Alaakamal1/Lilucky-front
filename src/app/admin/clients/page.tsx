'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import DataTable from '@/src/components/ui/DataTable';

const Page = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 التحكم في البوباب
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    { id: 'name', label: 'اسم المستخدم' },
    { id: 'email', label: 'البريد الإلكتروني' },
    { id: 'phone', label: 'رقم الهاتف' },
    { id: 'role', label: 'الصلاحية' },
    { id: 'createdAt', label: 'تاريخ الإنشاء' },
    { id: 'actions', label: 'الإجراءات', isAction: true },
  ];

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await fetch('http://localhost:5000/api/user/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('فشل في جلب المستخدمين');

        const data = await res.json();

        const users = Array.isArray(data.data) ? data.data : data;

        const mappedUsers = users.map((user) => ({
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

  // ================= EDIT =================
  const handleEdit = async (row) => {
    try {
      const newName = prompt('Enter new name', row.name);
      const newEmail = prompt('Enter new email', row.email);

      const token = sessionStorage.getItem('token');

      const res = await fetch(
        `http://localhost:5000/api/user/users/${row.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: newName?.split(' ')[0],
            lastName: newName?.split(' ')[1] || '',
            email: newEmail,
          }),
        }
      );

      if (!res.ok) throw new Error('Update failed');

      const updated = await res.json();

      setRows((prev) =>
        prev.map((u) =>
          u.id === row.id
            ? {
                ...u,
                name: `${updated.firstName} ${updated.lastName}`,
              }
            : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= OPEN DELETE POPUP =================
  const handleDeleteClick = (row) => {
    setSelectedUser(row);
    setOpenDelete(true);
  };

  // ================= CONFIRM DELETE =================
  const confirmDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const res = await fetch(
        `http://localhost:5000/api/user/users/${selectedUser.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Delete failed');

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
    <div className="w-full px-4 md:px-10 py-6">

      {/* Title */}
      <Typography variant="h5" className="text-secondary-text mb-4">
        إدارة المستخدمين
      </Typography>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : rows.length === 0 ? (
        <Typography className="text-center text-gray-500">
          لا يوجد مستخدمين
        </Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          viewRoute={(row) => `/admin/clients/${row.id}`}
          onEdit={handleEdit}
          onDelete={handleDeleteClick} // 🔥 مهم
        />
      )}

      {/* ================= DELETE POPUP ================= */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>

        <DialogContent>
          هل أنت متأكد أنك تريد حذف المستخدم:
          <b> {selectedUser?.name}</b> ؟
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            إلغاء
          </Button>

          <Button onClick={confirmDelete} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;