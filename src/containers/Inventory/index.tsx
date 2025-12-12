import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Button from "main/components/Button";
import Table from "main/components/Table";
import { FunctionComponent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetProducts } from "main/hooks/product";
import { vietnameseCurrencyFormatter } from "main/utils/number";
import { Input, Checkbox } from "antd";

interface InventoryProps {}

const Inventory: FunctionComponent<InventoryProps> = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showZeroQuantity, setShowZeroQuantity] = useState(false);

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
    return products
      ?.filter((product) => {
        // Filter by quantity > 0 (unless showZeroQuantity is enabled)
        if (!showZeroQuantity && product.quantity <= 0) return false;
        // Filter by name if search text exists
        if (searchText.trim()) {
          return product.name.toLowerCase().includes(searchText.toLowerCase());
        }
        return true;
      })
      ?.map((product, index) => ({
        stt: index + 1,
        ...product,
      }));
  }, [products, searchText, showZeroQuantity]);

  return (
    <div className="flex flex-col py-10 space-y-10 mt-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
              allowClear
              className="w-full inventory-filter-input"
            />
          </div>
          <Checkbox
            checked={showZeroQuantity}
            onChange={(e) => setShowZeroQuantity(e.target.checked)}
          >
            Hiển thị sản phẩm hết hàng
          </Checkbox>
        </div>
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
