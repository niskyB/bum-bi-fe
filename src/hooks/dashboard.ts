import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "main/api/dashboard";

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
    select: (data) => data.data,
  });
};
