"use client";

import { useEffect, useState } from "react";
import MainButton from "@/src/components/ui/MainButton";
import { Typography } from "@mui/material";
import Link from "next/link";
import RemoveShoppingCartSharpIcon from "@mui/icons-material/RemoveShoppingCartSharp";
import Counter from "@/src/components/ui/Counter";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { useTranslations, useLocale } from "next-intl";

/* ================= TYPES ================= */

type CartItem = {
  _id: string;

  productId: {
    _id: string;
    name: string;
    price: number;
    stock?: number;
    variants?: {
      images?: string[];
    }[];
  } | null;

  quantity: number;
};

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CART ================= */

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await apiClient.get(`${Endpoints.cart}/get-cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cart = res.data?.data?.cart;

        setItems(cart?.items || []);
      } catch (err) {
        console.error("cart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ================= REMOVE ITEM ================= */

  const removeItem = async (index: number) => {
    try {
      const token = sessionStorage.getItem("token");

      const item = items[index];

      if (!item?.productId) return;

      await apiClient.delete(
        `${Endpoints.cart}/remove-from-cart/${item.productId._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = [...items];
      updated.splice(index, 1);

      setItems(updated);
    } catch (err) {
      console.error("delete error:", err);
    }
  };

  /* ================= UPDATE QTY ================= */

  const updateQuantity = (index: number, value: number) => {
    if (value < 1) return;

    const updated = [...items];
    updated[index].quantity = value;

    setItems(updated);
  };

  /* ================= TOTAL ================= */

  const totalPrice = items.reduce((sum, item) => {
    if (!item.productId) return sum;

    return sum + item.productId.price * item.quantity;
  }, 0);

  /* ================= EMPTY ================= */

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">

        <RemoveShoppingCartSharpIcon
          className="text-primary"
          sx={{ fontSize: 80 }}
        />

        <Typography
          variant="h5"
          className="mt-4 text-primary font-bold"
        >
          {t("empty")}
        </Typography>

        <Typography className="text-gray-500 mt-2">
          {t("empty_sub")}
        </Typography>

        <Link href={`/${locale}/customer/products`}>
          <MainButton
            text={t("browse")}
            className="mt-6 bg-primary text-white px-6 py-3"
          />
        </Link>

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background px-4 md:px-10 py-8">

      {/* TITLE */}
      <Typography
        variant="h4"
        className="text-primary mb-8 font-bold"
      >
        {t("title")}
      </Typography>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ================= TABLE ================= */}
        <div className="flex-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">

          <table className="w-full min-w-[700px] text-sm">

            <thead className="bg-thirdary text-primary">
              <tr>
                <th className="py-4 px-4 text-start">
                  Image
                </th>

                <th className="py-4 px-4 text-start">
                  {t("table.product")}
                </th>

                <th className="py-4 px-4 text-center">
                  {t("table.qty")}
                </th>

                <th className="py-4 px-4 text-center">
                  {t("table.price")}
                </th>

                <th className="py-4 px-4 text-center">
                  {t("table.delete")}
                </th>
              </tr>
            </thead>

            <tbody>

              {items.map((item, index) => {

                const image =
                  item.productId?.variants?.[0]?.images?.[0];

                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 duration-200"
                  >

                    {/* IMAGE */}
                    <td className="px-4 py-4">

                      {image ? (
                        <img
                          src={image}
                          alt={item.productId?.name}
                          className="w-16 h-16 rounded-xl object-cover border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-200" />
                      )}

                    </td>

                    {/* PRODUCT */}
                    <td className="px-4 py-4 font-semibold text-primary-text">

                      {item.productId?.name || "Deleted product"}

                    </td>

                    {/* QTY */}
                    <td className="px-4 py-4 text-center">

                      <Counter
                        value={item.quantity}
                        onChange={(val) =>
                          updateQuantity(index, val)
                        }
                        max={item.productId?.stock || 99}
                      />

                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-4 text-center font-bold text-primary">

                      {item.productId
                        ? (
                            item.productId.price *
                            item.quantity
                          ).toFixed(2)
                        : 0}{" "}
                      EGP

                    </td>

                    {/* DELETE */}
                    <td className="px-4 py-4 text-center">

                      <button
                        className="text-danger hover:opacity-70 duration-200"
                        onClick={() => removeItem(index)}
                      >
                        {t("table.delete")}
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* ================= SUMMARY ================= */}
        <div className="w-full lg:w-80 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">

          <Typography
            variant="h6"
            className="text-primary font-bold mb-4"
          >
            {t("total")}
          </Typography>

          <Typography
            variant="h4"
            className="font-bold text-primary"
          >
            {totalPrice.toFixed(2)} EGP
          </Typography>

          <Link href={`/${locale}/customer/checkout`}>

            <MainButton
              text={t("checkout")}
              className="w-full bg-primary text-white py-3 mt-6"
            />

          </Link>

        </div>

      </div>

    </div>
  );
}