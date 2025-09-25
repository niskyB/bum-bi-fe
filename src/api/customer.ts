import bumbiServiceClient from "main/config/axios/bumbiService";
import { Customer } from "main/interfaces/entity/customer";

export const getCustomersApi = async () => {
  return bumbiServiceClient.get<Customer[]>("/customers");
};

export const addCustomerApi = async (payload: { name: string }) => {
  return bumbiServiceClient.post("/customers", payload);
};
