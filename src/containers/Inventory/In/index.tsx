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
import { useAddProvider, useGetProviders } from "main/hooks/provider";
import { useAddPurchaseOrder } from "main/hooks/purchaseOrder";
import { useGetProducts } from "main/hooks/product";
import { CreatePurchaseOrderValues } from "main/interfaces/form/purchaseOrder";
import { ISelectOptions } from "main/interfaces/form/select";
import { createPurchaseOrderSchema } from "main/schema/purchaseOrder";
import { FunctionComponent, PropsWithChildren, useMemo, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import { Input, Dropdown, Menu } from "antd";
import { vietnameseCurrencyFormatter } from "main/utils/number";

interface InventoryInProps {}

const BorderBox: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border border-gray-200 p-5 rounded-lg w-full">
      {children}
    </div>
  );
};

// Helper function to recalculate a single product's dependent fields
const recalculateProductFields = (
  methods: any,
  index: number,
  unitCostAfterShip: number,
  calculateProfit: any,
  calculateGrossMargin: any
) => {
  const unitPrice = methods.getValues(`products.${index}.unitPrice`) || 0;
  if (unitPrice > 0) {
    const profit = calculateProfit(unitCostAfterShip, unitPrice);
    const grossMargin = calculateGrossMargin(profit, unitPrice);
    methods.setValue(`products.${index}.profit`, profit);
    methods.setValue(`products.${index}.grossMargin`, grossMargin);
  }
};

const createProductColumns = (
  onRemoveProduct: (index: number) => void,
  control: any,
  errors: any,
  methods: any,
  calculateUnitCostAfterShip: (
    unitCost: number,
    shippingFee: number,
    totalQuantity: number
  ) => number,
  calculateProfit: (unitCostAfterShip: number, unitPrice: number) => number,
  calculateGrossMargin: (profit: number, unitPrice: number) => number
) => [
  {
    title: "Mã hàng hóa",
    key: "code",
    dataIndex: "code",
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        label=""
        type="text"
        className="block px-4 py-3 intro-x"
        placeholder="Mã hàng hóa"
        name={`products.${index}.code`}
      />
    ),
  },
  {
    title: "Tên hàng hóa",
    key: "name",
    dataIndex: "name",
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        label=""
        type="text"
        className="block px-4 py-3 intro-x"
        placeholder="Tên hàng hóa"
        name={`products.${index}.name`}
      />
    ),
  },
  {
    title: "Đơn vị tính",
    key: "unit",
    dataIndex: "unit",
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        name={`products.${index}.unit`}
        label=""
        type="text"
        className="block px-4 py-3 intro-x"
        placeholder="Đơn vị"
      />
    ),
  },
  {
    title: "Số lượng",
    key: "amount",
    dataIndex: "amount",
    render: (_: any, record: any, index: number) => (
      <TextFieldC
        name={`products.${index}.amount`}
        label=""
        type="number"
        className="block px-4 py-3 intro-x"
        placeholder="Số lượng"
        min={1}
        onChange={(e) => {
          const amount = parseFloat(e.target.value) || 0;
          const shippingFee = methods.getValues("shippingFee") || 0;
          const products = methods.getValues("products");
          const totalQuantity = products.reduce(
            (sum: number, product: any, idx: number) =>
              sum + (idx === index ? amount : Number(product.amount || 0)),
            0
          );

          // Recalculate unitCostAfterShip for all products
          products.forEach((product: any, idx: number) => {
            const unitCost = product.unitCost || 0;
            const unitCostAfterShip = calculateUnitCostAfterShip(
              unitCost,
              shippingFee,
              totalQuantity
            );
            methods.setValue(
              `products.${idx}.unitCostAfterShip`,
              unitCostAfterShip
            );

            // Recalculate profit and gross margin if unitPrice is set
            const unitPrice = product.unitPrice || 0;
            if (unitPrice > 0) {
              const profit = calculateProfit(unitCostAfterShip, unitPrice);
              const grossMargin = calculateGrossMargin(profit, unitPrice);
              methods.setValue(`products.${idx}.profit`, profit);
              methods.setValue(`products.${idx}.grossMargin`, grossMargin);
            }
          });
        }}
      />
    ),
  },
  {
    title: "Giá nhập",
    key: "unitCost",
    dataIndex: "unitCost",
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`products.${index}.unitCost`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`products.${index}.unitCost`}
            placeholder="0 VND"
            className="block px-4 py-3 intro-x"
            onValueChange={(value: string | undefined) => {
              const unitCost = parseFloat(value || "0");
              field.onChange(unitCost);

              const shippingFee = methods.getValues("shippingFee") || 0;
              const totalQuantity = methods
                .getValues("products")
                .reduce(
                  (sum: number, product: any) =>
                    sum + Number(product.amount || 0),
                  0
                );

              const unitCostAfterShip = calculateUnitCostAfterShip(
                unitCost,
                shippingFee,
                totalQuantity
              );

              methods.setValue(
                `products.${index}.unitCostAfterShip`,
                unitCostAfterShip
              );

              // Recalculate profit and gross margin
              recalculateProductFields(
                methods,
                index,
                unitCostAfterShip,
                calculateProfit,
                calculateGrossMargin
              );
            }}
          />
        )}
      />
    ),
  },
  {
    title: "Giá sau vận chuyển",
    key: "unitCostAfterShip",
    dataIndex: "unitCostAfterShip",
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`products.${index}.unitCostAfterShip`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`products.${index}.unitCostAfterShip`}
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
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`products.${index}.unitPrice`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`products.${index}.unitPrice`}
            placeholder="0 VND"
            className="block px-4 py-3 intro-x"
            onValueChange={(value: string | undefined) => {
              const unitPrice = parseFloat(value || "0");
              field.onChange(unitPrice);

              const unitCostAfterShip =
                methods.getValues(`products.${index}.unitCostAfterShip`) || 0;

              // Recalculate profit and gross margin
              recalculateProductFields(
                methods,
                index,
                unitCostAfterShip,
                calculateProfit,
                calculateGrossMargin
              );
            }}
          />
        )}
      />
    ),
  },
  {
    title: "Lợi nhuận",
    key: "profit",
    dataIndex: "profit",
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`products.${index}.profit`}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            name={`products.${index}.profit`}
            placeholder="0 VND"
            className="block px-4 py-3 intro-x"
            disabled
          />
        )}
      />
    ),
  },
  {
    title: "Gross Margin",
    key: "grossMargin",
    dataIndex: "grossMargin",
    render: (_: any, record: any, index: number) => (
      <Controller
        name={`products.${index}.grossMargin`}
        control={control}
        render={({ field }) => (
          <FormInput
            {...field}
            name={`products.${index}.grossMargin`}
            type="text"
            className="block px-4 py-3 intro-x"
            placeholder="0%"
            value={field.value ? `${field.value.toFixed(2)}%` : ""}
            disabled
          />
        )}
      />
    ),
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    render: (_: any, record: any, index: number) => (
      <div className="flex gap-3">
        <Button
          onClick={() => onRemoveProduct(index)}
          variant="outline-primary"
          className="text-[#FD4D5F]"
          preIcon={<TrashIcon className="h-5" />}
        />
      </div>
    ),
  },
];

const InventoryIn: FunctionComponent<InventoryInProps> = () => {
  const [isAddProvider, setIsAddProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { openNotification } = useNotification();
  const { mutateAsync: addProvider } = useAddProvider();
  const { mutateAsync: addPurchaseOrder } = useAddPurchaseOrder();

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

  const methods = useForm<CreatePurchaseOrderValues>({
    resolver: yupResolver(createPurchaseOrderSchema),
    mode: "onSubmit", // Only validate on submit, not on change/blur
    reValidateMode: "onSubmit", // Only re-validate on submit
    defaultValues: {
      date: new Date().toLocaleDateString("en-GB"), // DD/MM/YYYY format for DatePicker
      shippingFee: 0,
      products: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "products",
  });

  const calculateUnitCostAfterShip = (
    unitCost: number,
    shippingFee: number,
    totalQuantity: number
  ) => {
    if (totalQuantity === 0) return unitCost;
    const result = unitCost + shippingFee / totalQuantity;
    return Number(result.toFixed(0));
  };

  const calculateProfit = (unitCostAfterShip: number, unitPrice: number) => {
    const result = unitPrice - unitCostAfterShip;
    return Number(result.toFixed(2));
  };

  const calculateGrossMargin = (profit: number, unitPrice: number) => {
    if (unitPrice === 0) return 0;
    const result = (profit / unitPrice) * 100;
    return Number(result.toFixed(2));
  };

  // Reusable function to recalculate all products
  const recalculateAllProducts = () => {
    const shippingFee = methods.getValues("shippingFee") || 0;
    const products = methods.getValues("products");
    const totalQuantity = products.reduce(
      (sum: number, product: any) => sum + Number(product.amount || 0),
      0
    );

    products.forEach((product: any, index: number) => {
      const unitCost = product.unitCost || 0;
      const unitCostAfterShip = calculateUnitCostAfterShip(
        unitCost,
        shippingFee,
        totalQuantity
      );
      methods.setValue(
        `products.${index}.unitCostAfterShip`,
        unitCostAfterShip
      );

      // Recalculate profit and gross margin
      recalculateProductFields(
        methods,
        index,
        unitCostAfterShip,
        calculateProfit,
        calculateGrossMargin
      );
    });
  };

  const onAddProduct = () => {
    const newProduct = {
      id: fields.length + 1,
      code: "",
      name: "",
      unit: "cái",
      amount: 1,
      unitCost: 0,
      unitCostAfterShip: 0,
      unitPrice: 0,
      profit: 0,
      grossMargin: 0,
      isNew: true,
      key: fields.length + 1,
    };

    append(newProduct);
    // Recalculate all products after adding
    setTimeout(recalculateAllProducts, 0);
  };

  const onRemoveProduct = (index: number) => {
    remove(index);
    // Recalculate all remaining products after removing
    setTimeout(recalculateAllProducts, 0);
  };

  const productColumns = createProductColumns(
    onRemoveProduct,
    methods.control,
    methods.formState.errors,
    methods,
    calculateUnitCostAfterShip,
    calculateProfit,
    calculateGrossMargin
  );

  const onSubmitDialog = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await addProvider(data);
      openNotification("success", {
        message: "Nhập thành công",
      });
      setIsAddProvider(false);
    } catch (error: any) {
      openNotification("error", {
        message: error.response?.data?.message ?? error.message,
      });
    } finally {
      setIsLoading(false);
    }
  });

  const onSubmit = async (data: CreatePurchaseOrderValues) => {
    try {
      const payload = {
        ...data,
        purchaseOrderItems: data.products.map((product) => ({
          ...product,
          id: product.isNew ? undefined : product.id,
          code: product.code,
          name: product.name,
          unit: product.unit,
          unitCost: product.unitCostAfterShip,
        })),
      };
      await addPurchaseOrder(payload);
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

  const { data: providers } = useGetProviders();
  const { data: products, isLoading: isProductsLoading } = useGetProducts(
    searchText || undefined
  );

  const providerOptions = useMemo<ISelectOptions<string, unknown>[]>(() => {
    return (
      providers?.map((provider) => ({
        label: provider.name,
        value: provider.id,
      })) || []
    );
  }, [providers]);

  const handleProductSelect = (product: any) => {
    const existingProduct = fields.find((p: any) => p.code === product.code);
    if (existingProduct) {
      return;
    }
    const newProduct = {
      id: product.id,
      code: product.code,
      name: product.name,
      unit: product.unit,
      amount: 1,
      unitCost: 0, // Default unit cost
      unitCostAfterShip: 0, // Will be calculated after adding
      unitPrice: +product.unitPrice,
      profit: 0, // Will be calculated after adding
      grossMargin: 0, // Will be calculated after adding
      isNew: false,
      key: product.code,
    };

    append(newProduct);
    setSearchText("");
    setIsSearchVisible(false);

    // Recalculate all products after adding the new one
    setTimeout(() => {
      recalculateAllProducts();
    }, 0);
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
      <div className="flex flex-col py-10 space-y-4">
        <div className="flex justify-end">
          <Button
            variant="primary"
            type="submit"
            preIcon={<PlusIcon className="h-5" />}
            onClick={() => setIsAddProvider(true)}
          >
            Nhà Cung Cấp
          </Button>
        </div>
        <BorderBox>
          <FormWrapper methods={methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 w-full items-end">
                  <div className="flex-1">
                    <Controller
                      name="date"
                      control={methods.control}
                      render={({ field }) => (
                        <DatePicker
                          label="Ngày nhập"
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
                      Phí vận chuyển
                    </label>
                    <Controller
                      name="shippingFee"
                      control={methods.control}
                      render={({ field }) => (
                        <CurrencyInput
                          {...field}
                          name="shippingFee"
                          placeholder="0 VND"
                          className="block px-4 py-[9px] intro-x login__input min-w-full"
                          onValueChange={(value: string | undefined) => {
                            const numericValue = parseFloat(value || "0");
                            field.onChange(numericValue);

                            // Recalculate all products
                            recalculateAllProducts();
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <SelectFieldC
                      label="Nhà cung cấp"
                      name="providerId"
                      options={providerOptions}
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
                  <Button
                    variant="primary"
                    className="btn btn-primary"
                    preIcon={<PlusIcon className="h-5" />}
                    onClick={() => onAddProduct()}
                  >
                    Sản phẩm
                  </Button>
                </div>
                <div>
                  <Table
                    columns={productColumns}
                    dataSource={fields}
                    scroll={{ x: 1000, y: 470 }}
                    pagination={false}
                  ></Table>
                </div>

                <div className="flex gap-3 justify-end flex-col md:flex-row">
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn btn-primary"
                    // isLoading={isCreating}
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
        open={isAddProvider}
        onClose={() => {
          setIsAddProvider(false);
        }}
        className="z-[999]"
      >
        <Dialog.Panel>
          <div className="w-full p-5 text-center">
            <div className="mt-5 text-3xl mb-5">Nhà cung cấp</div>
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
                      placeholder="Tên nhà cung cấp"
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
                setIsAddProvider(false);
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

export default InventoryIn;
