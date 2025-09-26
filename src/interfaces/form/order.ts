export type CreateOrderValues = {
  customerId: number;
  date: string;
  discount: number;
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
