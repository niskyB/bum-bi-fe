import { Customer } from "./customer";

export interface Dashboard {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalSell: number;
  totalProfit: number;
  customers: Customer[];
}
