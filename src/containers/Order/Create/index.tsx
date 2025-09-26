import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "main/components/Button";
import CurrencyInput from "main/components/Form/CurrencyInput";
import { DatePicker } from "main/components/Form/DatePicker";
import FormInput from "main/components/Form/FormInput";
import FormLabel from "main/components/Form/FormLabel";
import FormWrapper from "main/components/Form/FormWrapper";
import SelectFieldC from "main/components/Form/SelectField";
import TextFieldC from "main/components/Form/TextField";
import Dialog from "main/components/Headless/Dialog";
import Table from "main/components/Table";
import { useNotification } from "main/hooks/notification";
import { useAddCustomer, useGetCustomers } from "main/hooks/customer";
import { useGetProducts } from "main/hooks/product";
import { ISelectOptions } from "main/interfaces/form/select";
import { FunctionComponent, PropsWithChildren, useMemo, useState } from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { Input, Dropdown, Menu } from "antd";
import { vietnameseCurrencyFormatter } from "main/utils/number";
import { CreateOrderValues } from "main/interfaces/form/order";
import { createOrderSchema } from "main/schema/order";
import { useAddOrder } from "main/hooks/order";

interface OrderCreateProps {}

const BorderBox: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border border-gray-200 p-5 rounded-lg w-full">
      {children}
    </div>
  );
};

// Helper function to calculate unit cost based on amount and purchaseOrderItems
const calculateUnitCostFromPurchaseItems = (
  amount: number,
  purchaseOrderItems: any[]
): number => {
  if (!purchaseOrderItems || purchaseOrderItems.length === 0) {
    return 0;
  }

  // Sort purchaseOrderItems by createdAt date (earliest first)
  const sortedItems = [...purchaseOrderItems].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let totalCost = 0;
  let remainingAmount = amount;
  let currentItemIndex = 0;

  while (remainingAmount > 0 && currentItemIndex < sortedItems.length) {
    const currentItem = sortedItems[currentItemIndex];
    const availableQuantity = parseFloat(currentItem.quantity) || 0;
    const unitCost = parseFloat(currentItem.unitCost) || 0;

    if (availableQuantity > 0) {
      const amountToUse = Math.min(remainingAmount, availableQuantity);
      totalCost += amountToUse * unitCost;
      remainingAmount -= amountToUse;
    }

    currentItemIndex++;
  }

  return totalCost;
};

const createOrderItemColumns = (
  onRemoveOrderItem: (index: number) => void,
  control: any,
  errors: any,
  methods: any,
  calculateProfit: (unitCostAfterShip: number, unitPrice: number) => number
) => [
  {
    title: "Mã hàng hóa",
    key: "code",
    dataIndex: "code",
    width: 142,
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        label=""
        type="text"
        className="block px-4 py-3 intro-x"
        placeholder="Mã hàng hóa"
        name={`orderItems.${index}.code`}
        disabled
      />
    ),
  },
  {
    title: "Tên hàng hóa",
    key: "name",
    dataIndex: "name",
    width: 200,
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        label=""
        type="text"
        className="block px-4 py-3 intro-x"
        placeholder="Tên hàng hóa"
        name={`orderItems.${index}.name`}
        disabled
      />
    ),
  },
  {
    title: "Đơn vị tính",
    key: "unit",
    dataIndex: "unit",
    width: 120,
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        name={`orderItems.${index}.unit`}
        label=""
        type="text"
        className="block px-4 py-3 intro-x"
        placeholder="Đơn vị"
        disabled
      />
    ),
  },
  {
    title: "Số lượng",
    key: "amount",
    dataIndex: "amount",
    width: 90,
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        name={`orderItems.${index}.amount`}
        label=""
        type="number"
        className="block px-4 py-3 intro-x"
        placeholder="Số lượng"
        min={1}
        max={record.maxAmount || undefined}
        onChange={(e) => {
          const amount = parseFloat(e.target.value) || 0;
          const maxAmount = record.maxAmount || 0;

          // Validate against maximum amount
          if (maxAmount > 0 && amount > maxAmount) {
            // Reset to maximum allowed amount
            e.target.value = maxAmount.toString();
            const validatedAmount = maxAmount;
            methods.setValue(`orderItems.${index}.amount`, validatedAmount);

            // Continue with validation logic using validated amount
            const products = methods.getValues("orderItems");

            // Recalculate unitCost and unitPrice for the current product based on amount
            const currentProduct = products[index];

            // Recalculate unitCost based on purchaseOrderItems
            if (
              currentProduct &&
              currentProduct.purchaseOrderItems &&
              currentProduct.purchaseOrderItems.length > 0
            ) {
              const newUnitCost = calculateUnitCostFromPurchaseItems(
                validatedAmount,
                currentProduct.purchaseOrderItems
              );
              methods.setValue(`orderItems.${index}.unitCost`, newUnitCost);
            }

            // Recalculate unitPrice based on baseUnitPrice
            if (currentProduct && currentProduct.baseUnitPrice) {
              const newUnitPrice =
                currentProduct.baseUnitPrice * validatedAmount;
              methods.setValue(`orderItems.${index}.unitPrice`, newUnitPrice);
            }

            // Recalculate unitCostAfterShip for all products
            products.forEach((product: any, idx: number) => {
              const unitCost = product.unitCost || 0;
              methods.setValue(`orderItems.${idx}.unitCost`, unitCost);

              // Recalculate profit and gross margin if unitPrice is set
              const unitPrice = product.unitPrice || 0;
              if (unitPrice > 0) {
                const profit = calculateProfit(unitCost, unitPrice);
                methods.setValue(`orderItems.${idx}.profit`, profit);
              }
            });
            return;
          }

          const products = methods.getValues("orderItems");

          // Recalculate unitCost and unitPrice for the current product based on amount
          const currentProduct = products[index];

          // Recalculate unitCost based on purchaseOrderItems
          if (
            currentProduct &&
            currentProduct.purchaseOrderItems &&
            currentProduct.purchaseOrderItems.length > 0
          ) {
            const newUnitCost = calculateUnitCostFromPurchaseItems(
              amount,
              currentProduct.purchaseOrderItems
            );
            methods.setValue(`orderItems.${index}.unitCost`, newUnitCost);
          }

          // Recalculate unitPrice based on baseUnitPrice
          if (currentProduct && currentProduct.baseUnitPrice) {
            const newUnitPrice = currentProduct.baseUnitPrice * amount;
            methods.setValue(`orderItems.${index}.unitPrice`, newUnitPrice);
          }

          // Recalculate unitCostAfterShip for all products
          products.forEach((product: any, idx: number) => {
            const unitCost = product.unitCost || 0;
            methods.setValue(`orderItems.${idx}.unitCost`, unitCost);

            // Recalculate profit and gross margin if unitPrice is set
            const unitPrice = product.unitPrice || 0;
            if (unitPrice > 0) {
              const profit = calculateProfit(unitCost, unitPrice);
              methods.setValue(`orderItems.${idx}.profit`, profit);
            }
          });
        }}
      />
    ),
  },

  {
    title: "Giá vốn",
    key: "unitCost",
    dataIndex: "cost",
    width: 120,
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`orderItems.${index}.unitCost`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`orderItems.${index}.unitCost`}
            placeholder="0 VND"
            className="block px-4 py-3 intro-x"
            disabled
          />
        )}
      />
    ),
  },
  {
    title: "Giá bán",
    key: "unitPrice",
    dataIndex: "unitPrice",
    width: 120,
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`orderItems.${index}.unitPrice`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`orderItems.${index}.unitPrice`}
            placeholder="0 VND"
            className="block px-4 py-3 intro-x"
            disabled
          />
        )}
      />
    ),
  },
  {
    title: "Lợi nhuận",
    key: "profit",
    dataIndex: "profit",
    width: 120,
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`orderItems.${index}.profit`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`orderItems.${index}.profit`}
            placeholder="0 VND"
            className="block px-4 py-3 intro-x"
            disabled
          />
        )}
      />
    ),
  },
  {
    title: "Hàng tặng",
    key: "isFree",
    dataIndex: "isFree",
    width: 100,
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`orderItems.${index}.isFree`}
        control={control}
        render={({ field }) => (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={field.value || false}
              onChange={(e) => {
                const isChecked = e.target.checked;
                field.onChange(isChecked);

                // Get current unitCost value
                const unitCost =
                  methods.getValues(`orderItems.${index}.unitCost`) || 0;

                if (isChecked) {
                  // When checked: set unitPrice to 0 and profit to negative unitCost
                  methods.setValue(`orderItems.${index}.unitPrice`, 0);
                  methods.setValue(`orderItems.${index}.profit`, -unitCost);
                } else {
                  // When unchecked: restore original unitPrice and recalculate profit
                  const baseUnitPrice = record.baseUnitPrice || 0;
                  const amount =
                    methods.getValues(`orderItems.${index}.amount`) || 1;
                  const restoredUnitPrice = baseUnitPrice * amount;
                  methods.setValue(
                    `orderItems.${index}.unitPrice`,
                    restoredUnitPrice
                  );
                  methods.setValue(
                    `orderItems.${index}.profit`,
                    restoredUnitPrice - unitCost
                  );
                }
              }}
              className="w-4 h-4 text-[#FD4D5F] bg-gray-100 border-gray-300 rounded focus:ring-[#FD4D5F]"
              style={{ accentColor: "#FD4D5F" }}
            />
          </div>
        )}
      />
    ),
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    width: 80,
    fixed: "right" as const,
    render: (_: any, record: any, index: number) => (
      <div className="flex gap-3">
        <Button
          onClick={() => onRemoveOrderItem(index)}
          variant="outline-primary"
          className="text-[#FD4D5F]"
          preIcon={<TrashIcon className="h-5" />}
        />
      </div>
    ),
  },
];

const OrderCreate: FunctionComponent<OrderCreateProps> = () => {
  const [isAddCustomer, setIsAddCustomer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { openNotification } = useNotification();
  const { mutateAsync: addCustomer } = useAddCustomer();
  const { mutateAsync: addOrder } = useAddOrder();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      name: "",
    },
  });

  const methods = useForm<CreateOrderValues>({
    resolver: yupResolver(createOrderSchema),
    mode: "onSubmit", // Only validate on submit, not on change/blur
    reValidateMode: "onSubmit", // Only re-validate on submit
    defaultValues: {
      date: new Date().toLocaleDateString("en-GB"), // DD/MM/YYYY format for DatePicker
      discount: 0,
      orderItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "orderItems",
  });

  const calculateProfit = (unitCost: number, unitPrice: number) => {
    const result = unitPrice - unitCost;
    return Number(result.toFixed(2));
  };

  // Watch orderItems and discount for changes to make totals reactive
  const orderItems = useWatch({
    control: methods.control,
    name: "orderItems",
    defaultValue: [],
  });

  const discount = useWatch({
    control: methods.control,
    name: "discount",
    defaultValue: 0,
  });

  // Calculate total unitPrice and total profit (reactive)
  const totals = useMemo(() => {
    const totalUnitPrice = (orderItems || []).reduce(
      (sum: number, item: any) => {
        return sum + (Number(item?.unitPrice) || 0);
      },
      0
    );

    const totalProfit = (orderItems || []).reduce((sum: number, item: any) => {
      return sum + (Number(item?.profit) || 0);
    }, 0);

    const finalTotalPrice = Math.max(
      0,
      totalUnitPrice - (Number(discount) || 0)
    );

    const finalTotalProfit = totalProfit - (Number(discount) || 0);

    return { totalUnitPrice: finalTotalPrice, totalProfit: finalTotalProfit };
  }, [orderItems, discount]);

  const onRemoveOderItem = (index: number) => {
    remove(index);
  };

  const orderItemColumns = createOrderItemColumns(
    onRemoveOderItem,
    methods.control,
    methods.formState.errors,
    methods,
    calculateProfit
  );

  const onSubmitDialog = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await addCustomer(data);
      openNotification("success", {
        message: "Nhập thành công",
      });
      setIsAddCustomer(false);
    } catch (error: any) {
      openNotification("error", {
        message: error.response?.data?.message ?? error.message,
      });
    } finally {
      setIsLoading(false);
    }
  });

  const onSubmit = async (data: CreateOrderValues) => {
    try {
      const payload = {
        ...data,
        orderItems: data.orderItems.map((orderItem) => ({
          ...orderItem,
        })),
      };
      await addOrder(payload);
      openNotification("success", {
        message: "Nhập hàng thành công",
      });
      methods.reset();
    } catch (error: any) {
      openNotification("error", {
        message: error.message || "Có lỗi xảy ra",
      });
    }
  };

  const { data: customers } = useGetCustomers();
  const { data: products, isLoading: isProductsLoading } = useGetProducts(
    searchText || undefined
  );

  const customerOptions = useMemo<ISelectOptions<string, unknown>[]>(() => {
    return (
      customers?.map((customer) => ({
        label: customer.name,
        value: customer.id,
      })) || []
    );
  }, [customers]);

  const handleProductSelect = (product: any) => {
    // Calculate initial unit cost based on purchaseOrderItems
    let initialUnitCost = 0;
    let maxAmount = 0;
    if (product.purchaseOrderItems && product.purchaseOrderItems.length > 0) {
      // Calculate unit cost for amount = 1 using the new logic
      initialUnitCost = calculateUnitCostFromPurchaseItems(
        1,
        product.purchaseOrderItems
      );

      // Calculate maximum amount from sum of all purchaseOrderItems amounts
      maxAmount = product.purchaseOrderItems.reduce(
        (sum: number, item: any) => {
          return sum + (parseFloat(item.quantity) || 0);
        },
        0
      );
    }

    // Calculate initial unit price based on product unitPrice
    const baseUnitPrice = parseFloat(product.unitPrice) || 0;
    const initialUnitPrice = baseUnitPrice; // For amount = 1, unitPrice = baseUnitPrice

    const newProduct = {
      productId: product.id,
      name: product.name,
      unit: product.unit,
      code: product.code,
      isFree: false,
      amount: 1, // Default amount is 1
      unitCost: initialUnitCost, // Set unit cost from purchaseOrderItems
      unitPrice: initialUnitPrice, // Set unit price from product data
      profit: initialUnitPrice - initialUnitCost,
      key: product.code,
      // Store the original purchaseOrderItems for unit cost calculation
      purchaseOrderItems: product.purchaseOrderItems || [],
      // Store the base unit price for unit price calculation
      baseUnitPrice: baseUnitPrice,
      // Store the maximum amount allowed
      maxAmount: maxAmount,
    };

    append(newProduct);
    setSearchText("");
    setIsSearchVisible(false);
  };

  const productSearchItems = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.map((product) => ({
      key: product.id,
      label: (
        <div className="flex justify-between items-center p-2 cursor-pointer">
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-500">Code: {product.code}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {vietnameseCurrencyFormatter.format(product.unitPrice)}
            </div>
            <div className="text-sm text-gray-500">Unit: {product.unit}</div>
          </div>
        </div>
      ),
      onClick: () => handleProductSelect(product),
    }));
  }, [products, fields.length]);

  return (
    <>
      <div className="flex flex-col py-6 space-y-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end">
          <Button
            variant="primary"
            type="submit"
            preIcon={<PlusIcon className="h-5" />}
            onClick={() => setIsAddCustomer(true)}
          >
            Khách Hàng
          </Button>
        </div>
        <BorderBox>
          <FormWrapper methods={methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col gap-2">
                <div className="flex gap-3 w-full items-end">
                  <div className="flex-1">
                    <Controller
                      name="date"
                      control={methods.control}
                      render={({ field }) => (
                        <DatePicker
                          label="Ngày bán"
                          name="date"
                          value={
                            field.value
                              ? dayjs(field.value, "DD/MM/YYYY")
                              : undefined
                          }
                          onChange={(date, dateString) => {
                            field.onChange(dateString);
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      className="cursor-pointer select-none text-sm"
                      htmlFor="shippingFee"
                    >
                      Giảm giá
                    </label>
                    <Controller
                      name="discount"
                      control={methods.control}
                      render={({ field }) => (
                        <CurrencyInput
                          {...field}
                          name="discount"
                          placeholder="0 VND"
                          className="block px-4 py-[9px] intro-x login__input min-w-full"
                          onValueChange={(value: string | undefined) => {
                            const numericValue = parseFloat(value || "0");
                            field.onChange(numericValue);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <SelectFieldC
                      label="Khách hàng"
                      name="customerId"
                      options={customerOptions}
                      formSelectSize="lg"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <Dropdown
                      open={isSearchVisible && searchText.length > 0}
                      onOpenChange={setIsSearchVisible}
                      popupRender={() => (
                        <div className="bg-white border border-[#FD4D5F]/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {isProductsLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              Đang tìm kiếm...
                            </div>
                          ) : productSearchItems.length > 0 ? (
                            <Menu items={productSearchItems} />
                          ) : searchText.length > 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              Không tìm thấy sản phẩm
                            </div>
                          ) : null}
                        </div>
                      )}
                      trigger={["click"]}
                    >
                      <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchText}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                          setIsSearchVisible(e.target.value.length > 0);
                        }}
                        onFocus={() => {
                          if (searchText.length > 0) {
                            setIsSearchVisible(true);
                          }
                        }}
                        prefix={<MagnifyingGlassIcon className="h-4 w-4 " />}
                        className="w-full custom-search-input bumbi-search-input h-10"
                      />
                    </Dropdown>
                  </div>
                </div>
                <div className="">
                  <Table
                    columns={orderItemColumns}
                    dataSource={fields}
                    pagination={false}
                    scroll={{
                      x: 1000,
                      y: 450,
                    }}
                    sticky={{
                      offsetHeader: 0,
                    }}
                  />
                </div>

                <div className="flex gap-3 justify-between items-center flex-col md:flex-row">
                  <div className="flex gap-6 text-lg font-semibold">
                    <div className="text-gray-700">
                      Tổng đơn hàng:{" "}
                      <span className="text-[#FD4D5F]">
                        {vietnameseCurrencyFormatter.format(
                          totals.totalUnitPrice
                        )}
                      </span>
                    </div>
                    <div className="text-gray-700">
                      Tổng lợi nhuận:{" "}
                      <span
                        className={
                          totals.totalProfit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {vietnameseCurrencyFormatter.format(totals.totalProfit)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn btn-primary"
                    isLoading={isLoading}
                  >
                    Tạo đơn
                  </Button>
                </div>
              </div>
            </form>
          </FormWrapper>
        </BorderBox>
      </div>
      <Dialog
        open={isAddCustomer}
        onClose={() => {
          setIsAddCustomer(false);
        }}
        className="z-[999]"
      >
        <Dialog.Panel>
          <div className="w-full p-5 text-center">
            <div className="mt-5 text-3xl mb-5">Khách hàng</div>
            <div className="flex flex-col">
              <div className="flex gap-1 mt-5">
                <FormLabel htmlFor="name" className="whitespace-nowrap">
                  Tên:
                </FormLabel>
              </div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="relative intro-x my-[10px]">
                    <FormInput
                      {...field}
                      type="text"
                      formInputSize="lg"
                      id="name"
                      placeholder="Tên khách hàng"
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="px-5 pb-8 text-center flex justify-end">
            <Button
              onClick={() => {
                reset();
                setIsAddCustomer(false);
              }}
              className="w-20 mr-1 focus:ring-0 text-[#FD4D5F]"
              isLoading={isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={onSubmitDialog}
              variant="primary"
              isLoading={isLoading}
            >
              Nhập
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default OrderCreate;
