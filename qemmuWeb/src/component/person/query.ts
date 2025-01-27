import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../../config/clientApiConfig";
import { PatchUserParams } from "./type";

export const useGetAllUserSperAdmin = (search: any) => {
  return useInfiniteQuery<ResponseType, Error>({
    queryKey: ["get_user_superAdmin", search],
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, totalPages }: any = lastPage.pages;
      if (page < totalPages) {
        return page + 1;
      } else {
        return null;
      }
    },
    queryFn: async ({ pageParam = 1 }) => {
      const response: any = await apiClient(
        `/api/v1/user/admin/all?name=${search?.name}&email=${
          search?.email
        }&role=${search?.role}&page=${(pageParam as number).toString()}&limit=5`
      );
      return response;
    },
  });
};

export const useUpdatePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, PatchUserParams>({
    mutationKey: ["update_patch_user"],
    mutationFn: async ({ userId, section, data }) => {
      const url = `/api/v1/user/admin/${userId}?section=${encodeURIComponent(
        section
      )}`;
      return await apiClient(url, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_user_superAdmin"] });
    },
  });
};

export const useAddUserOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, any>({
    mutationKey: ["add_user_organizaton"],
    mutationFn: async (data) => {
      const url = `/api/v1/organization/user/add/${data}`;
      return await apiClient(url, {
        method: "GET",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_user_superAdmin"] });
    },
  });
};
