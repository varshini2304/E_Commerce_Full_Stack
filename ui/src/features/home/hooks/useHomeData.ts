import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../shared/constants/config";
import { getHomeData } from "../services/homeService";

export const useHomeData = () =>
  useQuery({
    queryKey: QUERY_KEYS.home,
    queryFn: getHomeData,
  });
