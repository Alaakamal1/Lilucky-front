"use client";

import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { I18nText } from "@/src/interfaces/product";

/* ================= TYPES ================= */

type ProductItem = {
  name: I18nText;
  sold?: number;
  stock?: number;
};

type DashboardData = {
  financial: {
    total_sales: number;
    net_profit: number;
    profit_margin: number;
  };

  orders: {
    total_orders: number;
    completed_orders: number;
    cancelled_orders: number;
  };

  products: {
    top_selling_products: ProductItem[];
    low_selling_products: ProductItem[];
    stock: ProductItem[];
  };
};

/* ================= PAGE ================= */

export default function DashboardPage() {

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const t = useTranslations();

  const locale = useLocale() as "en" | "ar";

  /* ================= GET TEXT ================= */

  const getText = (field?: I18nText) => {

    if (!field) return "";

    return locale === "ar"
      ? field.ar || field.en || ""
      : field.en || field.ar || "";
  };

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const res = await apiClient.get(
          `${Endpoints.baseUrl}/dashboard`
        );

        const result = res?.data?.data;

        setData(result ?? null);

      } catch (error) {

        console.error("Dashboard API Error:", error);

        setData(null);

      } finally {

        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <p className="p-6">
        {t("dashboard.loading")}
      </p>
    );
  }

  if (!data) {
    return (
      <p className="p-6">
        {t("dashboard.noData")}
      </p>
    );
  }

  /* ================= UI ================= */

  return (

    <div className="p-6 space-y-6 bg-gray-50 w-full min-h-screen">

      {/* ================= FINANCIAL ================= */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card
          title={t("dashboard.financial.totalSales")}
          value={data.financial.total_sales}
        />

        <Card
          title={t("dashboard.financial.netProfit")}
          value={data.financial.net_profit}
        />

        <Card
          title={t("dashboard.financial.profitMargin")}
          value={`${data.financial.profit_margin}%`}
        />

      </section>

      {/* ================= ORDERS ================= */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card
          title={t("dashboard.orders.totalOrders")}
          value={data.orders.total_orders}
        />

        <Card
          title={t("dashboard.orders.completedOrders")}
          value={data.orders.completed_orders}
        />

        <Card
          title={t("dashboard.orders.cancelledOrders")}
          value={data.orders.cancelled_orders}
        />

      </section>

      {/* ================= PRODUCTS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= TOP SELLING ================= */}

        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="font-bold mb-3">
            {t("dashboard.products.topSellingTitle")}
          </h2>

          {data.products.top_selling_products.length > 0 ? (

            data.products.top_selling_products.map((p, i) => (

              <div
                key={i}
                className="flex justify-between border-b py-2"
              >

                <span>{getText(p.name)}</span>

                <span>{p.sold ?? 0}</span>

              </div>
            ))

          ) : (

            <p className="text-gray-400">
              {t("dashboard.noData")}
            </p>

          )}

        </div>

        {/* ================= LOW SELLING ================= */}

        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="font-bold mb-3">
            {t("dashboard.products.lowSellingTitle")}
          </h2>

          {data.products.low_selling_products.length > 0 ? (

            data.products.low_selling_products.map((p, i) => (

              <div
                key={i}
                className="flex justify-between border-b py-2"
              >

                <span>{getText(p.name)}</span>

                <span>{p.sold ?? 0}</span>

              </div>
            ))

          ) : (

            <p className="text-gray-400">
              {t("dashboard.noData")}
            </p>

          )}

        </div>

      </div>

      {/* ================= STOCK ================= */}

      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-bold mb-3">
          {t("dashboard.products.stockTitle")}
        </h2>

        {data.products.stock.length > 0 ? (

          data.products.stock.map((p, i) => (

            <div
              key={i}
              className="flex justify-between border-b py-2"
            >

              <span>{getText(p.name)}</span>

              <span>{p.stock ?? 0}</span>

            </div>
          ))

        ) : (

          <p className="text-gray-400">
            {t("dashboard.noData")}
          </p>

        )}

      </div>

    </div>
  );
}

/* ================= CARD ================= */

type CardProps = {
  title: string;
  value: string | number;
};

function Card({ title, value }: CardProps) {

  return (

    <div className="bg-white p-4 rounded-xl shadow">

      <p className="text-gray-500">
        {title}
      </p>

      <h3 className="text-xl font-bold">
        {value}
      </h3>

    </div>
  );
}