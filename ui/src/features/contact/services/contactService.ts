import { apiClient } from "../../../services/apiClient";
import {
  ApiResponse,
  ContactFormValues,
  ContactInfo,
  ContactSubmissionResult,
} from "../types/contactTypes";

export const getContactInfo = async (): Promise<ContactInfo> => {
  const response = await apiClient.get<ContactInfo | ApiResponse<ContactInfo>>("/api/site/contact");

  if ("success" in response.data) {
    return response.data.data;
  }

  return response.data;
};

export const submitContactForm = async (
  payload: ContactFormValues,
): Promise<ContactSubmissionResult> => {
  const response = await apiClient.post<
    ContactSubmissionResult | ApiResponse<ContactSubmissionResult>
  >("/api/site/contact", payload);

  if ("success" in response.data) {
    return response.data.data;
  }

  return response.data;
};
