import { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";
import {
  ApiResponse,
  DeliveryDetailsModel,
  OrderItemRaw,
  OrderStatus,
  OrderTrackingApi,
  OrderTrackingModel,
  TimelineEventRaw,
  TimelineStatus,
  TimelineStepModel,
} from "../types/orderTrackingTypes";

const AUTH_TOKEN_KEYS = ["token", "authToken", "accessToken", "jwt"] as const;

const STEP_META: Record<
  TimelineStatus,
  { title: string; icon: "placed" | "processing" | "shipped" | "delivery" | "delivered"; order: number }
> = {
  placed: { title: "Order Placed", icon: "placed", order: 1 },
  processing: { title: "Processing", icon: "processing", order: 2 },
  shipped: { title: "Shipped", icon: "shipped", order: 3 },
  out_for_delivery: { title: "Out for Delivery", icon: "delivery", order: 4 },
  delivered: { title: "Delivered", icon: "delivered", order: 5 },
};

const STATUS_TO_TIMELINE: Partial<Record<OrderStatus, TimelineStatus>> = {
  pending: "placed",
  processing: "processing",
  shipped: "shipped",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
};

const normalizeStatus = (status?: string): OrderStatus => {
  const value = (status ?? "pending").toLowerCase().replace(/\s+/g, "_");

  if (value === "out_for_delivery") {
    return "out_for_delivery";
  }

  if (
    value === "pending" ||
    value === "processing" ||
    value === "shipped" ||
    value === "delivered" ||
    value === "cancelled"
  ) {
    return value;
  }

  if (value === "placed") {
    return "pending";
  }

  return "pending";
};

const normalizeTimelineStatus = (status?: string): TimelineStatus | null => {
  if (!status) {
    return null;
  }

  const value = status.toLowerCase().replace(/\s+/g, "_");

  if (
    value === "placed" ||
    value === "processing" ||
    value === "shipped" ||
    value === "out_for_delivery" ||
    value === "delivered"
  ) {
    return value;
  }

  if (value === "pending") {
    return "placed";
  }

  return null;
};

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of AUTH_TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return null;
};

const buildAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const mapProducts = (order: OrderTrackingApi) => {
  const items: OrderItemRaw[] = order.orderItems ?? order.items ?? [];

  return items.map((item, index) => ({
    id: String(item.id ?? item.productId ?? index),
    name: item.name ?? "Unnamed Product",
    imageUrl: item.thumbnail ?? item.imageUrl ?? item.image ?? "https://placehold.co/80x80?text=Item",
    quantity: item.quantity ?? 1,
    price: item.price ?? 0,
  }));
};

const mapDeliveryDetails = (order: OrderTrackingApi): DeliveryDetailsModel => {
  const shipping = order.shippingAddress ?? {};
  const line =
    shipping.address ??
    shipping.addressLine1 ??
    [shipping.city, shipping.state, shipping.country, shipping.postalCode]
      .filter(Boolean)
      .join(", ");

  return {
    customerName: shipping.name ?? shipping.fullName ?? "Customer",
    address: line || "Address not available",
    phoneNumber: shipping.phone ?? "Phone not available",
    estimatedDelivery: order.estimatedDelivery ?? null,
  };
};

const mapTimeline = (order: OrderTrackingApi, status: OrderStatus): TimelineStepModel[] => {
  const rawTimeline: TimelineEventRaw[] = order.statusTimeline ?? [];

  const eventDateMap = rawTimeline.reduce<Record<TimelineStatus, string>>((acc, event) => {
    const timelineStatus = normalizeTimelineStatus(event.status);
    if (!timelineStatus) {
      return acc;
    }

    const eventDate = event.date ?? event.timestamp;
    if (eventDate) {
      acc[timelineStatus] = eventDate;
    }

    return acc;
  }, {});

  if (!eventDateMap.placed && order.createdAt) {
    eventDateMap.placed = order.createdAt;
  }

  const currentTimelineStatus = STATUS_TO_TIMELINE[status] ?? "placed";
  if (!eventDateMap[currentTimelineStatus] && order.updatedAt) {
    eventDateMap[currentTimelineStatus] = order.updatedAt;
  }

  const currentOrder = STEP_META[currentTimelineStatus].order;

  return (Object.keys(STEP_META) as TimelineStatus[])
    .sort((a, b) => STEP_META[a].order - STEP_META[b].order)
    .map((key) => {
      const stepOrder = STEP_META[key].order;
      const state: TimelineStepModel["state"] =
        stepOrder < currentOrder
          ? "completed"
          : stepOrder === currentOrder
            ? "current"
            : "upcoming";

      return {
        key,
        title: STEP_META[key].title,
        icon: STEP_META[key].icon,
        dateTime: eventDateMap[key] ?? null,
        state,
      };
    });
};

const transformOrderTracking = (order: OrderTrackingApi): OrderTrackingModel => {
  const id = String(order.id ?? order._id ?? "");
  const status = normalizeStatus(order.orderStatus ?? order.status);

  return {
    id,
    status,
    timeline: mapTimeline(order, status),
    products: mapProducts(order),
    totalAmount: order.totalPrice ?? order.total ?? 0,
    paymentMethod: order.paymentMethod ?? "Not available",
    paymentStatus: order.paymentStatus ?? "pending",
    deliveryDetails: mapDeliveryDetails(order),
  };
};

export const fetchOrderTracking = async (orderId: string): Promise<OrderTrackingModel> => {
  try {
    const response = await apiClient.get<OrderTrackingApi | ApiResponse<OrderTrackingApi>>(
      `/api/orders/${encodeURIComponent(orderId)}`,
      {
        headers: buildAuthHeaders(),
      },
    );

    const payload = "success" in response.data ? response.data.data : response.data;
    return transformOrderTracking(payload);
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;

    if (status === 401 || status === 403) {
      const fallback = await apiClient.get<
        | {
            user: { id: string; name: string; email: string; avatarUrl: string };
            orders: Array<{
              id: string | number;
              status: string;
              subtotal: number;
              total: number;
              createdAt?: string;
              items: Array<{
                productId: string | number;
                name: string;
                thumbnail: string;
                quantity: number;
                price: number;
              }>;
            }>;
          }
        | ApiResponse<{
            user: { id: string; name: string; email: string; avatarUrl: string };
            orders: Array<{
              id: string | number;
              status: string;
              subtotal: number;
              total: number;
              createdAt?: string;
              items: Array<{
                productId: string | number;
                name: string;
                thumbnail: string;
                quantity: number;
                price: number;
              }>;
            }>;
          }>
      >("/api/profile-page");

      const fallbackPayload = "success" in fallback.data ? fallback.data.data : fallback.data;
      const order = fallbackPayload.orders.find((item) => String(item.id) === String(orderId));

      if (!order) {
        throw error;
      }

      return transformOrderTracking({
        id: String(order.id),
        status: order.status,
        orderItems: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.createdAt,
        paymentMethod: "Not available",
        paymentStatus: "pending",
      });
    }

    throw error;
  }
};
