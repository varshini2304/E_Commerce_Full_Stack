import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../shared/constants/config";
import { getProfilePageData } from "../services/profileService";

export const useProfileData = () =>
  useQuery({
    queryKey: QUERY_KEYS.profilePage,
    queryFn: getProfilePageData,
  });
