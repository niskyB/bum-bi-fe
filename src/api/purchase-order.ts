import bumbiServiceClient from "main/config/axios/bumbiService";
import { PurchaseOrderItem } from "main/interfaces/entity/purchaseOrder";

export const addPurchaseOrderApi = async (payload: {
  date: string;
  shippingFee: number;
  providerId: number;
  purchaseOrderItems: PurchaseOrderItem[];
}) => {
  return bumbiServiceClient.post("/purchase-orders", payload);
};
