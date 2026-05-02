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
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations("categoryForm");
  const locale = useLocale();
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
        toast.error((err as Error).message || t("errors.fetch"));
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
      setArNameError(t("validation.arNameRequired"));
      return;
    }
    if (!enName.trim()) {
      setEnNameError(t("validation.enNameRequired"));
      return;
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error(t("errors.login"));
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
            ? t("success.updated")
            : t("success.created")
        );

        if (isEditMode) {
          setTimeout(() => {
            router.push(`/${locale}/admin/availableCategory`);
          }, 800);
        } else {
          setArName("");
          setEnName("");
          setCategoryType("");
          setIsActive(true);
        }
      } else {
        toast.error(data.message || t("errors.save"));
      }

    } catch (error: unknown) {
      toast.error((error as Error).message || t("errors.server"));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-start min-h-screen p-10 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper elevation={3} className="w-full max-w-3xl p-6 md:p-8 rounded-md">

        <Typography variant="h5" className="mb-6 text-primary text-center font-semibold">
          {isEditMode ? t("titleEdit") : t("titleAdd")}
        </Typography>

        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              <div>
                <InputField
                  label={t("arNameLabel")}
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
                  label={t("enNameLabel")}  
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
                  {t("typeLabel")}
                </label>

                <select
                  value={categoryType}
                  onChange={(e) =>
                    setCategoryType(e.target.value as CategoryType)
                  }
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                >
                  <option value="">{t("typePlaceholder")}</option>
                  <option value="all">{t("typeAll")}</option>
                  <option value="boys">{t("typeBoys")}</option>
                  <option value="girls">{t("typeGirls")}</option>
                </select>
              </div>

            </div>

            {/* Submit */}
            <MainButton
              type="submit"
              text={
                submitLoading
                  ? t("saving")
                  : isEditMode
                  ? t("submitEdit")
                  : t("submitAdd")
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