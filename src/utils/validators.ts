export const validateFirstName = (value: string) => {
  if (!/^[a-zA-Z\u0600-\u06FF\s]*$/.test(value)) return "الاسم يحتوي على حروف فقط";
  return "";
};

export const validateLastName = (value: string) => {
  if (!/^[a-zA-Z\u0600-\u06FF\s]*$/.test(value)) return "الاسم يحتوي على حروف فقط";
  return "";
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "الايميل غير صحيح";
  return "";
};

export const validatePhoneNumber = (value: string) => {
  if (!/^\d{11}$/.test(value)) return "رقم الهاتف يجب أن يكون 11 رقم";
  return "";
};

export const validatePassword = (value: string) => {
  if (value.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  return "";
};

export const validateConfirmPassword = (password: string, confirm: string) => {
  if (password !== confirm) return "كلمة المرور غير متطابقة";
  return "";
};

export const validateNotEmpty = (value: string, fieldName: string) => {
  if (!value) return `الرجاء إدخال ${fieldName}`;
  return "";
};
