import { useMutation, useQuery } from "@tanstack/react-query";
import { getContactInfo, submitContactForm } from "../services/contactService";
import { ContactFormValues } from "../types/contactTypes";

export const useContactInfo = () =>
  useQuery({
    queryKey: ["site-contact"],
    queryFn: getContactInfo,
  });

export const useContactForm = () =>
  useMutation({
    mutationFn: (payload: ContactFormValues) => submitContactForm(payload),
  });
