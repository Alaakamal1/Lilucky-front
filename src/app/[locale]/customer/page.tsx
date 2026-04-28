// "use client";
// import { Typography } from "@mui/material";
// import MainButton from "../../components/ui/MainButton";
// import OptionSelector from "../../components/ui/OptionSelector";
// import CardItem from "@/src/components/ui/CardItem";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// import { Product } from "@/src/interfaces/product";
// export default function Page() {
//   const [size, setSize] = useState<string>("");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true);
//       try {
//         const query = new URLSearchParams();
//         const res = await apiClient.get(
//           `${Endpoints.products}/get-all?${query.toString()}`
//         );

//         if (res.status !== 200) throw new Error("Failed to fetch product data");

//         const data = res.data;
//         setProducts(data.data);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           console.log("Error fetching products:", err.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, []);
//   return (
//     <>
//       <div>
//         <div
//           className="h-screen bg-cover bg-center flex items-center justify-center  "
//           style={{
//             backgroundImage: "url('/Home 1.jpg')",
//           }}
//         >
//           <div className="flex flex-col min-w-10/12 items-end ">
//             <Typography variant="h4" component="h4" >
//               اختار الأجمل لطفلك..
//             </Typography>
//             <Typography variant="h4" component="h3">
//               لأن كل يوم يستاهل لوك جديد
//             </Typography>
//             <Link href="/customer/products">
//               <MainButton
//                 text="تسوق الان"
//                 className="cursor-pointer bg-background hover:bg-background-hover duration-300 ease-in-out rounded-md w-40 p-3 m-6 text-2xl text-secondary-text hover:text-secondary-text-hover"
//               />
//             </Link>
//           </div>
//         </div>

//         <div className=""></div>
//       </div>
//       <div className=" my-4">
//         <Typography
//           variant="h4"
//           component="h4"
//           className="text-primary-text text-center"
//         >
//           الأكتر مبيعا
//         </Typography>
//         <div className="grid grid-cols-3 md:grid-cols-3 gap-1 justify-items-center">
//           {products.length > 0 ? (
//             products.slice(0, 3).map((product) => (
//               <CardItem key={product._id} product={product} />
//             ))
//           ) : null}
//         </div>
//       </div>
//       <div>
//         <div
//           className="min-h-140 bg-cover bg-center flex  justify-center flex-col "
//           style={{
//             backgroundImage: "url('/Home 2.jpg')",
//           }}
//         >
//           <div className="flex flex-col mx-8">
//             <Typography variant="h3" component="h2" className="">
//               اختاري اللي يليق عليكِ
//             </Typography>

//           </div>
//           <Link href="/customer/products">
//             <MainButton
//               text="تسوق الان"
//               className="cursor-pointer bg-background hover:bg-background-hover duration-300 ease-in-out rounded-md w-40 p-3 m-10 text-2xl text-secondary-text hover:text-secondary-text-hover"
//             />
//           </Link>
//         </div>
//       </div>
//       <div className="my-6">
//         <Typography
//           variant="h4"
//           component="h4"
//           className="text-primary-text text-center"
//         >
//           اختار حسب الفئه العمريه
//         </Typography>
//         <div className="flex w-full justify-center items-center gap-6 flex-col md:flex-row my-16">
//           <OptionSelector
//             label=""
//             options={["1  سنه", "2 سنه", "3 سنوات", "4 سنوات", "5 سنوات", "6 سنوات", "7 سنوات", "8 سنوات"]}
//             selected={size}
//             onSelect={setSize}
//             className={
//               " p-6 border bg-primary-text hover:bg-primary-text-hover text-white  rounded-md cursor-pointer duration-300 easy-in"
//             }
//           />
//         </div>
//       </div>
//       <div
//         className="min-h-140 bg-cover bg-center flex  justify-center items-end flex-col px-12"
//         style={{
//           backgroundImage: "url('/Home 3.jpg')",
//         }}
//       >
//         <div className="w-full  h-25">
//           <Typography variant="h3" component="h3" className="">
// عروضنا مش بتتفوت
//           </Typography>
//         <Link href="/customer/products">
//           <MainButton
//             text="تسوق الان"
//             className="cursor-pointer bg-background hover:bg-background-hover duration-300 ease-in-out rounded-md w-40 p-3 m-10 text-2xl text-secondary-text hover:text-secondary-text-hover"
//           />
//         </Link>
//         </div>
//       </div>

//     </>
//   );
// }


"use client";

import { Typography } from "@mui/material";
import MainButton from "../../../components/ui/MainButton";
import OptionSelector from "../../../components/ui/OptionSelector";
import CardItem from "@/src/components/ui/CardItem";
import { Link } from "@/src/i18n/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Product } from "@/src/interfaces/product";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";


export default function Page() {
  const [size, setSize] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
const locale = useLocale();
  const t = useTranslations("home");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();

        const res = await apiClient.get(
          `${Endpoints.products}/get-all?${query.toString()}`
        );

        if (res.status !== 200) {
          throw new Error("Failed to fetch product data");
        }

        setProducts(res.data.data);
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  return (
    <>
      {/* HERO 1 */}
      <div
        className="h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/Home 1.jpg')" }}
      >
        <div className="flex flex-col min-w-10/12 items-end">
          <Typography variant="h5">
            {t("hero1Title")}
          </Typography>

          <Typography variant="h5">
            {t("hero1SubTitle")}
          </Typography>

          <Link href={`/${locale}/customer/products`}>
            <MainButton
              text={t("shopNow")}
              className="cursor-pointer bg-background hover:bg-background-hover duration-300 rounded-md w-40 p-3 m-6 text-2xl text-secondary-text"
            />
          </Link>
        </div>
      </div>

      {/* BEST SELLERS */}
      <div className="my-4">
        <Typography variant="h4" className="text-primary-text text-center">
          {t("bestSelling")}
        </Typography>

        <div className="grid grid-cols-3 gap-2 justify-items-center">
          {products.slice(0, 3).map((product) => (
            <CardItem key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* HERO 2 */}
      <div
        className="min-h-140 bg-cover bg-center flex justify-center flex-col"
        style={{ backgroundImage: "url('/Home 2.jpg')" }}
      >
        <div className="mx-8">
          <Typography variant="h4">
            {t("hero2Title")}
          </Typography>
        </div>

        <Link href={`/${locale}/customer/products`}>
          <MainButton
            text={t("shopNow")}
            className="cursor-pointer bg-background hover:bg-background-hover duration-300 rounded-md w-40 p-3 m-10 text-2xl text-secondary-text"
          />
        </Link>
      </div>

      {/* AGE FILTER */}
      <div className="my-6">
        <Typography variant="h4" className="text-primary-text text-center">
          {t("ageCategory")}
        </Typography>

        <div className="flex justify-center gap-6 flex-col md:flex-row my-16">
          <OptionSelector
            label=""
            options={[
              t("age1"),
              t("age2"),
              t("age3"),
              t("age4"),
              t("age5"),
              t("age6"),
              t("age7"),
              t("age8"),
            ]}
            selected={size}
            onSelect={setSize}
            className="p-6 border bg-primary-text text-white rounded-md cursor-pointer"
          />
        </div>
      </div>

      {/* HERO 3 */}
      <div
        className="min-h-140 bg-cover bg-center flex justify-center items-end flex-col px-12"
        style={{ backgroundImage: "url('/Home 3.jpg')" }}
      >
        <div className="w-full">
          <Typography variant="h4">
            {t("offersTitle")}
          </Typography>

          <Link href={`/${locale}/customer/products`}>
            <MainButton
              text={t("shopNow")}
              className="cursor-pointer bg-background hover:bg-background-hover duration-300 rounded-md w-40 p-3 m-10 text-2xl text-secondary-text"
            />
          </Link>
        </div>
      </div>
    </>
  );
}