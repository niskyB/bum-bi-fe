export interface OrderItem {
  productId: number;
  amount: number;
  unitCost: number;
  unitPrice: number;
  isFree: boolean;
}

export interface Order {
  id: number;
  date: string;
  customerId: number;
  customerName: string;
  totalAmount: number;
  profit: number;
  orderItems: OrderItem[];
}
