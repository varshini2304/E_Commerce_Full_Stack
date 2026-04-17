import { apiClient } from "../../../services/apiClient";
import { ApiResponse, TermsContent } from "../types/termsTypes";

export const getTermsContent = async (): Promise<TermsContent> => {
  const response = await apiClient.get<TermsContent | ApiResponse<TermsContent>>("/api/site/terms");

  if ("success" in response.data) {
    return response.data.data;
  }

  return response.data;
};
