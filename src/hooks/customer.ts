import { addCustomerApi, getCustomersApi } from "main/api/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersApi,
    select: (data) => data.data,
  });
};

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
