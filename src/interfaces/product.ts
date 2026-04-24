import { Category } from "./Category";

export interface ProductVariant {
  productId:string;
  color: string;
  sizes: Array<'1Y' | '2Y' | '3Y' | '4Y' | '5Y' | '6Y' | '7Y' | '8Y'>;
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  main_price: number;
  gender: 'boys' | 'girls';
  stock: number;
  category?:Category;
  material: string;
  variants: ProductVariant[];
  isActive: boolean;
  like: boolean;
  createdAt: string;
  updatedAt: string;
}