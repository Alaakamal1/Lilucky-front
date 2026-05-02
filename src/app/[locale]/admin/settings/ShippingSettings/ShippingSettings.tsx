
// "use client"

// import { useEffect, useState } from "react";
// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// import { Shipping } from "@/src/interfaces/Shipping";
// import { toast } from "react-toastify";
// import { useTranslations } from "next-intl";
// import { Typography } from "@mui/material";

// export default function ShippingSettings() {
//   const [shipping, setShipping] = useState<Shipping[]>([]);
//   const [loading, setLoading] = useState(true);
//   const t = useTranslations();

//   useEffect(() => {
//     fetchShipping();
//   }, []);

//   // ======================
//   // GET ALL
//   // ======================
//   const fetchShipping = async () => {
//     const token = sessionStorage.getItem("token");

//     try {
//       const res = await apiClient(`${Endpoints.shipping}/get-all-shipping`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setShipping(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================
//   // CHANGE PRICE
//   // ======================
//   const handlePriceChange = (id: string, value: number) => {
//     setShipping((prev) =>
//       prev.map((item) =>
//         item._id === id
//           ? { ...item, price: value }
//           : item
//       )
//     );
//   };

//   // ======================
//   // TOGGLE ACTIVE
//   // ======================
//   const toggleActive = (id: string) => {
//     setShipping((prev) =>
//       prev.map((item) =>
//         item._id === id
//           ? { ...item, isActive: !item.isActive }
//           : item
//       )
//     );
//   };

//   // ======================
//   // SAVE SINGLE ROW
//   // ======================
//   const saveRow = async (item: Shipping) => {
//     try {
//       await apiClient(`${Endpoints.shipping}/update-shipping/${item._id}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//         },
//         data: {
//           price: item.price,
//           isActive: item.isActive,
//         },
//       });
//       toast.success(
//         `${t(`register.governorates.${item.governorate}`)} ${t("shipping.toast_update_success")}`
//       );
//     } catch (err) {
//       console.error(err);
//       toast.error(t("shipping.toast_update_error"));
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   ``
//   return (
//     <div className="w-full p-6 bg-white ">

//       <Typography variant="h4" className=" mb-4">
//         {t("shipping.title")}
//       </Typography>

//       <table className="w-full border-text-secondary rounded-lg overflow-hidden shadow-md">
//         <thead>
//           <tr className=" bg-thirdary text-secondary-text py-2 text-center">
//             <th className=" p-2">{t("shipping.governorate")}</th>
//             <th>{t("shipping.price")}</th>
//             <th>{t("shipping.active")}</th>
//             <th>{t("shipping.save")}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {shipping.map((item) => (
//             <tr key={item._id} className="border-b border-b-gray-50">
//               <td className="py-2 text-center">
//                 {t(`register.governorates.${item.governorate}`) || item.governorate}
//               </td>

//               {/* Price */}
//               <td className="text-center">
//                 <input
//                   type="number"
//                   min="0"
//                   value={item.price}
//                   onChange={(e) =>
//                     handlePriceChange(
//                       item._id,
//                       Number(e.target.value)
//                     )
//                   }
//                   className="border md:w-28 text-center"
//                 />
//               </td>
//               <td className="text-center">
//                 <button
//                   onClick={() => toggleActive(item._id)}
//                   className={` py-1 w-35 rounded ${item.isActive
//                     ? "bg-success text-white"
//                     : "bg-danger text-white"
//                     }`}
//                 >
//                   {item.isActive ? t("shipping.active_btn") : t("shipping.inactive_btn")}
//                 </button>
//               </td>

//               {/* Save */}
//               <td className="text-center">
//                 <button
//                   onClick={() => saveRow(item)}
//                   className="bg-primary text-white px-8 py-1 rounded"
//                 >
//                   {t("shipping.save")}
//                 </button>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Shipping } from "@/src/interfaces/Shipping";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";

export default function ShippingSettings() {
  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    fetchShipping();
  }, []);

  const fetchShipping = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await apiClient(`${Endpoints.shipping}/get-all-shipping`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShipping(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id: string, value: number) => {
    setShipping((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, price: value } : item
      )
    );
  };

  const toggleActive = (id: string) => {
    setShipping((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const saveRow = async (item: Shipping) => {
    try {
      await apiClient(`${Endpoints.shipping}/update-shipping/${item._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        data: {
          price: item.price,
          isActive: item.isActive,
        },
      });

      toast.success(
        `${t(`register.governorates.${item.governorate}`)} - ${t("shipping.toast_update_success")}`
      );
    } catch (err) {
      console.error(err);
      toast.error(t("shipping.toast_update_error"));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full p-6  text-secondary-text">

      <Typography variant="h4" className="mb-6 ">
        {t("shipping.title")}
      </Typography>

      <table className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">

        <thead className="bg-thirdary text-md">
          <tr>
            <th className="p-3 text-center border-b border-gray-200">
              {t("shipping.governorate")}
            </th>
            <th className="p-3 text-center border-b border-gray-200">
              {t("shipping.price")}
            </th>
            <th className="p-3 text-center border-b border-gray-200">
              {t("shipping.active")}
            </th>
            <th className="p-3 text-center border-b border-gray-200">
              {t("shipping.save")}
            </th>
          </tr>
        </thead>

        <tbody>
          {shipping.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >

              {/* Governorate */}
              <td className="py-3 text-center text-secondary-text">
                {t(`register.governorates.${item.governorate}`) || item.governorate}
              </td>

              {/* Price */}
              <td className="text-center">
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) =>
                    handlePriceChange(item._id, Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-md md:w-28 text-center py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </td>

              {/* Active */}
              <td className="text-center">
                <button
                  onClick={() => toggleActive(item._id)}
                  className={`py-1 px-6 rounded text-white transition ${
                    item.isActive ? "bg-success" : "bg-danger"
                  }`}
                >
                  {item.isActive
                    ? t("shipping.active_btn")
                    : t("shipping.inactive_btn")}
                </button>
              </td>

              {/* Save */}
              <td className="text-center">
                <button
                  onClick={() => saveRow(item)}
                  className="bg-primary text-white px-6 py-1 rounded hover:opacity-90 transition"
                >
                  {t("shipping.save")}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}