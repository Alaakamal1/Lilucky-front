export const validateFirstName = (value: string) => {
  if (!/^[a-zA-Z\u0600-\u06FF\s]*$/.test(value)) return "invalid_name";
  return "";
};

export const validateLastName = (value: string) => {
  if (!/^[a-zA-Z\u0600-\u06FF\s]*$/.test(value)) return "invalid_name";
  return "";
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "invalid_email";
  return "";
};

export const validatePhoneNumber = (value: string) => {
  if (!/^\d{11}$/.test(value)) return "invalid_phone";
  return "";
};

export const validatePassword = (value: string) => {
  if (value.length < 6) return "invalid_password";
  return "";
};

export const validateConfirmPassword = (password: string, confirm: string) => {
  if (password !== confirm) return "password_mismatch";
  return "";
};

export const validateGov = (value: string) => {
  if (!value) return "invalid_gov";
  return "";
};

export const validateCity = (value: string) => {
  if (!value) return "invalid_city";
  return "";
};

export const validateAddress = (value: string) => {
  if (!value) return "invalid_address";
  if (value.length < 10) return "invalid_address";
  return "";
};