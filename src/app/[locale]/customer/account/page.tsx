// "use client";

// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/src/components/ui/Card";
// import { TextField, Button, Avatar, Tabs, Tab } from "@mui/material";
// import { Endpoints } from "@/src/utils/endpoints";
// import { apiClient } from "@/src/utils/apiClient";
// import { useRouter } from "next/navigation";
// import { useLocale, useTranslations } from "next-intl";

// export default function ProfilePage() {
//   const router = useRouter();
//   const t = useTranslations();
//   const [tab, setTab] = useState(0);
//   const [edit, setEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
// const [user, setUser] = useState({
//   firstName: "",
//   lastName: "",
//   email: "",
//   phoneNumber: "",

//   address: {
//     city: "",
//     governorate: "",
//     street: "",
//   }
// });

//   const local = useLocale();
//   useEffect(() => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       router.push(`${local}/customer/login`);
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await apiClient.get(Endpoints.account, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = res.data?.data || res.data;
//         setUser({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           email: data.email || "",
//           phoneNumber: data.phoneNumber || "",
//           address: {
//             city: data.address?.city || "",
//             governorate: data.address?.governorate || "",
//             street: data.address?.street || "",
//           }
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUser((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       const token = sessionStorage.getItem("token");

//       await apiClient.patch(`${Endpoints.user}/update`, user, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setEdit(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center mt-10">
//         {t("account.loading")}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 mb-8">

//           <Button
//             variant="outlined"
//             onClick={() => (edit ? handleSave() : setEdit(true))}
//             startIcon={edit ? <SaveIcon /> : <EditIcon />}
//             sx={{
//               gap: "6px",
//               borderColor: "#eabebe",
//               color: "#eabebe",
//               "&:hover": {
//                 borderColor: "#d89b9b",
//                 backgroundColor: "rgba(234,190,190,0.1)",
//               },
//             }}
//           >
//             {edit ? t("account.save") : t("account.edit")}
//           </Button>

//           <div className="flex items-center gap-4">
//             <Avatar sx={{ width: 70, height: 70, bgcolor: "#eabebe" }}>
//               {user.firstName?.[0] || "U"}
//             </Avatar>

//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {user.firstName} {user.lastName}
//               </h1>
//               <p className="text-gray-500">{t("account.user_account")}</p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs
//           value={tab}
//           onChange={(e, newValue) => setTab(newValue)}
//           textColor="inherit"
//           indicatorColor="secondary"
//           className="mb-6"
//         >
//           <Tab label={t("account.tabs.personal")} />
//           <Tab label={t("account.tabs.orders")} />
//           <Tab label={t("account.tabs.addresses")} />
//         </Tabs>

//         {/* Personal Info */}
//         {tab === 0 && (
//           <Card className="shadow-md">
//             <CardContent className="grid md:grid-cols-2 gap-4">

//               <TextField
//                 label={t("account.fields.first_name")}
//                 name="firstName"
//                 value={user.firstName}
//                 onChange={handleChange}
//                 disabled={!edit}
//                 fullWidth
//               />

//               <TextField
//                 label={t("account.fields.last_name")}
//                 name="lastName"
//                 value={user.lastName}
//                 onChange={handleChange}
//                 disabled={!edit}
//                 fullWidth
//               />

//               <TextField
//                 label={t("account.fields.email")}
//                 value={user.email}
//                 disabled
//                 fullWidth
//               />

//               <TextField
//                 label={t("account.fields.phone")}
//                 name="phoneNumber"
//                 value={user.phoneNumber}
//                 onChange={handleChange}
//                 disabled={!edit}
//                 fullWidth
//               />

//               <TextField
//                 label={t("account.fields.city")}
//                 name="city"
//                 value={t(`register.cities.${user.address.city}`)}
//                 onChange={handleChange}
//                 disabled={!edit}
//                 fullWidth
//               />

//               <TextField
//                 label={t("account.fields.governorate")}
//                 name="governorate"
//                 value={t(`register.governorates.${user.address.governorate}`)}
//                 onChange={handleChange}
//                 disabled={!edit}
//                 fullWidth
//               />

//               <TextField
//                 label={t("account.fields.street")}
//                 name="street"
//                 value={user.address.street}
//                 onChange={handleChange}
//                 disabled={!edit}
//                 fullWidth
//               />

//             </CardContent>
//           </Card>
//         )}

//         {/* Orders */}
//         {tab === 1 && (
//           <Card>
//             <CardContent>
//               <h2 className="text-lg font-semibold mb-4">
//                 {t("account.tabs.orders")}
//               </h2>
//               <div className="text-gray-500">
//                 {t("account.orders.empty")}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Addresses */}
//         {tab === 2 && (
//           <Card>
//             <CardContent>
//               <h2 className="text-lg font-semibold mb-4">
//                 {t("account.tabs.addresses")}
//               </h2>
//               <div className="text-gray-500">
//                 {t("account.addresses.empty")}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//       </div>
//     </div>
//   );
// }



"use client";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { TextField, Button, Avatar, Tabs, Tab, Chip } from "@mui/material";

import Dropdown from "@/src/components/ui/DropDown";
import egyptData from "@/src/data/egyptData.json";

import { Endpoints } from "@/src/utils/endpoints";
import { apiClient } from "@/src/utils/apiClient";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const [tab, setTab] = useState(0);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: {
      city: "",
      governorate: "",
      street: "",
    },
  });

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.push(`/${locale}/customer/login`);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiClient.get(Endpoints.account, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data?.data || res.data;

        setUser({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: {
            city: data.address?.city || "",
            governorate: data.address?.governorate || "",
            street: data.address?.street || "",
          },
        });

        fetchOrders(token);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, locale]);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async (token: string) => {
    try {
      const res = await apiClient.get(
        `${Endpoints.order}/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UPDATE USER ================= */
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      await apiClient.patch(`${Endpoints.user}/update`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CHANGE HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        {t("account.loading")}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 mb-8">

          <Button
            variant="outlined"
            onClick={() => (edit ? handleSave() : setEdit(true))}
            startIcon={edit ? <SaveIcon /> : <EditIcon />}
          >
            {edit ? t("account.save") : t("account.edit")}
          </Button>

          <div className="flex items-center gap-4">
            <Avatar sx={{ width: 70, height: 70, bgcolor: "#eabebe" }}>
              {user.firstName?.[0] || "U"}
            </Avatar>

            <div>
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500">
                {t("account.user_account")}
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label={t("account.tabs.personal")} />
          <Tab label={t("account.tabs.orders")} />
          <Tab label={t("account.tabs.addresses")} />
        </Tabs>

        {/* PERSONAL */}
        {tab === 0 && (
          <Card>
            <CardContent className="grid md:grid-cols-2 gap-4">

              <TextField
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
                label={t("account.fields.first_name")}
              />

              <TextField
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
                label={t("account.fields.last_name")}
              />

              <TextField
                value={user.email}
                disabled
                fullWidth
                label={t("account.fields.email")}
              />

              <TextField
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                disabled={!edit}
                fullWidth
                label={t("account.fields.phone")}
              />

              <TextField
                value={user.address.governorate}
                disabled
                fullWidth
                label={t("account.fields.governorate")}
              />

              <TextField
                value={user.address.city}
                disabled
                fullWidth
                label={t("account.fields.city")}
              />

              <TextField
                value={user.address.street}
                disabled
                fullWidth
                label={t("account.fields.street")}
              />

            </CardContent>
          </Card>
        )}

        {/* ORDERS */}
        {tab === 1 && (
          <Card>
            <CardContent>

              <h2 className="text-lg font-semibold mb-4">
                {t("account.tabs.orders")}
              </h2>

              {orders.length === 0 ? (
                <div className="text-gray-500">
                  {t("account.orders.empty")}
                </div>
              ) : (
                <div className="space-y-3">

                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >

                      <div>
                        <p className="font-medium">
                          #{order._id.slice(-6)}
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">

                        <span className="font-bold">
                          {order.totalAmount} EGP
                        </span>

                        <Chip
                          size="small"
                          label={t(`orderDetails.status.${order.orderStatus}`)}
                          color={
                            order.orderStatus === "pending"
                              ? "warning"
                              : order.orderStatus === "confirmed"
                              ? "info"
                              : order.orderStatus === "shipped"
                              ? "primary"
                              : order.orderStatus === "delivered"
                              ? "success"
                              : "error"
                          }
                        />

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </CardContent>
          </Card>
        )}

        {/* ADDRESSES */}
        {tab === 2 && (
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">
                {t("account.tabs.addresses")}
              </h2>

              <div className="text-gray-500">
                {t("account.addresses.empty")}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}