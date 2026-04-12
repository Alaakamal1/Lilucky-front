"use client";

import { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const router = useRouter();

  const [arName, setArName] = useState("");
  const [enName, setEnName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [arNameError, setArNameError] = useState("");
  const [enNameError, setEnNameError] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const isEditMode = !!id;
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/category/get-category/${id}`);
        const data = await res.json();
              console.log("API RESPONSE:", data);

        if (res.ok) {
          const category = data.data;
          setArName(category.arName || "");
          setEnName(category.enName || "");
          setCategoryType(category.categoryType || "");
        } else {
          toast.error("فشل في تحميل البيانات");
        }
      } catch (err) {
        toast.error("خطأ في الاتصال بالخادم");
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
    try {
      setSubmitLoading(true);
      const url = isEditMode
        ? `http://localhost:5000/api/category/editCategory/${id}`
        : "http://localhost:5000/api/category/add-category";

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
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          isEditMode
            ? "تم تعديل الفئة بنجاح "
            : "تم إنشاء الفئة بنجاح "
        );

        if (isEditMode) {
          setTimeout(() => {
            router.push("/admin/availableCategory");
          }, 1000);
        } else {
          setArName("");
          setEnName("");
          setCategoryType("");
          setIsActive(true);
        }
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="md:w-3xl flex bg-background my-5 p-6 rounded-md mx-20 shadow-md flex-col gap-4">
        <Typography variant="h4" className="mb-4 text-primary">
          {isEditMode ? "تعديل فئة" : "إضافة فئة جديدة"}
        </Typography>

        {loading ? (
          <div className="flex justify-center my-10">
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div>
                <InputField
                  label="اسم الفئة بالعربي"
                  type="text"
                  value={arName}
                  onChange={(e: any) => {
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

              <div>
                <InputField
                  label="الاسم الإنجليزي للفئة"
                  type="text"
                  value={enName}
                  onChange={(e: any) => {
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

              <div>
                <label>Category Type:</label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="all">All</option>
                </select>
              </div>

            </div>

            <MainButton
              type="submit"
              text={submitLoading
                ? "جاري الحفظ..."
                : isEditMode
                  ? "تعديل الفئة"
                  : "إضافة فئة جديدة"
              }
              className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md p-3"
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Page;