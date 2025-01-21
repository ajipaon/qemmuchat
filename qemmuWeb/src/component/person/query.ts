import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../config/clientApiConfig";

export const useGetAllUserSperAdmin = () => {
  return useInfiniteQuery<ResponseType, Error>({
    queryKey: ["get_user_superAdmin"],
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
        `/api/v1/user/admin/all?page=${(
          pageParam as number
        ).toString()}&limit=5`
      );
      return response;
    },
  });
};
