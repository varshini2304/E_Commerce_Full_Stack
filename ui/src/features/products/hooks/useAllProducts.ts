import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/apiClient";
import type { CatalogProduct, CatalogResponse } from "../types/catalog.types";

export const useAllProducts = () =>
  useQuery<CatalogProduct[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data } = await apiClient.get<CatalogResponse>("/api/products", {
        params: { limit: 100 },
      });
      return data.data.products ?? [];
    },
    staleTime: 60_000,
  });
