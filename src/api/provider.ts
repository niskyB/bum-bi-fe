import bumbiServiceClient from "main/config/axios/bumbiService";
import { Provider } from "main/interfaces/entity/provider";

export const addProviderApi = async (payload: { name: string }) => {
  return bumbiServiceClient.post("/providers", payload);
};

export const getProvidersApi = async () => {
  return bumbiServiceClient.get<Provider[]>("/providers");
};
