import bumbiServiceClient from "main/config/axios/bumbiService";
import { Order, OrderItem } from "main/interfaces/entity/order";

export const addOrderApi = async (payload: {
  date: string;
  customerId: number;
  orderItems: OrderItem[];
}) => {
  return bumbiServiceClient.post("/orders", payload);
};

export const getOrdersApi = async () => {
  return bumbiServiceClient.get<Order[]>("/orders");
};
