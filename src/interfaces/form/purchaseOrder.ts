export type CreatePurchaseOrderValues = {
  providerId: number;
  date: string; // DD/MM/YYYY format for DatePicker component
  shippingFee: number;
  products: PurchaseOrderProduct[];
};

export type PurchaseOrderProduct = {
  id: number;
  code: string;
  name: string;
  unit: string;
  amount: number;
  unitCost: number;
  unitCostAfterShip: number;
  unitPrice: number;
  profit: number;
  grossMargin: number;
  isNew: boolean;
  purchaseOrderItems?: any[];
  baseUnitPrice?: number;
  maxAmount?: number;
};
