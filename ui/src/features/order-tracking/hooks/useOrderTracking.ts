import { useQuery } from "@tanstack/react-query";
import { fetchOrderTracking } from "../services/orderTrackingService";

export const useOrderTracking = (orderId: string) =>
  useQuery({
    queryKey: ["order-tracking", orderId],
    queryFn: () => fetchOrderTracking(orderId),
    enabled: Boolean(orderId),
  });
