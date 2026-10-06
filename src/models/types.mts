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