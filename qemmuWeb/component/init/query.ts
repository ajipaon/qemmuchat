import { apiClient } from "@/config/clientApiConfig";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { sectionStatus } from "./store/data";

export const useGetConfig = (
  search: sectionStatus
): UseQueryResult<ResponseType | undefined, Error> => {
  return useQuery<ResponseType | undefined, Error>({
    queryKey: ["get_config"],
    queryFn: async () => {
      return apiClient(`http://localhost:8080/api/v1/config?name=${search}`);
    },
    enabled: !!search,
  });
};
