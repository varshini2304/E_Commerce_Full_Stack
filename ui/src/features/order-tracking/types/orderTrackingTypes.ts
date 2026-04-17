export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type TimelineStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface TimelineEventRaw {
  status: string;
  date?: string;
  timestamp?: string;
}

export interface ShippingAddressRaw {
  name?: string;
  fullName?: string;
  address?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
}

export interface OrderItemRaw {
  id?: string | number;
  productId?: string | number;
  name?: string;
  thumbnail?: string;
  image?: string;
  imageUrl?: string;
  quantity?: number;
  price?: number;
}

export interface OrderTrackingApi {
  id?: string | number;
  _id?: string | number;
  status?: string;
  orderStatus?: string;
  statusTimeline?: TimelineEventRaw[];
  items?: OrderItemRaw[];
  orderItems?: OrderItemRaw[];
  total?: number;
  totalPrice?: number;
  subtotal?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  shippingAddress?: ShippingAddressRaw;
  estimatedDelivery?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TimelineStepModel {
  key: TimelineStatus;
  title: string;
  icon: "placed" | "processing" | "shipped" | "delivery" | "delivered";
  dateTime: string | null;
  state: "completed" | "current" | "upcoming";
}

export interface ProductItemModel {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface DeliveryDetailsModel {
  customerName: string;
  address: string;
  phoneNumber: string;
  estimatedDelivery: string | null;
}

export interface OrderTrackingModel {
  id: string;
  status: OrderStatus;
  timeline: TimelineStepModel[];
  products: ProductItemModel[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryDetails: DeliveryDetailsModel;
}
