import { ProductStatusEnum } from "main/constants/enums/productStatus.enum";

export interface PurchaseOrderItem {
  purchaseOrderId: number;
  productId: number;
  amount: number;
  quantity: number;
  unitCost: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  status: ProductStatusEnum;
  purchaseOrderItems?: PurchaseOrderItem[];
}
