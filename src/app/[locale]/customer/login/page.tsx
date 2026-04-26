'use client';

import { useState } from "react";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MainButton from "@/src/components/ui/MainButton";
import InputField from "@/src/components/ui/InputField";
import { Endpoints } from "@/src/utils/endpoints";
import { apiClient } from "@/src/utils/apiClient";
import { useUser } from "@/src/context/UserContext";
import { AxiosError } from "axios";


const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "الايميل غير صحيح";
  return "";
};

const validatePassword = (value: string) => {
  if (!value || value.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  return "";
};

const Page = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      setFormError("من فضلك صحح الأخطاء قبل تسجيل الدخول");
      return;
    }

    setFormError("");

    try {
      const res = await apiClient.post(
        `${Endpoints.login}`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = res.data;

      if (res.status === 200 || res.status === 201) {
        const token = result.data?.token;
        const role = result.data?.user?.role;

        if (token) {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("firstName", result.data.user?.firstName);
          setUser(result.data.user);
          await mergeWishlist();
        }
        console.log("ROLE:", role);
        if (role === "client") router.push("/customer/products");
        else if (role === "admin") router.push("/admin");

      } else {
        setFormError(result.message || "حدث خطأ في تسجيل الدخول");
      }
    } catch (err: unknown) {
    const error = err  as AxiosError<{ message?: string }>;
  if (error.response && error.response.data) {
    setFormError(error.response.data.message || "حدث خطأ في تسجيل الدخول");
  } else {
    setFormError("خطأ في الاتصال بالسيرفر");
  }
    }
  };
const isFormValid = email && password;
const mergeWishlist = async () => {
  const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
  const token = sessionStorage.getItem("token");
  if (!wishlist.length || !token) return;

  await apiClient.post(`${Endpoints.products}/merge-wishlist`, {
    productIds: wishlist,
  }, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

  sessionStorage.removeItem("wishlist");
};
  return (
    <div className="md:flex md:flex-row justify-between items-center gap-6">
      <div className="bg-background p-10 rounded-2xl w-full md:mx-30 md:w-4/12 shadow-xl max-md:absolute z-1 max-md:top-50 max-md:opacity-96">
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" className="mb-4 text-center text-primary">
            تسجيل الدخول
          </Typography>

          {formError && (
            <Typography className="text-red-600 text-center mb-4">{formError}</Typography>
          )}

          <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
            <div>
              <InputField
                label="الايميل"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="اكتب الايميل"
              />
              {emailError && (
                <Typography className="text-red-500 text-sm mt-1">{emailError}</Typography>
              )}
            </div>

            <div>
              <InputField
                label="كلمة المرور"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="كلمة المرور"
              />
              {passwordError && (
                <Typography className="text-red-500 text-sm mt-1">{passwordError}</Typography>
              )}
            </div>

            <div className="flex justify-between">
              <Link href="/customer/signup">
                <Typography
                  variant="body2"
                  gutterBottom
                  className="text-secondary-text hover:secondary-text-hover cursor-pointer"
                >
                  ليس لديك حساب؟ سجل الآن
                </Typography>
              </Link>
              {/* <Link href="/customer/forgetPassword">
              <Typography
                variant="body2"
                gutterBottom
                className="text-secondary-text hover:secondary-text-hover cursor-pointer"
              >
                نسيت كلمة السر؟
              </Typography>
              </Link> */}
            </div>

            <MainButton
              type="submit"
              text={"تسجيل الدخول"}
              className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 align-item px-6 bg-primary cursor-pointer"
              disabled={!isFormValid}
            />
          </div>
        </form>
      </div>
      <div className="relative md:w-6/12 w-full h-180 md:h-screen">
        <Image
          src="/login.jpg"
          alt="login"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default Page;
