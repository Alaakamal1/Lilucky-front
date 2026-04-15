"use client";
import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { TextField, Button, Avatar, Tabs, Tab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function ProfilePage() {
    const [tab, setTab] = useState(0);
    const [edit, setEdit] = useState(false);

    const [user, setUser] = useState({
        firstName: "نورا",
        lastName: "علي",
        email: "nora@example.com",
        phone: "01000000000",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setEdit(false);
        console.log("Saved user:", user);
    };

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
                {user.firstName[0]}
                </Avatar>

                <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500">حساب ولي الأمر</p>
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
            <Tab label="العناوين" />
            </Tabs>

            {/* Personal Info */}
            {tab === 0 && (
            <Card className="shadow-md">
                <CardContent className="grid md:grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    label="الاسم الأول"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    disabled={!edit}
                />

                <TextField
                    fullWidth
                    label="اسم العائلة"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    disabled={!edit}
                />

                <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    name="email"
                    value={user.email}
                    disabled
                />

                <TextField
                    fullWidth
                    label="رقم الهاتف"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    disabled={!edit}
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

            {/* Addresses */}
            {tab === 2 && (
            <Card>
                <CardContent>
                <h2 className="text-lg font-semibold mb-4">العناوين المحفوظة</h2>
                <div className="text-gray-500">لا يوجد عناوين مضافة 📍</div>
                </CardContent>
            </Card>
            )}
        </div>
        </div>
    );
}


