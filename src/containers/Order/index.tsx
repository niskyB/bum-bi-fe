import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "main/components/Button";
import Table from "main/components/Table";
import { FunctionComponent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { vietnameseCurrencyFormatter } from "main/utils/number";
import { useGetOrders } from "main/hooks/order";

interface OrderProps {}

const Order: FunctionComponent<OrderProps> = () => {
  const router = useRouter();

  const columns = [
    { title: "Ngày mua", key: "date", dataIndex: "date" },
    { title: "Khách hàng", key: "customerName", dataIndex: "customerName" },
    {
      title: "Giá trị đơn hàng",
      key: "totalAmount",
      dataIndex: "totalAmount",
      render: (value: number) => vietnameseCurrencyFormatter.format(value),
    },
    {
      title: "Lợi nhuận",
      key: "profit",
      dataIndex: "profit",
      render: (value: number) => vietnameseCurrencyFormatter.format(value),
    },
  ];
  const { data: orders, isLoading: isOrdersLoading } = useGetOrders();

  const dataTable = useMemo(() => {
    return orders?.map((order, index) => ({
      stt: index + 1,
      ...order,
    }));
  }, [orders]);

  return (
    <div className="flex flex-col py-10 space-y-10 mt-10">
      <div className="flex justify-end">
        <Button
          variant="primary"
          type="submit"
          preIcon={<ArrowDownTrayIcon className="h-5" />}
          onClick={() => router.push("/order/create")}
        >
          Tạo đơn hàng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataTable}
        loading={isOrdersLoading}
        pagination={{ position: ["bottomRight"] }}
        scroll={{
          x: "max-content",
        }}
        onRow={(record) => ({
          onClick: () => {
            // Store order data in sessionStorage to pass to detail page
            sessionStorage.setItem("selectedOrder", JSON.stringify(record));
            router.push(`/order/detail?id=${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
};

export default Order;
