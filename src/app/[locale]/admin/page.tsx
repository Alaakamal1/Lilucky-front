
// "use client";

// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// import { useEffect, useState } from "react";


// /* ================= TYPES ================= */

// type ProductItem = {
//   name: string;
//   sold?: number;
//   stock?: number;
// };

// type DashboardData = {
//   financial: {
//     total_sales: number;
//     net_profit: number;
//     profit_margin: number;
//   };
//   orders: {
//     total_orders: number;
//     completed_orders: number;
//     cancelled_orders: number;
//   };
//   products: {
//     top_selling_products: ProductItem[];
//     low_selling_products: ProductItem[];
//     stock: ProductItem[];
//   };
// };

// /* ================= PAGE ================= */

// export default function DashboardPage() {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const res = await apiClient.get(`${Endpoints.baseUrl}/dashboard`);

//         const result = res?.data?.data;

//         setData(result ?? null);
//       } catch (error) {
//         console.error("Dashboard API Error:", error);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, []);

//   if (loading) return <p className="p-6">جاري التحميل...</p>;
//   if (!data) return <p className="p-6">لا توجد بيانات</p>;

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 w-full min-h-screen">

//       {/* المالية */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card title="إجمالي المبيعات" value={data.financial.total_sales} />
//         <Card title="صافي الربح" value={data.financial.net_profit} />
//         <Card
//           title="نسبة الربح %"
//           value={`${data.financial.profit_margin}%`}
//         />
//       </section>

//       {/* الطلبات */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card title="إجمالي الطلبات" value={data.orders.total_orders} />
//         <Card title="طلبات مكتملة" value={data.orders.completed_orders} />
//         <Card title="طلبات ملغية" value={data.orders.cancelled_orders} />
//       </section>

//       {/* المنتجات */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* الأكثر مبيعًا */}
//         <div className="bg-white p-4 rounded-xl shadow">
//           <h2 className="font-bold mb-3">المنتجات الأكثر مبيعًا</h2>

//           {data.products.top_selling_products.length > 0 ? (
//             data.products.top_selling_products.map((p, i) => (
//               <div key={i} className="flex justify-between border-b py-2">
//                 <span>{p.name}</span>
//                 <span>{p.sold ?? 0}</span>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400">لا توجد بيانات</p>
//           )}
//         </div>

//         {/* الأقل مبيعًا */}
//         <div className="bg-white p-4 rounded-xl shadow">
//           <h2 className="font-bold mb-3">المنتجات الأقل مبيعًا</h2>

//           {data.products.low_selling_products.length > 0 ? (
//             data.products.low_selling_products.map((p, i) => (
//               <div key={i} className="flex justify-between border-b py-2">
//                 <span>{p.name}</span>
//                 <span>{p.sold ?? 0}</span>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400">لا توجد بيانات</p>
//           )}
//         </div>
//       </div>

//       {/* المخزون */}
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h2 className="font-bold mb-3">المخزون</h2>

//         {data.products.stock.length > 0 ? (
//           data.products.stock.map((p, i) => (
//             <div key={i} className="flex justify-between border-b py-2">
//               <span>{p.name}</span>
//               <span>{p.stock ?? 0}</span>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">لا توجد بيانات</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= CARD ================= */

// type CardProps = {
//   title: string;
//   value: string | number;
// };

// function Card({ title, value }: CardProps) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow">
//       <p className="text-gray-500">{title}</p>
//       <h3 className="text-xl font-bold">{value}</h3>
//     </div>
//   );
// }


"use client";

import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { useEffect, useState } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import { translations } from "@/src/locales";

/* ================= TYPES ================= */

type ProductItem = {
  name: string;
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

  const { locale } = useLanguage(); // 👈 اللغة
  const t = translations[locale];   // 👈 الترجمة

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.baseUrl}/dashboard`);
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

  if (loading) return <p className="p-6">{t.loading}</p>;
  if (!data) return <p className="p-6">{t.noData}</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 w-full min-h-screen">

      {/* المالية */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title={t.totalSales} value={data.financial.total_sales} />
        <Card title={t.netProfit} value={data.financial.net_profit} />
        <Card
          title={t.profitMargin}
          value={`${data.financial.profit_margin}%`}
        />
      </section>

      {/* الطلبات */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title={t.totalOrders} value={data.orders.total_orders} />
        <Card title={t.completedOrders} value={data.orders.completed_orders} />
        <Card title={t.cancelledOrders} value={data.orders.cancelled_orders} />
      </section>

      {/* المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* الأكثر مبيعًا */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">{t.topSelling}</h2>

          {data.products.top_selling_products.length > 0 ? (
            data.products.top_selling_products.map((p, i) => (
              <div key={i} className="flex justify-between border-b py-2">
                <span>{p.name}</span>
                <span>{p.sold ?? 0}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">{t.noData}</p>
          )}
        </div>

        {/* الأقل مبيعًا */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">{t.lowSelling}</h2>

          {data.products.low_selling_products.length > 0 ? (
            data.products.low_selling_products.map((p, i) => (
              <div key={i} className="flex justify-between border-b py-2">
                <span>{p.name}</span>
                <span>{p.sold ?? 0}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">{t.noData}</p>
          )}
        </div>
      </div>

      {/* المخزون */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">{t.stock}</h2>

        {data.products.stock.length > 0 ? (
          data.products.stock.map((p, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{p.name}</span>
              <span>{p.stock ?? 0}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">{t.noData}</p>
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
      <p className="text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}