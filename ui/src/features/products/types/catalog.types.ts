export interface CatalogProduct {
  _id: string;
  vendorId?: string | null;
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

export interface CatalogResponse {
  success: boolean;
  message: string;
  data: {
    products: CatalogProduct[];
    total: number;
    page: number;
    pages: number;
  };
}
