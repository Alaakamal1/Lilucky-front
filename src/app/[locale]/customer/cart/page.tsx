// "use client";

// import { useEffect, useState } from "react";
// import MainButton from "@/src/components/ui/MainButton";
// import { Typography } from "@mui/material";
// import Link from "next/link";
// import RemoveShoppingCartSharpIcon from "@mui/icons-material/RemoveShoppingCartSharp";
// import { useRouter } from "next/navigation";
// import Counter from "@/src/components/ui/Counter";
// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// import { Cart } from "@/src/interfaces/Cart";
// import { Product } from "@/src/interfaces/product";

// /* ================= TYPES ================= */


// const Page = () => {
//   const router = useRouter();
//   const [cart, setCart] = useState<Cart[]>(() => {
//     if (typeof window !== 'undefined') {
//       return JSON.parse(sessionStorage.getItem("cart") || "[]") as Cart[];
//     }
//     return [];
//   });
//   const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

//   /* ================= FETCH SUGGESTED ================= */
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = sessionStorage.getItem("token");
//         const res = await apiClient.get(`${Endpoints.cart}/cart`, {
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : undefined,
//         });
//         if (res.status !== 200) return;
//         setSuggestedProducts(res.data?.cart?.slice(0, 4) || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProducts();
//   }, []);

//   /* ================= TOTAL ================= */
//   const totalPrice = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   /* ================= SAVE ================= */
//   const saveCart = (updated: Cart[]) => {
//     setCart(updated);
//     sessionStorage.setItem("cart", JSON.stringify(updated));
//   };

//   const removeItem = (index: number) => {
//     const updated = [...cart];
//     updated.splice(index, 1);
//     saveCart(updated);
//   };

//   const updateQuantity = (index: number, value: number) => {
//     if (value < 1) return;
//     const updated = [...cart];
//     updated[index].quantity = value;
//     saveCart(updated);
//   };

//   /* ================= EMPTY ================= */
//   if (!cart.length) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center">
//         <RemoveShoppingCartSharpIcon fontSize="large" />

//         <Typography variant="h5" className="mt-4 text-primary">
//           السلة فارغة
//         </Typography>

//         <Typography className="text-gray-500 mt-2">
//           لم تقم بإضافة أي منتجات بعد
//         </Typography>

//         <Link href="/customer/products">
//           <MainButton
//             text="تصفح المنتجات"
//             className="mt-6 bg-primary text-white px-6 py-2"
//           />
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen px-4 md:px-10 py-6 bg-background">

//       {/* TITLE */}
//       <Typography variant="h4" className="text-primary mb-6">
//         سلة المشتريات
//       </Typography>

//       <div className="flex flex-col lg:flex-row gap-6 items-start">

//         {/* ================= TABLE ================= */}
//         <div className="flex-1">

//           <div className="overflow-x-auto rounded-lg border border-gray-200">

//             <table className="w-full text-center text-sm">

//               <thead className="bg-primary/10 text-primary">
//                 <tr>
//                   <th className="p-3">الصورة</th>
//                   <th>المنتج</th>
//                   <th>المقاس</th>
//                   <th>اللون</th>
//                   <th>الكمية</th>
//                   <th>السعر</th>
//                   <th>حذف</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {cart.map((item, index) => (
//                   <tr
//                     key={index}
//                     className="border-b hover:bg-gray-50 transition"
//                     onClick={() =>
//                       router.push(`/product/${item.productId}`)
//                     }
//                   >

//                     <td className="p-2 flex justify-center">
//                       <img
//                         src={item.image}
//                         className="w-14 h-14 rounded object-cover"
//                       />
//                     </td>

//                     <td className="text-gray-700">{item.name}</td>
//                     <td>{item.size}</td>

//                     <td>
//                       <div
//                         className="w-5 h-5 rounded-full mx-auto border"
//                         style={{ backgroundColor: item.color }}
//                       />
//                     </td>

//                     <td onClick={(e) => e.stopPropagation()}>
//                       <Counter
//                         value={item.quantity}
//                         onChange={(val) =>
//                           updateQuantity(index, val)
//                         }
//                         max={item.stock || 99}
//                       />
//                     </td>

//                     {/* 💰 PRICE (smaller + styled) */}
//                     <td className="text-primary font-medium text-sm">
//                       {(item.price * item.quantity).toFixed(2)} EGY
//                     </td>

//                     <td>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeItem(index);
//                         }}
//                         className="text-red-500 hover:text-red-700 text-sm"
//                       >
//                         حذف
//                       </button>
//                     </td>

//                   </tr>
//                 ))}

//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ================= SUMMARY ================= */}
//         <div className="w-full lg:w-72 border rounded-lg p-5 shadow-sm bg-white">

//           <Typography variant="h6" className="text-primary mb-2">
//             الإجمالي
//           </Typography>

//           <Typography variant="h5" className="text-secondary-text mb-4">
//             {totalPrice.toFixed(2)} EGY
//           </Typography>

//           <Link href={"/customer/checkout"}>
//           <MainButton
//             text="إتمام الشراء"
//             className="w-full bg-primary text-white py-3 cursor-pointer duration-300 ease-in-out rounded-md  text-xl my-4 hover:bg-primary-hover"
//           />
//           </Link>

//         </div>
//       </div>

//       {/* ================= SUGGESTED ================= */}
//       <div className="mt-10">

//         <Typography variant="h5" className="text-primary text-center mb-6">
//           منتجات ممكن تعجبك
//         </Typography>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//           {suggestedProducts.map((product) => (
//             <div
//               key={product._id}
//               className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition"
//               onClick={() =>
//                 router.push(`/product/${product._id}`)
//               }
//             >
//               <img
//                 src={
//                   product?.variants?.[0]?.images?.[0]?.startsWith("http")
//                     ? product.variants[0].images[0]
//                     : `${Endpoints.prodUrl}/uploads/products/${product?.variants?.[0]?.images?.[0]}`
//                 }
//                 className="w-full h-40 object-cover rounded"
//               />

//               <p className="mt-2 font-medium text-sm">
//                 {product.name}
//               </p>

//               <p className="text-primary text-sm">
//                 {product.price} EGY
//               </p>

//             </div>
//           ))}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;


"use client";

import { useEffect, useState } from "react";
import MainButton from "@/src/components/ui/MainButton";
import { Typography } from "@mui/material";
import Link from "next/link";
import RemoveShoppingCartSharpIcon from "@mui/icons-material/RemoveShoppingCartSharp";
import { useRouter } from "next/navigation";
import Counter from "@/src/components/ui/Counter";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Cart } from "@/src/interfaces/Cart";
import { Product } from "@/src/interfaces/product";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("cart");
  const router = useRouter();

  const [cart, setCart] = useState<Cart[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(sessionStorage.getItem("cart") || "[]") as Cart[];
    }
    return [];
  });

  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await apiClient.get(`${Endpoints.cart}/cart`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (res.status !== 200) return;

        setSuggestedProducts(res.data?.cart?.slice(0, 4) || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const saveCart = (updated: Cart[]) => {
    setCart(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    saveCart(updated);
  };

  const updateQuantity = (index: number, value: number) => {
    if (value < 1) return;
    const updated = [...cart];
    updated[index].quantity = value;
    saveCart(updated);
  };

  /* ================= EMPTY ================= */
  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <RemoveShoppingCartSharpIcon fontSize="large" />

        <Typography variant="h5" className="mt-4 text-primary">
          {t("empty")}
        </Typography>

        <Typography className="text-gray-500 mt-2">
          {t("empty_sub")}
        </Typography>

        <Link href="/customer/products">
          <MainButton
            text={t("browse")}
            className="mt-6 bg-primary text-white px-6 py-2"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-10 py-6 bg-background">

      <Typography variant="h4" className="text-primary mb-6">
        {t("title")}
      </Typography>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* TABLE */}
        <div className="flex-1 overflow-x-auto rounded-lg border">

          <table className="w-full text-center text-sm">

            <thead className="bg-primary/10 text-primary">
              <tr>
                <th>{t("table.image")}</th>
                <th>{t("table.product")}</th>
                <th>{t("table.size")}</th>
                <th>{t("table.color")}</th>
                <th>{t("table.qty")}</th>
                <th>{t("table.price")}</th>
                <th>{t("table.delete")}</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                  onClick={() => router.push(`/product/${item.productId}`)}
                >
                  <td>
                    <img src={item.image} className="w-14 h-14 rounded" />
                  </td>

                  <td>{item.name}</td>
                  <td>{item.size}</td>

                  <td>
                    <div
                      className="w-5 h-5 rounded-full mx-auto border"
                      style={{ backgroundColor: item.color }}
                    />
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <Counter
                      value={item.quantity}
                      onChange={(val) => updateQuantity(index, val)}
                      max={item.stock || 99}
                    />
                  </td>

                  <td className="text-primary font-medium text-sm">
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
                      {t("table.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* SUMMARY */}
        <div className="w-full lg:w-72 border rounded-lg p-5 bg-white">

          <Typography variant="h6" className="text-primary">
            {t("total")}
          </Typography>

          <Typography variant="h5">
            {totalPrice.toFixed(2)} EGY
          </Typography>

          <Link href="/customer/checkout">
            <MainButton
              text={t("checkout")}
              className="w-full bg-primary text-white py-3 mt-4"
            />
          </Link>

        </div>
      </div>

      {/* SUGGESTED */}
      <div className="mt-10">

        <Typography variant="h5" className="text-primary text-center mb-6">
          {t("suggested")}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {suggestedProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-3 cursor-pointer"
              onClick={() => router.push(`/product/${product._id}`)}
            >
              <img
                src={product?.variants?.[0]?.images?.[0]}
                className="w-full h-40 object-cover"
              />

              <p>{product.name}</p>
              <p className="text-primary">{product.price} EGY</p>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Page;