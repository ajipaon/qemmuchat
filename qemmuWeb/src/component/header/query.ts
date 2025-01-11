import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { apiClient } from "../../config/clientApiConfig";
import { newOrganization } from "./type";

export const useGetUserDetail = (): UseQueryResult<
  ResponseType | undefined,
  Error
> => {
  return useQuery<ResponseType | undefined, Error>({
    queryKey: ["get_userData"],
    queryFn: async () => {
      return apiClient(`/api/v1/user`);
    },
  });
};

export const useNewOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, newOrganization>({
    mutationKey: ["login"],
    mutationFn: async (newOrganization) => {
      if (!newOrganization.name) return;
      return await apiClient(`/api/v1/organization`, {
        method: "POST",
        body: JSON.stringify(newOrganization),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_userData"] });
    },
  });
};

export const useChangeOrganization = () => {
  return useMutation<void, Error, string>({
    mutationKey: ["login"],
    mutationFn: async (organizationId) => {
      if (!organizationId) return;
      return await apiClient(
        `/api/v1/user/change/organization/${organizationId}`
      );
    },
  });
};
