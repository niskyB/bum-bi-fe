import { useMutation } from "@tanstack/react-query";
import { addPurchaseOrderApi } from "main/api/purchase-order";

export const useAddPurchaseOrder = () => {
  return useMutation({
    mutationFn: addPurchaseOrderApi,
  });
};
