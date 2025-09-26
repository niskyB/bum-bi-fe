import { array, boolean, number, object, string } from "yup";

export const orderItemSchema = object({
  productId: number().required("Product ID is required"),
  amount: number()
    .required("Amount is required")
    .min(1, "Amount must be at least 1"),
  unitCost: number()
    .required("Unit cost is required")
    .min(0, "Unit cost must be positive"),
  unitPrice: number()
    .required("Unit price is required")
    .min(0, "Unit price must be positive"),
  profit: number().required("Profit is required"),
  isFree: boolean().required("Is free status is required"),
});

export const createOrderSchema = object({
  customerId: number().required("Customer is required"),
  date: string().required("Date is required"),
  discount: number()
    .required("Discount is required")
    .min(0, "Discount must be positive"),
  orderItems: array()
    .of(orderItemSchema)
    .required("Products are required")
    .min(1, "At least one product is required"),
});
