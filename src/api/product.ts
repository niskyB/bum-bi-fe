import bumbiServiceClient from "main/config/axios/bumbiService";
import { Product } from "main/interfaces/entity/product";

export const getProductsApi = async (searchText?: string) => {
  return bumbiServiceClient.get<Product[]>("/products", {
    params: {
      searchText,
    },
  });
};
