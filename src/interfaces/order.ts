export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryAddress {
  city: string;
  location: string;
  phoneNumber: string;
}

export interface OrderUser {
  firstName: string;
  lastName: string;
  email?: string;
}
export interface Order {
  _id: string;
  userId: string | OrderUser;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  deliveryAddress: DeliveryAddress;
  createdAt: string;
  updatedAt: string;
}