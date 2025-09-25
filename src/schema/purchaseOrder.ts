import { array, boolean, number, object, string } from "yup";

export const purchaseOrderProductSchema = object({
  id: number().required("Product ID is required"),
  code: string().required("Product code is required"),
  name: string().required("Product name is required"),
  unit: string().required("Unit is required"),
  amount: number()
    .required("Amount is required")
    .min(1, "Amount must be at least 1"),
  unitCost: number()
    .required("Unit cost is required")
    .min(0, "Unit cost must be positive"),
  unitCostAfterShip: number()
    .required("Unit cost after ship is required")
    .min(0, "Unit cost after ship must be positive"),
  unitPrice: number()
    .required("Unit price is required")
    .min(0, "Unit price must be positive"),
  profit: number().required("Profit is required"),
  grossMargin: number().required("Gross margin is required"),
  isNew: boolean().required("Is new status is required"),
});

export const createPurchaseOrderSchema = object({
  providerId: number().required("Provider is required"),
  date: string().required("Date is required"),
  shippingFee: number()
    .required("Shipping fee is required")
    .min(0, "Shipping fee must be positive"),
  products: array()
    .of(purchaseOrderProductSchema)
    .required("Products are required")
    .min(1, "At least one product is required"),
});
