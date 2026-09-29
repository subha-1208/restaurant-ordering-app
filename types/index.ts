export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Completed";

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}