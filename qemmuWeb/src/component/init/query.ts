import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  dataConfig,
  loginUser,
  registerUser,
  sectionStatus,
} from "./store/data";
import { apiClient } from "../../config/clientApiConfig";

export const useGetConfig = (
  search: sectionStatus
): UseQueryResult<ResponseType | undefined, Error> => {
  return useQuery<ResponseType | undefined, Error>({
    queryKey: ["get_config"],
    queryFn: async () => {
      return apiClient(`/auth/config?name=${search}`);
    },
    enabled: !!search,
  });
};

export const useAddConfig = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, dataConfig>({
    mutationKey: ["add_config"],
    mutationFn: async (dataConfig) => {
      if (!dataConfig.data) return;
      await apiClient(`/auth/config`, {
        method: "POST",
        body: JSON.stringify(dataConfig),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_config"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, registerUser>({
    mutationKey: ["register"],
    mutationFn: async (registerUser) => {
      if (!registerUser) return;
      return await apiClient(`/auth/register`, {
        method: "POST",
        body: JSON.stringify(registerUser),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_config"] });
    },
  });
};

export const useLogin = () => {
  return useMutation<void, Error, loginUser>({
    mutationKey: ["login"],
    mutationFn: async (loginUser) => {
      if (!loginUser) return;
      return await apiClient(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(loginUser),
      });
    },
  });
};
