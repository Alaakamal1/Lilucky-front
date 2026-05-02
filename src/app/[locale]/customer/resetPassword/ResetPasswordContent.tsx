// 'use client';

// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { apiClient } from "@/src/utils/apiClient";
// import { Endpoints } from "@/src/utils/endpoints";
// import InputField from "@/src/components/ui/InputField";
// import MainButton from "@/src/components/ui/MainButton";
// import { Typography } from "@mui/material";

// const ResetPasswordPage = () => {
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email") || "";
//   const router = useRouter();
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     try {
//       const res = await apiClient.post(Endpoints.resetPassword, {
//         email,
//         otp: Number(otp),
//         password,
//         confirmPassword,
//       });

//       if (res.status === 200) {
//         console.log("OTP:", otp);
//         router.push("/customer/login");
//       }
//     } catch (err: unknown) {
//       setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid OTP or expired");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form onSubmit={handleSubmit} className="w-96 p-6 shadow-lg rounded-xl bg-white">
//         <Typography variant="h5" className="text-center mb-4">
//           Reset Password
//         </Typography>

//         <InputField label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />

//         <InputField
//           label="New Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <InputField
//           label="Confirm Password"
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />

//         {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
//         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//         <MainButton text="Reset Password" type="submit" className="w-full mt-4" />
//       </form>
//     </div>
//   );
// };

// export default ResetPasswordPage;


'use client';

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import { Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";

const ResetPasswordPage = () => {
  const t = useTranslations("resetPassword");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await apiClient.post(Endpoints.resetPassword, {
        email,
        otp: Number(otp),
        password,
        confirmPassword,
      });

      if (res.status === 200) {
        setMessage(t("success"));
        router.push(`/${locale}/customer/login`);
      }

    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || t("error_default")
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 shadow-lg rounded-xl bg-white"
      >

        <Typography variant="h5" className="text-center mb-4">
          {t("title")}
        </Typography>

        <InputField
          label={t("otp_label")}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <InputField
          label={t("password_label")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <InputField
          label={t("confirm_label")}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {message && (
          <p className="text-green-500 text-sm mt-2">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        <MainButton
          text={t("submit")}
          type="submit"
          className="w-full mt-4"
        />

      </form>

    </div>
  );
};

export default ResetPasswordPage;