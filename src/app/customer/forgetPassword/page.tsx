'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import { Typography } from "@mui/material";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/customer/resetPassword?email=${email}`);
      } else {
        setError(data.message || "Something went wrong");
      }

    } catch (err: any) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-96 p-6 shadow-lg rounded-xl bg-white">
        <Typography variant="h5" className="text-center mb-4">
          Forgot Password
        </Typography>

        <InputField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <MainButton
          text={loading ? "Sending..." : "Send OTP"}
          type="submit"
          className="w-full mt-4"
        />
      </form>
    </div>
  );
};

export default ForgotPasswordPage;