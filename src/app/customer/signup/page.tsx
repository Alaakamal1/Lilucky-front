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
  validateFirstName, validateLastName, validateEmail,
  validatePhoneNumber, validatePassword, validateConfirmPassword, validateNotEmpty
} from "@/src/utils/validators";

const Page = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [selectedGov, setSelectedGov] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  {/* Error States */ }
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [selectedGovError, setSelectedGovError] = useState<string>("");
  const [selectedCityError, setSelectedCityError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const router = useRouter();
  const governorateOptions = Object.keys(egyptData).map((gov) => ({
    value: gov,
    label: gov,
  }));

  const cityOptions = selectedGov
    ? egyptData[selectedGov].map((city: React.ChangeEvent<HTMLInputElement>) => ({ value: city, label: city }))
    : [];

  // Handlers
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    setFirstNameError(validateFirstName(value));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    setLastNameError(validateLastName(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    setConfirmPasswordError(validateConfirmPassword(value, confirmPassword));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(validateConfirmPassword(password, value));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhoneNumber(value);
      setPhoneNumberError(validatePhoneNumber(value));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAddress(value);
    setAddressError(validateNotEmpty(value, "العنوان"));
  };

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGov(value);
    setSelectedCity("");
    setSelectedGovError(validateNotEmpty(value, "المحافظة"));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCity(value);
    setSelectedCityError(validateNotEmpty(value, "المدينة"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final Validation
    const errors = [
      validateFirstName(firstName),
      validateLastName(lastName),
      validateEmail(email),
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
      validateConfirmPassword(password, confirmPassword),
      validateNotEmpty(address, "العنوان"),
      validateNotEmpty(selectedGov, "المحافظة"),
      validateNotEmpty(selectedCity, "المدينة")
    ];
    if (errors.some(err => err !== "")) {
      setFormError("من فضلك صحح جميع الأخطاء قبل الإرسال");

      return;
    }

    const data = { firstName, lastName, email, phoneNumber, password, address, governorate: selectedGov, city: selectedCity };

    try {
      const res = await apiClient.post(`${Endpoints.register}`, data, { headers: { "Content-Type": "application/json" } });
      if (res.status === 200 || res.status === 201) {
        router.push("/customer/login");
      } else {
        alert(res.data.message || "حدث خطأ في التسجيل");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message || "حدث خطأ في التسجيل");
      } else {
        alert("خطأ في الاتصال بالسيرفر");
      }
    }
  };

  return (
    <div className="flex h-200 flex-col md:flex-row justify-between items-center max-md:absolute z-1 max-md:top-50 max-md:opacity-96">
      <div className="bg-background mx-20 rounded-2xl w-full md:w-6/12 shadow-xl p-6">
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" className="mb-4 text-primary text-center">
            إنشاء حساب
          </Typography>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField label="الاسم الاول" value={firstName} onChange={handleFirstNameChange} placeholder="اكتب اسمك" />
              {firstNameError && <Typography className="text-red-500 text-sm mt-1">{firstNameError}</Typography>}
            </div>
            <div>
              <InputField label="الاسم الثاني" value={lastName} onChange={handleLastNameChange} placeholder="اكتب اسمك" />
              {lastNameError && <Typography className="text-red-500 text-sm mt-1">{lastNameError}</Typography>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField label="الايميل" type="email" value={email} onChange={handleEmailChange} placeholder="اكتب الايميل" />
              {emailError && <Typography className="text-red-500 text-sm mt-1">{emailError}</Typography>}
            </div>
            <div>
              <InputField label="رقم التلفون" value={phoneNumber} onChange={handleNumberChange} placeholder="اكتب رقم التلفون" />
              {phoneNumberError && <Typography className="text-red-500 text-sm mt-1">{phoneNumberError}</Typography>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField label="كلمة المرور" type="password" value={password} onChange={handlePasswordChange} placeholder="كلمة المرور" />
              {passwordError && <Typography className="text-red-500 text-sm mt-1">{passwordError}</Typography>}
            </div>
            <div>
              <InputField label="تأكيد كلمة المرور" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="اكتب كلمة المرور مرة اخرى" />
              {confirmPasswordError && <Typography className="text-red-500 text-sm mt-1">{confirmPasswordError}</Typography>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Dropdown label="اختر المحافظة" options={governorateOptions} value={selectedGov} onChange={handleGovChange} />
              {selectedGovError && <Typography className="text-red-500 text-sm mt-1">{selectedGovError}</Typography>}
            </div>
            <div>
              <Dropdown label="اختر المدينة" options={cityOptions} value={selectedCity} onChange={handleCityChange} disabled={!selectedGov} />
              {selectedCityError && <Typography className="text-red-500 text-sm mt-1">{selectedCityError}</Typography>}
            </div>
          </div>

          <div>
            <TextArea label="العنوان التفصيلي" value={address} onChange={handleAddressChange} placeholder="اكتب العنوان التفصيلي هنا" rows={3} />
            {addressError && <Typography className="text-red-500 text-sm mt-1">{addressError}</Typography>}
          </div>

          <Link href="/customer/login">
            <Typography variant="body1" gutterBottom className="text-right text-secondary-text hover:secondary-text-hover cursor-pointer">
              لديك حساب؟ تسجيل الدخول
            </Typography>
          </Link>
          {formError && (
            <Typography className="text-red-600 text-center mb-4">{formError}</Typography>
          )}

          <MainButton text={"إنشاء حساب"} className="w-full h-12 rounded-md text-background hover:bg-primary-hover duration-400 ease-in my-4 px-6 bg-primary cursor-pointer" />
        </form>
      </div>

      <div className="relative md:w-6/12 w-full h-200 md:h-full">
        <Image src="/login.jpg" alt="login" fill className="object-cover" priority />
      </div>
    </div>
  );
};

export default Page;
