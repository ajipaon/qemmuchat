import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../../config/clientApiConfig";
import { userParamUpdateRoleOrg } from "./type";

export const useGetUserByOrganization = (search: any) => {
  return useInfiniteQuery<ResponseType, Error>({
    queryKey: ["get_user_by_organization_superAdmin", search],
    initialPageParam: 1,
    enabled: !!search.id,
    getNextPageParam: (lastPage: any) => {
      const { page, totalPages }: any = lastPage.pages;
      if (page < totalPages) {
        return page + 1;
      } else {
        return null;
      }
    },
    queryFn: async ({ pageParam = 1 }) => {
      if (!search?.id) return;
      const response: any = await apiClient(
        `/api/v1/user/admin/organization/all/${search?.id}?name=${
          search?.name
        }&email=${search?.email}&page=${(
          pageParam as number
        ).toString()}&limit=10`
      );
      return response;
    },
  });
};

export const useUpdateRoleUserOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, userParamUpdateRoleOrg>({
    mutationKey: ["update_organizaiton_role"],
    mutationFn: async (userParamUpdateRoleOrg) => {
      const url = `/api/v1/organization/user/change/role/${userParamUpdateRoleOrg.orgId}`;
      return await apiClient(url, {
        method: "PUT",
        body: JSON.stringify(userParamUpdateRoleOrg.data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user_by_organization_superAdmin"],
      });
    },
  });
};
