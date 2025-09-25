export type CreateOrderValues = {
  customerId: number;
  date: string;
  orderItems: OrderItem[];
};

export type OrderItem = {
  productId: number;
  amount: number;
  isFree: boolean;
  unitCost: number;
  unitPrice: number;
  profit: number;
  purchaseOrderItems?: any[];
  baseUnitPrice?: number;
  maxAmount?: number;
};
