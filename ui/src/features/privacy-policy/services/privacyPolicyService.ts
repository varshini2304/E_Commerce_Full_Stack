import { apiClient } from "../../../services/apiClient";
import { ApiResponse, PrivacyPolicyContent } from "../types/privacyPolicyTypes";

export const getPrivacyPolicy = async (): Promise<PrivacyPolicyContent> => {
  const response = await apiClient.get<PrivacyPolicyContent | ApiResponse<PrivacyPolicyContent>>(
    "/api/site/privacy-policy",
  );

  if ("success" in response.data) {
    return response.data.data;
  }

  return response.data;
};
