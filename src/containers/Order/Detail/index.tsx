import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "main/components/Button";
import Table from "main/components/Table";
import { FunctionComponent, useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vietnameseCurrencyFormatter } from "main/utils/number";
import { Order } from "main/interfaces/entity/order";

interface OrderProps {}

const OrderDetail: FunctionComponent<OrderProps> = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { title: "Sản phẩm", key: "productName", dataIndex: "productName" },
    { title: "Số lượng", key: "amount", dataIndex: "amount" },
    {
      title: "Giá nhập",
      key: "unitCost",
      dataIndex: "unitCost",
      render: (value: number) => vietnameseCurrencyFormatter.format(value),
    },
    {
      title: "Giá bán",
      key: "unitPrice",
      dataIndex: "unitPrice",
      render: (value: number) => vietnameseCurrencyFormatter.format(value),
    },
    {
      title: "Lợi nhuận",
      key: "profit",
      dataIndex: "profit",
      render: (value: number) => vietnameseCurrencyFormatter.format(value),
    },
    {
      title: "Miễn phí",
      key: "isFree",
      dataIndex: "isFree",
      render: (value: boolean) => (value ? "Có" : "Không"),
    },
  ];

  useEffect(() => {
    // Get order data from sessionStorage
    const storedOrder = sessionStorage.getItem("selectedOrder");
    if (storedOrder) {
      try {
        const orderData = JSON.parse(storedOrder);
        setOrder(orderData);
        // Clear the stored data after use
        sessionStorage.removeItem("selectedOrder");
      } catch (error) {
        console.error("Error parsing stored order data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const dataTable = useMemo(() => {
    if (!order?.orderItems) return [];
    return order.orderItems.map((item, index) => ({
      stt: index + 1,
      ...item,
      profit: item.unitPrice - item.unitCost,
    }));
  }, [order]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="flex flex-col py-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
        <Button
          variant="primary"
          type="submit"
          preIcon={<ArrowDownTrayIcon className="h-5" />}
          onClick={() => router.push("/order/create")}
        >
          Tạo đơn hàng
        </Button>
      </div>

      {/* Order Information */}
      <div className="bg-white p-2 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2">
            <label className="font-medium">Ngày mua:</label>
            <p>{order.date}</p>
          </div>
          <div className="flex gap-2">
            <label className="font-medium">Khách hàng:</label>
            <p>{order.customerName}</p>
          </div>
          <div className="flex gap-2">
            <label className="font-medium">Tổng giá trị:</label>
            <p className="font-semibold text-green-600">
              {vietnameseCurrencyFormatter.format(order.totalAmount)}
            </p>
          </div>
          <div className="flex gap-2">
            <label className="font-medium">Lợi nhuận:</label>
            <p className="font-semibold text-blue-600">
              {vietnameseCurrencyFormatter.format(order.profit)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="flex-1 min-h-0">
        <h2 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h2>
        <div className="h-[550px] overflow-auto">
          <Table
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            loading={isLoading}
            sticky={{
              offsetHeader: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
