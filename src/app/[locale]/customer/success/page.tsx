"use client";

import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderDetails");
  const t = useTranslations("orderDetails");

  return (
    <div className="text-center   my-50 flex flex-col items-center gap-4">

      {/* Success Icon */}
      <CheckCircleIcon sx={{ fontSize: 80, color: "green" }} />

      {/* Title */}
      <Typography variant="h5">
        {t("order_success_title")}
      </Typography>

      {/* Order ID */}
      {orderId && (
        <Typography variant="body1">
          {t("order_id")}: {orderId}
        </Typography>
      )}

      {/* Message */}
      <Typography variant="body2" color="text.secondary" className="">
        {t("order_success_message")}
      </Typography>

    </div>
  );
}