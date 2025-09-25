import bumbiServiceClient from "main/config/axios/bumbiService";
import { Dashboard } from "main/interfaces/entity/dashboard";

export const getDashboardApi = async () => {
  return bumbiServiceClient.get<Dashboard>("/dashboard");
};
