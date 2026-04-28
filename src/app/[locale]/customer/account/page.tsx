"use client";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { TextField, Button, Avatar, Tabs, Tab } from "@mui/material";
import { Endpoints } from "@/src/utils/endpoints";
import { apiClient } from "@/src/utils/apiClient";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations("account");
  const [tab, setTab] = useState(0);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    governorate: "",
    address: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/customer/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiClient.get(Endpoints.account, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data?.data || res.data;

        setUser({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          city: data.city || "",
          governorate: data.governorate || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      await apiClient.patch(`${Endpoints.user}/update`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 mb-8">

          <Button
            variant="outlined"
            onClick={() => (edit ? handleSave() : setEdit(true))}
            startIcon={edit ? <SaveIcon /> : <EditIcon />}
            sx={{
              gap: "6px",
              borderColor: "#eabebe",
              color: "#eabebe",
              "&:hover": {
                borderColor: "#d89b9b",
                backgroundColor: "rgba(234,190,190,0.1)",
              },
            }}
          >
            {edit ? t("save") : t("edit")}
          </Button>

          <div className="flex items-center gap-4">
            <Avatar sx={{ width: 70, height: 70, bgcolor: "#eabebe" }}>
              {user.firstName?.[0] || "U"}
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500">{t("user_account")}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          className="mb-6"
        >
          <Tab label={t("tabs.personal")} />
          <Tab label={t("tabs.orders")} />
          <Tab label={t("tabs.addresses")} />
        </Tabs>

        {/* Personal Info */}
        {tab === 0 && (
          <Card className="shadow-md">
            <CardContent className="grid md:grid-cols-2 gap-4">

              <TextField
                label={t("fields.first_name")}
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
              />

              <TextField
                label={t("fields.last_name")}
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
              />

              <TextField
                label={t("fields.email")}
                value={user.email}
                disabled
                fullWidth
              />

              <TextField
                label={t("fields.phone")}
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
              />

              <TextField
                label={t("fields.city")}
                name="city"
                value={user.city}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
              />

              <TextField
                label={t("fields.governorate")}
                name="governorate"
                value={user.governorate}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
              />

              <TextField
                label={t("fields.address")}
                name="address"
                value={user.address}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
              />

            </CardContent>
          </Card>
        )}

        {/* Orders */}
        {tab === 1 && (
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">
                {t("tabs.orders")}
              </h2>
              <div className="text-gray-500">
                {t("orders.empty")}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Addresses */}
        {tab === 2 && (
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">
                {t("tabs.addresses")}
              </h2>
              <div className="text-gray-500">
                {t("addresses.empty")}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}