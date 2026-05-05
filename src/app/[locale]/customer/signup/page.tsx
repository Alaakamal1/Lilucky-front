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
  validateStreet
} from "@/src/utils/validators";

import { useLocale, useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const withLocale = (path: string) => `/${locale}${path}`;


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [street, setStreet] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = [
      validateFirstName(firstName),
      validateLastName(lastName),
      validateEmail(email),
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
      validateConfirmPassword(password, confirmPassword),
      validateGov(selectedGov),
      validateCity(selectedCity),
      validateStreet(street),
    ];

    if (errors.some(err => err !== "")) {
      setFormError(t("errors.form"));
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
          address: {
            city: selectedCity,
            governorate: selectedGov,
            street: street
          }
        }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage(t("success"));

        setTimeout(() => {
          router.push(withLocale("/customer/login"));
        }, 1200);
      } else {
        setFormError(t("registration.errors.server"));
      }

    } catch (err) {
      console.error(err);
      setFormError(t("registration.errors.server"));
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex h-200 flex-col md:flex-row justify-between items-center">

      <div className="bg-background mx-20 rounded-2xl w-full md:w-6/12 shadow-xl p-6">

        <form onSubmit={handleSubmit}>

          <Typography variant="h4" className="mb-4 text-primary text-center">
            {t("registration.register.create_account")}
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

          {/* NAME */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t("registration.fields.first_name.label")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <InputField
              label={t("registration.fields.last_name.label")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t("registration.fields.email.label")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              label={t("registration.fields.phone.label")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t("registration.fields.password.label")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
              label={t("registration.fields.confirm_password.label")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* LOCATION */}
          <div className="grid grid-cols-2 gap-4">

            <Dropdown
              label={t("registration.fields.gov.label")}
              options={governorateOptions}
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
            />

            <Dropdown
              label={t("registration.fields.city.label")}
              options={cityOptions}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedGov}
            />

          </div>

          {/* STREET */}
          <TextArea
            label={t("registration.fields.street.label")}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          
            <div className="flex justify-between">
              <Link href={withLocale("/customer/login")}>
                <Typography className="text-secondary-text hover:secondary-text-hover cursor-pointer">
                  {t("registration.register.have_account")}
                </Typography>
              </Link>
            </div>

          {/* SUBMIT */}
          <MainButton
            text={t("registration.register.create_account")}
            type="submit"
            className="w-full h-12 bg-primary text-white mt-4"
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