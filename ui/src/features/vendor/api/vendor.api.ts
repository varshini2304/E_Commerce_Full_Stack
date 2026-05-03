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
const api = axios.create({ baseURL: "/api" });

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

// ─── Products API ──────────────────────────────────────────────
export const vendorProductsApi = {
  list: (vendorId: string, page = 1, limit = 20) =>
    api
      .get<ApiResponse<ProductsPage>>("/products", {
        params: { vendorId, page, limit },
      })
      .then((r) => r.data.data),

  create: (data: ProductRequest) =>
    api
      .post<ApiResponse<Product>>("/products", data)
      .then((r) => r.data.data),

  update: (id: string, data: ProductRequest) =>
    api
      .put<ApiResponse<Product>>(`/products/${id}`, data)
      .then((r) => r.data.data),

  delete: (id: string) =>
    api
      .delete<ApiResponse<Product>>(`/products/${id}`)
      .then((r) => r.data.data),
};

// ─── Inventory API ─────────────────────────────────────────────
export const vendorInventoryApi = {
  listByVendor: (vendorId: string) =>
    api
      .get<ApiResponse<InventoryItem[]>>(`/inventory/vendor/${vendorId}`)
      .then((r) => r.data.data),
};
