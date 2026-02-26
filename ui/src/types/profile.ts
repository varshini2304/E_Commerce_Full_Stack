export interface ProfilePageUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface ProfilePageOrderItem {
  productId: string;
  name: string;
  thumbnail: string;
  quantity: number;
  price: number;
}

export interface ProfilePageOrder {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  total: number;
  createdAt: string;
  items: ProfilePageOrderItem[];
}

export interface ProfilePageResponse {
  user: ProfilePageUser;
  orders: ProfilePageOrder[];
}
