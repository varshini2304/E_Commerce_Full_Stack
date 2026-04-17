import { apiClient } from "../../../services/apiClient";
import { AboutContent, ApiResponse } from "../types/aboutTypes";

export const getAboutContent = async (): Promise<AboutContent> => {
  const response = await apiClient.get<AboutContent | ApiResponse<AboutContent>>("/api/site/about");

  if ("success" in response.data) {
    return response.data.data;
  }

  return response.data;
};
