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
import { useLocale, useTranslations } from 'next-intl';

type UserRow = {
  _id: string;
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
  const locale = useLocale();
  const t =useTranslations("users")

  const columns = [
    { id: 'name', label: t("columns.name") },
    { id: 'email', label: t("columns.email") },
    { id: 'phone', label: t("columns.phone") },
    { id: 'role', label: t("columns.role") },
    { id: 'createdAt', label:  t("columns.createdAt")},
    { id: 'actions', label: t("columns.actions"), isAction: true },
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
          _id: user._id,
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

  /* ================= FILTER ================= */
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
        `${Endpoints.user}/users/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRows((prev) =>
        prev.filter((u) => u._id !== selectedUser._id)
      );

      setOpenDelete(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className="w-full px-4 md:px-10 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <Typography variant="h5" className="font-semibold text-secondary-text">
        { t("title")}
        </Typography>

        <TextField
          size="small"
          placeholder={t("search_placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80"
        />

      </div>

      {/* CONTENT */}
      {loading ? (
        <Typography>{t("loading")}</Typography>
      ) : filteredRows.length === 0 ? (
        <Typography className="text-center text-gray-500 py-10">
         {t("no_users")}
        </Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => row._id}
          viewRoute={(row) => `/${locale}/admin/clients/${row._id}`}
          onDelete={handleDeleteClick}
          actions={{ view: true, edit: false, delete: true }}
        />
      )}

      {/* DELETE DIALOG */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{t("delete_confirm_title")}</DialogTitle>

        <DialogContent>
         {t("delete_confirm_message")}
          <b> {selectedUser?.name}</b> ؟
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>{t("cancel")}</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
           {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Page;