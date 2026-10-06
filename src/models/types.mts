export interface CarItem {
    productId: string;
    quantity: number;
}
export interface User {
    id: string,
    username: string;
    email: string;
    password: string;
    cart: CarItem[];
    order: Order[];
};

export interface Review {
  userId: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  reviews: Review[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalCost: number;
}

export interface Alert {
  id: string;
  message: string;
  type: string;
  condition: string;
}