import { AxiosError } from "axios";
import { apiClient } from "../../../services/apiClient";
import { CartItem } from "../../cart/cartStorage";

export interface CheckoutResult {
  orderId: string;
  transactionId: string;
  usedApi: boolean;
  fallbackReason?: string;
}

const AUTH_TOKEN_KEYS = ["token", "authToken", "accessToken", "jwt"] as const;

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

const getAuthConfig = () => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const createOrder = async (authConfig: { headers: { Authorization: string } }) => {
  const response = await apiClient.post("/api/orders", {}, authConfig);
  const payload = response.data as { data?: { id?: number | string } };
  const idValue = payload?.data?.id;

  if (!idValue) {
    throw new Error("Order API did not return an order id.");
  }

  return String(idValue);
};

const createPaymentIntent = async (
  orderId: string,
  authConfig: { headers: { Authorization: string } },
) => {
  const response = await apiClient.post(
    "/api/payments/create",
    { orderId: Number(orderId) },
    authConfig,
  );
  const payload = response.data as { data?: { transactionId?: string } };
  const transactionId = payload?.data?.transactionId;

  if (!transactionId) {
    throw new Error("Payment create API did not return a transaction id.");
  }

  return transactionId;
};

const verifyPayment = async (
  transactionId: string,
  authConfig: { headers: { Authorization: string } },
) => {
  await apiClient.post(
    "/api/payments/verify",
    { transactionId, status: "succeeded" },
    authConfig,
  );
};

const createMockResult = (reason?: string): CheckoutResult => ({
  orderId: `${Date.now()}`,
  transactionId: `txn_mock_${Math.random().toString(36).slice(2, 10)}`,
  usedApi: false,
  fallbackReason: reason,
});

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const processCheckout = async (): Promise<CheckoutResult> => {
  const authConfig = getAuthConfig();

  if (!authConfig) {
    await delay(900);
    return createMockResult("No auth token found. Used temporary mock gateway.");
  }

  try {
    const orderId = await createOrder(authConfig);
    const transactionId = await createPaymentIntent(orderId, authConfig);
    await verifyPayment(transactionId, authConfig);

    return {
      orderId,
      transactionId,
      usedApi: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const reasonFromServer = axiosError.response?.data?.message;
    const reason = reasonFromServer ?? axiosError.message;

    await delay(800);
    return createMockResult(`Live payment flow failed (${reason}). Used temporary mock gateway.`);
  }
};

export interface CheckoutSessionItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface CheckoutSession {
  orderId: string;
  transactionId: string;
  usedApi: boolean;
  fallbackReason?: string;
  paymentMethod: string;
  total: number;
  shipping: number;
  discount: number;
  subtotal: number;
  currency: string;
  customerName: string;
  items: CheckoutSessionItem[];
}

const CHECKOUT_SESSION_KEY = "app_checkout_session";

export const saveCheckoutSession = (session: CheckoutSession) => {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(session));
};

export const getCheckoutSession = (): CheckoutSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(CHECKOUT_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CheckoutSession;
  } catch {
    return null;
  }
};

export const buildCheckoutSessionItems = (items: CartItem[]): CheckoutSessionItem[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    price: item.price,
    currency: item.currency,
    quantity: item.quantity,
  }));
