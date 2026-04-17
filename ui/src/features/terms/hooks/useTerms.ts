import { useQuery } from "@tanstack/react-query";
import { getTermsContent } from "../services/termsService";

export const useTerms = () =>
  useQuery({
    queryKey: ["terms-content"],
    queryFn: getTermsContent,
  });
