"use client";

import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import MainButton from "@/src/components/ui/MainButton";
import { useRouter } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { useTranslations, useLocale } from "next-intl";

/* ================= TYPES ================= */

type CartItem = {
  productId: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: {
    city?: string;
    governorate?: string;
    street?: string;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("checkout");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [shippingPrice, setShippingPrice] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const [cartRes, userRes] = await Promise.all([
          apiClient.get(`${Endpoints.cart}/get-cart`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get(`${Endpoints.user}/account`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCart(cartRes.data?.data?.cart?.items || []);
        setUser(userRes.data?.data);

      } catch (err) {
        setError("Failed to load data");
      }
    };

    fetchData();
  }, []);

  /* ================= SHIPPING ================= */

  useEffect(() => {
    const fetchShipping = async () => {
      const token = sessionStorage.getItem("token");
      if (!token || !user?.address?.governorate) return;

      try {
        const res = await apiClient.get(
          `${Endpoints.shipping}/get-all-shipping`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const match = res.data.find(
          (item: any) =>
            item.governorate?.toLowerCase() ===
            user.address?.governorate?.toLowerCase()
        );

        setShippingPrice(match?.price || 0);
      } catch {}
    };

    fetchShipping();
  }, [user]);

  /* ================= TOTAL ================= */

  const productsTotal = cart.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  const totalPrice = productsTotal + shippingPrice;

  /* ================= CHECKOUT ================= */

  const handleCheckout = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) return setError("Login required");
    if (!user?.address) return setError("Address missing");

    setLoading(true);

    try {
      const res = await apiClient.post(
        `${Endpoints.order}/create-order`,
        {
          paymentMethod: "cash",
          deliveryAddress: {
            city: user.address.city,
            governorate: user.address.governorate,
            street: user.address.street,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201) {
        setSuccessMessage("Order created successfully");

        setTimeout(() => {
          router.push(`/${locale}/customer/success`);
        }, 1500);
      }

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <Typography variant="h4" className="text-primary mb-6">
        Checkout
      </Typography>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="grid md:grid-cols-2 gap-6">

        {/* CART */}
        <div className="border p-4 rounded-lg">

          <h2 className="font-bold mb-3">Order Summary</h2>

          {cart.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b">

              <span>{item.productId?.name}</span>

              <span>
                {item.quantity} × {item.productId?.price}
              </span>

            </div>
          ))}

          <div className="flex justify-between mt-3">
            <span>Shipping</span>
            <span>{shippingPrice}</span>
          </div>

          <div className="flex justify-between mt-4 font-bold">
            <span>Total</span>
            <span>{totalPrice}</span>
          </div>

        </div>

        {/* ADDRESS */}
        <div className="border p-4 rounded-lg">

          <h2 className="font-bold mb-3">Shipping Address</h2>

          <p>{user?.address?.city}</p>
          <p>{user?.address?.governorate}</p>
          <p>{user?.address?.street}</p>

          <MainButton
            text={loading ? "Processing..." : "Confirm Order"}
            onClick={handleCheckout}
            className="w-full mt-5 bg-primary text-white"
          />

        </div>

      </div>
    </div>
  );
}