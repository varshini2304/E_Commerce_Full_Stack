import axios from "axios";
import type {
  ApiResponse,
  AuthResponse,
  InventoryItem,
  LoginRequest,
  Product,
  ProductRequest,
  ProductsPage,
  RegisterRequest,
} from "../types/vendor.types";

// ─── Axios Instance ────────────────────────────────────────────
// Uses VITE_API_BASE_URL so the same code works in dev (proxy) and prod (Render)
const baseURL = `${(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")}/api`;

const api = axios.create({ baseURL });

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vendor_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth API ──────────────────────────────────────────────────
export const vendorAuthApi = {
  login: (data: LoginRequest) =>
    api
      .post<ApiResponse<AuthResponse>>("/vendors/login", data)
      .then((r) => r.data.data),

  register: (data: RegisterRequest) =>
    api
      .post<ApiResponse<AuthResponse>>("/vendors/register", data)
      .then((r) => r.data.data),

  getProfile: () =>
    api
      .get<ApiResponse<{ vendor: AuthResponse["vendor"] }>>("/vendors/profile")
      .then((r) => r.data.data),
};

// ─── Products API (vendor-scoped, JWT identifies the vendor) ──
export const vendorProductsApi = {
  list: (_vendorId: string, page = 1, limit = 20) =>
    api
      .get<ApiResponse<ProductsPage>>("/vendors/products", {
        params: { page, limit },
      })
      .then((r) => r.data.data),

  create: (data: ProductRequest) =>
    api
      .post<ApiResponse<Product>>("/vendors/products", data)
      .then((r) => r.data.data),

  update: (id: string, data: ProductRequest) =>
    api
      .put<ApiResponse<Product>>(`/vendors/products/${id}`, data)
      .then((r) => r.data.data),

  delete: (id: string) =>
    api
      .delete<ApiResponse<Product>>(`/vendors/products/${id}`)
      .then((r) => r.data.data),
};

// ─── Inventory API ─────────────────────────────────────────────
export const vendorInventoryApi = {
  listByVendor: (_vendorId: string) =>
    api
      .get<ApiResponse<InventoryItem[]>>("/vendors/inventory")
      .then((r) => r.data.data),
};
