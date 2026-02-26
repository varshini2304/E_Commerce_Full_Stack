import { apiClient } from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../shared/constants/config";
import { HomeApiResponse } from "../../../types/home";

export const getHomeData = async (): Promise<HomeApiResponse> => {
  const { data } = await apiClient.get<HomeApiResponse>(API_ENDPOINTS.home);
  return data;
};
