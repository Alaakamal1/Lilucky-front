"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Typography, Chip, MenuItem, Select } from "@mui/material";
import { useTranslations } from "next-intl";
export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("");
  const t = useTranslations();

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await apiClient.get(`${Endpoints.order}/all_orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const found = res.data?.data?.orders?.find(
          (o: any) => o._id === id
        );
        console.log("Found order:", found);
        setOrder(found);
        setStatus(found?.orderStatus);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = sessionStorage.getItem("token");

      await apiClient.patch(
        `${Endpoints.order}/${order._id}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(newStatus);

      setOrder((prev: any) => ({
        ...prev,
        orderStatus: newStatus,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) {
    return (
      <div className="p-6 text-center">
        <Typography>{t("orderDetails.loading")}</Typography>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 w-full mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between ">
        <Typography variant="h5">
          {t("orderDetails.title")}
        </Typography>

        <Chip
          label={status}
          color={
            status === "pending"
              ? "warning"
              : status === "confirmed"
                ? "info"
                : status === "shipped"
                  ? "primary"
                  : status === "delivered"
                    ? "success"
                    : "error"
          }
        />
      </div>

      {/* CUSTOMER */}
      <div className="bg-white p-5 rounded-xl shadow">
        <Typography variant="h6" className="mb-3">
          {t("orderDetails.customerInfo")}
        </Typography>

        <p>
          {order.userId?.firstName} {order.userId?.lastName}
        </p>
        <p>{order.userId?.email}</p>
        <p>{order.userId?.phoneNumber}</p>
      </div>

      {/* ORDER INFO */}
      <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-2 gap-3">

        <div>
          <p>{t("orderDetails.subtotal")}: {order.subtotal}</p>
          <p>{t("orderDetails.shipping")}: {order.deliveryPrice}</p>
          <p className="font-bold">
            {t("orderDetails.total")}: {order.totalAmount}
          </p>
        </div>

        {/* STATUS CONTROL */}
        <div className="flex flex-col gap-2">
          <Typography variant="subtitle1">
            {t("orderDetails.changeStatus")}
          </Typography>

          <Select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            size="small"
          >
            <MenuItem value="pending">{t("orderDetails.status.pending")}</MenuItem>
            <MenuItem value="confirmed">{t("orderDetails.status.confirmed")}</MenuItem>
            <MenuItem value="shipped">{t("orderDetails.status.shipped")}</MenuItem>
            <MenuItem value="delivered">{t("orderDetails.status.delivered")}</MenuItem>
            <MenuItem value="cancelled">{t("orderDetails.status.cancelled")}</MenuItem>
          </Select>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <Typography variant="h6" className="mb-3">
          {t("orderDetails.address")}
        </Typography>
        <p>{t(`register.governorates.${order.deliveryAddress?.governorate}`)}</p>
        <p>{t(`register.cities.${order.deliveryAddress?.city}`)}</p>
        <p>{order.deliveryAddress?.street}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <Typography variant="h6" className="mb-3">
          {t("orderDetails.items")}
        </Typography>

        {order.items.map((item: any) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-2"
          >
            <span>{item.name}</span>
            <span>
              {item.quantity} × {item.price}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}