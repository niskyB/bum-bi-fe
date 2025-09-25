import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProviderApi, getProvidersApi } from "main/api/provider";

export const useAddProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProviderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};

export const useGetProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: getProvidersApi,
    select: (data) => data.data,
  });
};
