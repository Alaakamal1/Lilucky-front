'use client';

import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/src/components/ui/DropDown";
import InputField from "@/src/components/ui/InputField";
import MainButton from "@/src/components/ui/MainButton";
import egyptData from "@/src/data/egyptData.json";
import TextArea from "@/src/components/ui/TextArea";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateConfirmPassword,
  validateGov,
  validateCity,
  validateAddress
} from "@/src/utils/validators";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("register");
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const translateGov = (gov: string) => t(`governorates.${gov}`);
  const translateCity = (city: string) => t(`cities.${city}`);
  const governorateOptions = Object.keys(egyptData).map((gov) => ({
    value: gov,
    label: translateGov(gov)
  }));

  type Gov = keyof typeof egyptData;

  const cityOptions =
    selectedGov
      ? (egyptData[selectedGov as Gov] ?? []).map((city: string) => ({
        value: city,
        label: translateCity(city)
      }))
      : [];

  // handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = [
      validateFirstName(firstName),
      validateLastName(lastName),
      validateEmail(email),
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
      validateConfirmPassword(password, confirmPassword),
      validateAddress(address),
      validateGov(selectedGov),
      validateCity(selectedCity),
    ];

    if (errors.some(err => err !== "")) {
      setFormError(t("form_error"));
      return;
    }

    try {
      const res = await apiClient.post(
        Endpoints.register,
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          confirmPassword,
          address,
          governorate: selectedGov,
          city: selectedCity
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage(t("success"));

        setTimeout(() => {
          router.push("/customer/login");
        }, 1500);

      } else {
        setFormError(t("server_error"));
      }

    } catch {
      setFormError(t("server_error"));
    }
  };

  return (
    <div className="flex h-200 flex-col md:flex-row justify-between items-center">

      <div className="bg-background mx-20 rounded-2xl w-full md:w-6/12 shadow-xl p-6">

        <form onSubmit={handleSubmit}>

          <Typography variant="h4" className="mb-4 text-primary text-center">
            {t("title")}
          </Typography>

          {formError && (
            <Typography className="text-red-600 text-center mb-4">
              {formError}
            </Typography>
          )}

          {successMessage && (
            <Typography className="text-green-600 text-center mb-4">
              {successMessage}
            </Typography>
          )}

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <InputField
                label={t("fields.first_name.label")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setFirstNameError(validateFirstName(firstName))}
                placeholder={t("fields.first_name.placeholder")}
              />
              {firstNameError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${firstNameError}`)}
                </Typography>
              )}
            </div>

            <div>
              <InputField
                label={t("fields.last_name.label")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setLastNameError(validateLastName(lastName))}
                placeholder={t("fields.last_name.placeholder")}
              />
              {lastNameError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${lastNameError}`)}
                </Typography>
              )}
            </div>

          </div>

          {/* Email / Phone */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <InputField
                label={t("fields.email.label")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailError(validateEmail(email))}
                placeholder={t("fields.email.placeholder")}
              />
              {emailError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${emailError}`)}
                </Typography>
              )}
            </div>

            <div>
              <InputField
                label={t("fields.phone.label")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => setPhoneNumberError(validatePhoneNumber(phoneNumber))}
                placeholder={t("fields.phone.placeholder")}
              />
              {phoneNumberError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${phoneNumberError}`)}
                </Typography>
              )}
            </div>

          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <InputField
                label={t("fields.password.label")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordError(validatePassword(password))}
                placeholder={t("fields.password.placeholder")}
              />
              {passwordError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${passwordError}`)}
                </Typography>
              )}
            </div>

            <div>
              <InputField
                label={t("fields.confirm_password.label")}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setConfirmPasswordError(
                    validateConfirmPassword(password, confirmPassword)
                  )
                }
                placeholder={t("fields.confirm_password.placeholder")}
              />
              {confirmPasswordError && (
                <Typography className="text-red-500 text-sm mt-1">
                  {t(`errors.${confirmPasswordError}`)}
                </Typography>
              )}
            </div>

          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <Dropdown
                label={t("fields.gov.label")}
                options={governorateOptions}
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
              />
            </div>

            <div>
              <Dropdown
                label={t("fields.city.label")}
                options={cityOptions}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedGov}
              />
            </div>

          </div>

          {/* Address */}
          <TextArea
            label={t("fields.address.label")}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("fields.address.placeholder")}
          />

          {/* Login link */}
          <Link href="/customer/login">
            <Typography className="text-secondary-text hover:secondary-text-hover cursor-pointer">
              {t("have_account")}
            </Typography>
          </Link>

          {/* Submit */}
          <MainButton
            text={t("submit")}
            type="submit"
            className="w-full h-12 rounded-md bg-primary text-white mt-4"
          />

        </form>
      </div>

      <div className="relative md:w-6/12 w-full h-200 md:h-full">
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