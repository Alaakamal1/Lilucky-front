"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="text-center mt-20">
      <h1>🎉 Order Placed Successfully</h1>

      {orderId && (
        <p>Order ID: {orderId}</p>
      )}

      <p>Thank you for your purchase</p>
    </div>
  );
}