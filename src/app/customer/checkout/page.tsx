"use client";

import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import MainButton from "@/src/components/ui/MainButton";
import { useRouter } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";

/* ================= TYPES ================= */

type CartItem = {
  productId: {
    name: string;
    price: number;
  };
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* ================= LOAD CART ================= */

  useEffect(() => {
    const fetchCart = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await apiClient.get(`${Endpoints.cart}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart(res.data?.cart?.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  /* ================= TOTAL PRICE ================= */

  const totalPrice = cart.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  /* ================= CHECKOUT ================= */

  const handleCheckout = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      const res = await apiClient.post(
        `${Endpoints.order}/create`,
        {
          paymentMethod: "cash",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        sessionStorage.removeItem("cart");

        setSuccessMessage("تم تأكيد طلبك، طلبك قيد الانتظار ⏳");

        setTimeout(() => {
          router.push("/customer/success");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* TITLE */}
      <Typography variant="h4" className="text-primary mb-6">
        Checkout
      </Typography>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= SUMMARY ================= */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <Typography variant="h6" className="mb-4">
            ملخص الطلب
          </Typography>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center font-medium">
              {successMessage}
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-auto">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <div>
                  <p className="font-medium">{item.productId.name}</p>
                  <p className="text-gray-500">
                    {item.quantity} × {item.productId.price}
                  </p>
                </div>

                <span className="text-primary font-semibold">
                  {(item.productId.price * item.quantity).toFixed(2)} EGY
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between mt-5 font-bold text-lg">
            <span>الإجمالي</span>
            <span className="text-primary">
              {totalPrice.toFixed(2)} EGY
            </span>
          </div>

          {/* BUTTON */}
          <MainButton
            text={loading ? "جاري التنفيذ..." : "تأكيد الطلب"}
            onClick={handleCheckout}
            className="w-full mt-5 bg-primary text-white"
          />
        </div>
      </div>
    </div>
  );
}