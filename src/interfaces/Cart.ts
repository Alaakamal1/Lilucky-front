export interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
}