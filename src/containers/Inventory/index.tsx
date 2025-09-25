import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "main/components/Button";
import Table from "main/components/Table";
import { FunctionComponent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetProducts } from "main/hooks/product";
import { vietnameseCurrencyFormatter } from "main/utils/number";

interface InventoryProps {}

const Inventory: FunctionComponent<InventoryProps> = () => {
  const router = useRouter();

  const columns = [
    { title: "STT", key: "stt", dataIndex: "stt" },
    { title: "Mã hàng hóa", key: "code", dataIndex: "code" },
    { title: "Tên hàng hóa", key: "name", dataIndex: "name" },
    { title: "Đơn vị tính", key: "unit", dataIndex: "unit" },
    { title: "Số lượng", key: "quantity", dataIndex: "quantity" },
    {
      title: "Giá bán",
      key: "unitPrice",
      dataIndex: "unitPrice",
      render: (value: number) => vietnameseCurrencyFormatter.format(value),
    },
  ];
  const { data: products, isLoading: isProductsLoading } = useGetProducts();

  const dataTable = useMemo(() => {
    return products?.map((product, index) => ({
      stt: index + 1,
      ...product,
    }));
  }, [products]);

  return (
    <div className="flex flex-col py-10 space-y-10 mt-10">
      <div className="flex justify-end">
        <Button
          variant="primary"
          type="submit"
          preIcon={<ArrowDownTrayIcon className="h-5" />}
          onClick={() => router.push("/inventory/in")}
        >
          Nhập Hàng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataTable}
        loading={isProductsLoading}
        pagination={{ position: ["bottomRight"] }}
        scroll={{
          x: "max-content",
        }}
      />
    </div>
  );
};

export default Inventory;
