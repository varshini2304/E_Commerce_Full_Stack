import { apiClient } from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../shared/constants/config";
import { ProfilePageResponse } from "../../../types/profile";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getProfilePageData = async (): Promise<ProfilePageResponse> => {
  const response = await apiClient.get<ProfilePageResponse | ApiResponse<ProfilePageResponse>>(
    API_ENDPOINTS.profilePage,
  );

  if ("data" in response.data && "success" in response.data) {
    return response.data.data;
  }

  return response.data;
};
