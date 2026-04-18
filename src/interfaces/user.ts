
export type UserRole = "ADMIN" | "CLIENT";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; 
  phoneNumber: string;
  city: string;
  governorate: string;
  address: string;
  role: UserRole;
  otp?: number;
  otpExpires?: string;
  createdAt: string;
  updatedAt: string;
}