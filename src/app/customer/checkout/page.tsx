"use client";

import { useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";
import MainButton from "@/src/components/ui/MainButton";
import { useRouter } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Cart } from "@/src/interfaces/Cart";
import { toast } from "react-toastify";

type DeliveryAddress = {
  city: string;
  governorate: string;
  address:string;
  phoneNumber: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart[]>([]);
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address,setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    if (!city || !governorate || !address || !phone) {
      toast.error("من فضلك املأ كل البيانات");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول");
      return;
    }

    setLoading(true);

    try {
      const deliveryAddress: DeliveryAddress = {
        city,
        governorate,
        address,
        phoneNumber: phone,
      };

      const res = await apiClient.post(
        `${Endpoints.order}/create`,
        {
          deliveryAddress,
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
        router.push("/customer/success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* TITLE */}
      <Typography variant="h4" className="text-primary mb-6">
        Checkout
      </Typography>
      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= LEFT: FORM ================= */}

        <TextField
          label="المحافظه"
          name="governorate"
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          fullWidth  
        />
        

        <div className="space-y-4">
          <input
            type="text"
            placeholder="العنوان التفصيلي"
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-primary"
          />
          <input
            type="text"
            placeholder="المدينة"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-primary"
          />

     <input
            type="text"
            placeholder="العنوان"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-primary"
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-primary"
          />

        </div>
        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <Typography variant="h6" className="mb-4">
            ملخص الطلب
          </Typography>

          <div className="space-y-3 max-h-80 overflow-auto">

            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">
                    {item.quantity} × {item.price}
                  </p>
                </div>

                <span className="text-primary font-semibold text-sm">
                  {(item.price * item.quantity).toFixed(2)} EGY
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