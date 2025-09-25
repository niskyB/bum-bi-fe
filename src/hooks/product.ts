import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "main/api/product";

export const useGetProducts = (searchText?: string) => {
  return useQuery({
    queryKey: ["products", searchText],
    queryFn: () => getProductsApi(searchText),
    select: (data) => data.data,
  });
};
