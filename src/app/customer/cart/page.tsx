'use client';

import { useEffect, useState } from "react";
import MainButton from "@/src/components/ui/MainButton";
import { Typography } from "@mui/material";
import Link from "next/link";
import RemoveShoppingCartSharpIcon from "@mui/icons-material/RemoveShoppingCartSharp";
import { useRouter } from "next/navigation";
import Counter from "@/src/components/ui/Counter";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock?: number;
}

const Page = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Fetch suggested products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setSuggestedProducts(data?.data?.slice(0, 4) || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchProducts();
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    saveCart(updated);
  };

  const updateQuantity = (index: number, value: number) => {
    const updated = [...cart];

    if (value < 1) return;

    updated[index].quantity = value;

    saveCart(updated);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-lvh flex flex-col items-center justify-center text-center">
        <RemoveShoppingCartSharpIcon fontSize="large" />

        <Typography variant="h5" className="mt-4">
          السلة فارغة
        </Typography>

        <Typography className="text-gray-500 mt-2">
          لم تقم بإضافة أي منتجات بعد
        </Typography>

        <Link href="/customer/products">
          <MainButton
            text="تصفح المنتجات"
            className="mt-6 bg-primary text-white px-6 py-2 rounded"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-lvh">

      <div className="mx-25">
        <Typography variant="h4">سلة المشتريات</Typography>
      </div>

      <div className="flex justify-evenly max-md:flex-col max-md:items-center">

        {/* TABLE */}
        <div className="min-w-xl max-w-xl overflow-x-auto">

          <table className="w-full border">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>المنتج</th>
                <th>المقاس</th>
                <th>اللون</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item, index) => (
                <tr
                  key={index}
                  className="text-center border-b hover:bg-gray-50"
                  onClick={() => router.push(`/product/${item.productId}`)}
                >

                  <td className="flex justify-center py-2">
                    <img
                      src={item.image}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>{item.size}</td>

                  <td>
                    <div
                      className="w-5 h-5 rounded-full mx-auto border"
                      style={{ backgroundColor: item.color }}
                    />
                  </td>

                  {/* ✅ COUNTER FIXED */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <Counter
                      value={item.quantity}
                      onChange={(val: number) =>
                        updateQuantity(index, val)
                      }
                      max={item.stock || 99}
                    />
                  </td>

                  <td>
                    {(item.price * item.quantity).toFixed(2)} EGY
                  </td>

                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(index);
                      }}
                      className="text-red-500"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div className="flex flex-col items-center py-4 border rounded-md">

          <Typography variant="h5">السعر الكلي</Typography>

          <Typography variant="h5">
            {totalPrice.toFixed(2)} EGY
          </Typography>

          <MainButton
            text="شراء"
            className="bg-secondary w-40 py-3 m-6"
          />
        </div>
      </div>

      {/* SUGGESTED */}
      <div className="text-center my-10 text-primary">
        <Typography variant="h4">منتجات ممكن تعجبك</Typography>

        <div className="grid grid-cols-4 gap-4 mt-6 px-10 max-md:grid-cols-1">

          {suggestedProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded p-3 cursor-pointer"
              onClick={() => router.push(`/product/${product._id}`)}
            >
              <img
                src={
                  product?.variants?.[0]?.images?.[0]?.startsWith("http")
                    ? product.variants[0].images[0]
                    : `http://localhost:5000/uploads/products/${product?.variants?.[0]?.images?.[0]}`
                }
                className="w-full h-40 object-cover rounded"
              />

              <Typography>{product.name}</Typography>
              <Typography className="text-gray-500">
                {product.price} EGY
              </Typography>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Page;