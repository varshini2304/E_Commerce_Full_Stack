import { useQuery } from "@tanstack/react-query";
import { getAboutContent } from "../services/aboutService";

export const useAboutContent = () =>
  useQuery({
    queryKey: ["site-about"],
    queryFn: getAboutContent,
  });
