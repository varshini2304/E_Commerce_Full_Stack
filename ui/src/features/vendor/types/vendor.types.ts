// ─── Vendor Types ──────────────────────────────────────────────
export interface Vendor {
  id: string;
  name: string;
  email: string;
  businessName: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  vendor: Vendor;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  businessName: string;
}

// ─── Product Types ─────────────────────────────────────────────
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  discountPercentage: number;
  finalPrice: number;
  stock: number;
  sku: string;
  categorySlug: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  ratingsAverage: number;
  ratingsCount: number;
  isActive: boolean;
  views: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  discountPercentage: number;
  finalPrice: number;
  stock: number;
  sku: string;
  categorySlug: string;
  thumbnail: string;
  images: string[];
  tags: string[];
}

export interface ProductsPage {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

// ─── Inventory Types ───────────────────────────────────────────
export interface InventoryItem {
  id: string;
  productId: string;
  vendorId: string;
  availableStock: number;
  reservedStock: number;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Wrapper ──────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
