// "use client";

// import { useEffect, useState } from "react";
// import { shippingService } from "@/services/shipping.service";
// import { Shipping } from "../interfaces/Shipping";

// export const useShipping = () => {
//   const [rows, setRows] = useState<Shipping[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchShipping = async () => {
//     setLoading(true);
//     const data = await shippingService.getAll();
//     setRows(data);
//     setLoading(false);
//   };

//   const addShipping = async (data: Shipping) => {
//     const res = await shippingService.create(data);
//     setRows((prev) => [...prev, res]);
//   };

//   const deleteShipping = async (id: string) => {
//     await shippingService.delete(id);
//     setRows((prev) => prev.filter((r) => r._id !== id));
//   };

//   useEffect(() => {
//     fetchShipping();
//   }, []);

//   return {
//     rows,
//     loading,
//     addShipping,
//     deleteShipping,
//     fetchShipping,
//   };
// };