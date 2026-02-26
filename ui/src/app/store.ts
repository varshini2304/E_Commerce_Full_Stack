import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../shared/constants/config";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: (queryKey) => JSON.stringify(queryKey),
      gcTime: QUERY_KEYS.gcTimeMs,
      staleTime: QUERY_KEYS.staleTimeMs,
      retry: QUERY_KEYS.retryCount,
      refetchOnWindowFocus: false,
    },
  },
});
