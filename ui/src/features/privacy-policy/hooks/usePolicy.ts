import { useQuery } from "@tanstack/react-query";
import { getPrivacyPolicy } from "../services/privacyPolicyService";

export const usePolicy = () =>
  useQuery({
    queryKey: ["privacy-policy"],
    queryFn: getPrivacyPolicy,
  });
