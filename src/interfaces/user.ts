export type UserRole = "ADMIN" | "CLIENT";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  governorate: string;
  address: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}