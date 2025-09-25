import { useMutation, useQuery } from "@tanstack/react-query";
import { addOrderApi, getOrdersApi } from "main/api/order";

export const useAddOrder = () => {
  return useMutation({
    mutationFn: addOrderApi,
  });
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersApi,
    select: (data) => data.data,
  });
};
