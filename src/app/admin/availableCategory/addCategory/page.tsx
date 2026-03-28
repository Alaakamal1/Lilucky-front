"use client";
import { useState } from "react";
import { Typography } from "@mui/material";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import Dropdown from "@/src/components/ui/DropDown";

const Page = () => {
  const [arName, setArName] = useState("");
  const [enName, setEnName] = useState("");
  const [arNameError, setArNameError] = useState("");
  const [enNameError, setEnNameError] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleCategoryArabicNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setArName(value);
  };

  const handleCategoryEnglishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEnName(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const res = await fetch("http://localhost:5000/api/category/add-category", {
    method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ مهم جدًا
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
      console.log(data);
      if (res.ok) {
        setArName("");
        setEnName("");
        setCategoryType("");
        setIsActive(true);
      } else {
        alert("حدث خطأ: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("فشل الاتصال بالخادم");
    }
  };

  return (
    <div className="w-full">
      <div className="md:w-3xl flex bg-background my-5 p-6 rounded-md mx-20 shadow-md flex-col gap-4">
        <Typography variant="h4" className="mb-4 text-primary">
          إضافة فئة جديدة
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="h5" className="mb-4 text-secondary-text">
            البيانات العامة للفئة
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <InputField
                label="اسم الفئة بالعربي"
                type="text"
                value={arName}
                onChange={handleCategoryArabicNameChange}
                placeholder="اكتب اسم الفئة"
              />
              {arNameError && (
                <Typography className="text-red-500 text-sm mt-1">{arNameError}</Typography>
              )}
            </div>
          <div className="mb-6">
            <InputField
              label="الاسم الإنجليزي للفئة"
              type="text"
              value={enName}
              onChange={handleCategoryEnglishNameChange}
            />
               {enNameError && (
                <Typography className="text-red-500 text-sm mt-1">{enNameError}</Typography>
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
            text="إضافة فئة جديدة"
            className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md p-3"
          />
        </form>
      </div>
    </div>
  );
};
export default Page;