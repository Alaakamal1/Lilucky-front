"use client";
import { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  Box,
} from "@mui/material";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";

type CategoryType = "boys" | "girls" | "all";

type CategoryResponse = {
  success: boolean;
  data: {
    arName: string;
    enName: string;
    categoryType: CategoryType;
    isActive?: boolean;
  };
};

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [arName, setArName] = useState("");
  const [enName, setEnName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType | "">("");
  const [isActive, setIsActive] = useState(true);
  const [arNameError, setArNameError] = useState("");
  const [enNameError, setEnNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const isEditMode = Boolean(id);
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(
          `${Endpoints.category}/get-category/${id}`
        );

        const category: CategoryResponse["data"] = res.data.data;

        setArName(category.arName || "");
        setEnName(category.enName || "");
        setCategoryType(category.categoryType || "");
        setIsActive(category.isActive ?? true);

      } catch (err: unknown) {
        toast.error((err as Error).message || "خطأ في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setArNameError("");
    setEnNameError("");
    if (!arName.trim()) {
      setArNameError("اسم الفئة العربية مطلوب");
      return;
    }
    if (!enName.trim()) {
      setEnNameError("اسم الفئة الإنجليزية مطلوب");
      return;
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول");
      return;
    }
    try {
      setSubmitLoading(true);
      const url = isEditMode
        ? `${Endpoints.category}/editCategory/${id}`
        : `${Endpoints.category}/add-category`;

      const method = isEditMode ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          arName,
          enName,
          categoryType,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          isEditMode
            ? "تم تعديل الفئة بنجاح"
            : "تم إنشاء الفئة بنجاح"
        );

        if (isEditMode) {
          setTimeout(() => {
            router.push("/admin/availableCategory");
          }, 800);
        } else {
          setArName("");
          setEnName("");
          setCategoryType("");
          setIsActive(true);
        }
      } else {
        toast.error(data.message || "حدث خطأ");
      }

    } catch (error: unknown) {
      toast.error((error as Error).message || "فشل الاتصال بالخادم");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-start min-h-screen p-10 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper elevation={3} className="w-full max-w-3xl p-6 md:p-8 rounded-md">

        {/* Title */}
        <Typography variant="h5" className="mb-6 text-primary text-center font-semibold">
          {isEditMode ? "تعديل فئة" : "إضافة فئة جديدة"}
        </Typography>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              {/* Arabic */}
              <div>
                <InputField
                  label="اسم الفئة بالعربي"
                  value={arName}
                  onChange={(e) => {
                    setArName(e.target.value);
                    setArNameError("");
                  }}
                />
                {arNameError && (
                  <Typography className="text-red-500 text-sm mt-1">
                    {arNameError}
                  </Typography>
                )}
              </div>

              {/* English */}
              <div>
                <InputField
                  label="الاسم الإنجليزي للفئة"
                  value={enName}
                  onChange={(e) => {
                    setEnName(e.target.value);
                    setEnNameError("");
                  }}
                />
                {enNameError && (
                  <Typography className="text-red-500 text-sm mt-1">
                    {enNameError}
                  </Typography>
                )}
              </div>

              {/* Type */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  نوع الفئة
                </label>

                <select
                  value={categoryType}
                  onChange={(e) =>
                    setCategoryType(e.target.value as CategoryType)
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="all">الكل</option>
                  <option value="boys">أولاد</option>
                  <option value="girls">بنات</option>
                </select>
              </div>

            </div>

            {/* Submit */}
            <MainButton
              type="submit"
              text={
                submitLoading
                  ? "جاري الحفظ..."
                  : isEditMode
                  ? "تعديل الفئة"
                  : "إضافة فئة"
              }
              className="w-full bg-primary text-white py-3 rounded-md"
            />

          </form>
        )}
      </Paper>
    </Box>
  );
};

export default Page;