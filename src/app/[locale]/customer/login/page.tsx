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
import { useTranslations } from "next-intl";

const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "invalid_email";
  return "";
};

const validatePassword = (value: string) => {
  if (!value || value.length < 6) return "invalid_password";
  return "";
};

const Page = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const t = useTranslations("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      setFormError(t("errors.form"));
      return;
    }

    setFormError("");

    try {
      const res = await apiClient.post(
        Endpoints.login,
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

        if (role === "client") router.push("/customer/products");
        else if (role === "admin") router.push("/admin");

      } else {
        setFormError(result.message || t("errors.login"));
      }

    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;

      if (error.response?.data?.message) {
        setFormError(error.response.data.message);
      } else {
        setFormError(t("errors.server"));
      }
    }
  };

  const isFormValid = email && password;

  const mergeWishlist = async () => {
    const wishlist = JSON.parse(sessionStorage.getItem("wishlist") || "[]");
    const token = sessionStorage.getItem("token");

    if (!wishlist.length || !token) return;

    await apiClient.post(
      `${Endpoints.products}/merge-wishlist`,
      { productIds: wishlist },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    sessionStorage.removeItem("wishlist");
  };

  return (
    <div className="md:flex md:flex-row justify-between items-center gap-6">

      <div className="bg-background p-10 rounded-2xl w-full md:mx-30 md:w-4/12 shadow-xl max-md:absolute z-1 max-md:top-50 max-md:opacity-96">

        <form onSubmit={handleSubmit}>

          <Typography variant="h4" className="mb-4 text-center text-primary">
            {t("title")}
          </Typography>

          {formError && (
            <Typography className="text-red-600 text-center mb-4">
              {formError}
            </Typography>
          )}

          <div className="w-full max-w-sm mx-auto flex flex-col gap-4">

            {/* Email */}
            <div>
              <InputField
                label={t("email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailError(validateEmail(email))}
                placeholder={t("email_placeholder")}
              />

              {emailError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${emailError}`)}
                </Typography>
              )}
            </div>

            {/* Password */}
            <div>
              <InputField
                label={t("password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordError(validatePassword(password))}
                placeholder={t("password_placeholder")}
              />

              {passwordError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${passwordError}`)}
                </Typography>
              )}
            </div>

            {/* Signup link */}
            <div className="flex justify-between">
              <Link href="/customer/signup">
                <Typography className="text-secondary-text hover:secondary-text-hover cursor-pointer">
                  {t("no_account")}
                </Typography>
              </Link>
            </div>

            {/* Submit */}
            <MainButton
              type="submit"
              text={t("login_button")}
              className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 px-6 bg-primary cursor-pointer"
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