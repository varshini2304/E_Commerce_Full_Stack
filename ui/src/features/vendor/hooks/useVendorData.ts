import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vendorInventoryApi, vendorProductsApi } from "../api/vendor.api";
import type { ProductRequest } from "../types/vendor.types";

// ─── Query Keys ────────────────────────────────────────────────
export const vendorQueryKeys = {
  products: (vendorId: string) => ["vendor-products", vendorId] as const,
  inventory: (vendorId: string) => ["vendor-inventory", vendorId] as const,
};

// ─── Products Hooks ────────────────────────────────────────────
export function useVendorProducts(vendorId: string) {
  return useQuery({
    queryKey: vendorQueryKeys.products(vendorId),
    queryFn: () => vendorProductsApi.list(vendorId),
    enabled: !!vendorId,
    staleTime: 30_000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductRequest) => vendorProductsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductRequest }) =>
      vendorProductsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorProductsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-products"] }),
  });
}

// ─── Inventory Hooks ───────────────────────────────────────────
export function useVendorInventory(vendorId: string) {
  return useQuery({
    queryKey: vendorQueryKeys.inventory(vendorId),
    queryFn: () => vendorInventoryApi.listByVendor(vendorId),
    enabled: !!vendorId,
    staleTime: 30_000,
  });
}
