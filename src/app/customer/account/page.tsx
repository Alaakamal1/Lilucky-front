"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { TextField, Button, Avatar, Tabs, Tab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Endpoints } from "@/src/utils/endpoints";
import { apiClient } from "@/src/utils/apiClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";

export default function ProfilePage() {
    const router = useRouter();

    const [tab, setTab] = useState(0);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const { updateUser } = useUser();

    // ✅ initial safe state
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        city: "",
        governorate: "",
        address: "",
    });

    // ✅ fetch user data
    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            router.push("/customer/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await apiClient.get(Endpoints.account, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("token", token);
                console.log("-----------------------------------------------");
                console.log(Endpoints.account);
                console.log("API RESPONSE:", res.data);

                const data = res.data?.data || res.data;
                console.log("USER DATA:", data);

                setUser({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    city: data.city || "",
                    governorate: data.governorate || "",
                    address: data.address || "",
                });

            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // ✅ handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ✅ save updates
// const handleSave = async () => {
//     try {
//         const token = sessionStorage.getItem("token");

//         // ❗ لازم تخزني الريسبونس
//         const res = await apiClient.patch(
//             `${Endpoints.user}/update`,
//             user,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         // ❗ زي fetchUser بالظبط
//         const data = res.data?.data || res.data;

//         // ✅ update context
//         setUser({...data});

//         // ✅ update sessionStorage
//         sessionStorage.setItem("firstName", data.firstName);

//         setEdit(false);

//         console.log("UPDATED USER:", data);

//     } catch (err) {
//         console.error("Error updating user:", err);
//     }
// };

    const handleSave = async () => {
    try {
        const token = sessionStorage.getItem("token");

        // 💥 1. Optimistic Update (UI instantly)
        updateUser({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            city: user.city,
            governorate: user.governorate,
            address: user.address,
        });

        sessionStorage.setItem("firstName", user.firstName);

        setEdit(false);
        console.log("UPDATED USER:", user);

        // 💥 2. API call in background
        const res = await apiClient.patch(
            `${Endpoints.user}/update`,
            user,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = res.data?.data || res.data;

        // sync final data from backend
        updateUser(data);
        sessionStorage.setItem("firstName", data.firstName);

    } catch (err) {
        console.error("Error updating user:", err);

        // ❗ rollback 
        await refreshUser?.();
    }
};


    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 mb-8">

                    <Button
                        variant="outlined"
                        onClick={() => (edit ? handleSave() : setEdit(true))}
                        startIcon={edit ? <SaveIcon /> : <EditIcon />}
                        sx={{
                            gap: "6px",
                            borderColor: "#eabebe",
                            color: "#eabebe",
                            "&:hover": {
                                borderColor: "#d89b9b",
                                backgroundColor: "rgba(234,190,190,0.1)",
                            },
                        }}
                    >
                        {edit ? "حفظ" : "تعديل البيانات"}
                    </Button>

                    <div className="flex items-center gap-4">
                        <Avatar sx={{ width: 70, height: 70, bgcolor: "#eabebe" }}>
                            {user.firstName?.[0] || "U"}
                        </Avatar>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-gray-500">حساب المستخدم</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    textColor="inherit"
                    indicatorColor="secondary"
                    className="mb-6"
                >
                    <Tab label="البيانات الشخصية" />
                    <Tab label="الطلبات" />
                </Tabs>

                {/* Personal Info */}
                {tab === 0 && (
                    <Card className="shadow-md">
                        <CardContent className="grid md:grid-cols-2 gap-4">

                            <TextField
                                label="الاسم الأول"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                disabled={!edit}
                                fullWidth
                            />

                            <TextField
                                label="اسم العائلة"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                disabled={!edit}
                                fullWidth
                            />

                            <TextField
                                label="البريد الإلكتروني"
                                value={user.email}
                                disabled
                                fullWidth
                            />

                            <TextField
                                label="رقم الهاتف"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={handleChange}
                                disabled={!edit}
                                fullWidth
                            />

                            <TextField
                                label="المدينة"
                                name="city"
                                value={user.city}
                                onChange={handleChange}
                                disabled={!edit}
                                fullWidth
                            />

                            <TextField
                                label="المحافظة"
                                name="governorate"
                                value={user.governorate}
                                onChange={handleChange}
                                disabled={!edit}
                                fullWidth
                            />

                            <TextField
                                label="العنوان"
                                name="address"
                                value={user.address}
                                onChange={handleChange}
                                disabled={!edit}
                                fullWidth
                            />

                        </CardContent>
                    </Card>
                )}

                {/* Orders */}
                {tab === 1 && (
                    <Card>
                        <CardContent>
                        <h2 className="text-lg font-semibold mb-4">طلباتي</h2>
                        <div className="text-gray-500">لا يوجد طلبات حالياً 👕👶</div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}

function refreshUser() {
    throw new Error("Function not implemented.");
}
