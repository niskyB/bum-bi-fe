import Table from "main/components/Table";
import { FunctionComponent } from "react";
import { vietnameseCurrencyFormatter } from "main/utils/number";
import { useGetDashboard } from "main/hooks/dashboard";

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
  const { data: dashboard, isLoading } = useGetDashboard();

  const customerColumns = [
    { title: "ID", key: "id", dataIndex: "id" },
    { title: "Tên khách hàng", key: "name", dataIndex: "name" },
    {
      title: "Tổng đơn hàng",
      key: "totalOrders",
      dataIndex: "totalOrders",
      render: (value: number) => value || 0,
    },
    {
      title: "Tổng doanh thu",
      key: "totalSell",
      dataIndex: "totalSell",
      render: (value: number) => vietnameseCurrencyFormatter.format(value || 0),
    },
    {
      title: "Tổng lợi nhuận",
      key: "totalProfit",
      dataIndex: "totalProfit",
      render: (value: number) => vietnameseCurrencyFormatter.format(value || 0),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dashboard) {
    return <div>Dashboard data not found</div>;
  }

  return (
    <div className="flex flex-col py-10 space-y-10 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Số đơn hàng</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard.totalOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Số sản phẩm</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard.totalProducts}
              </p>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Số khách hàng</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-semibold text-green-600">
                {vietnameseCurrencyFormatter.format(dashboard.totalSell)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng lợi nhuận
              </p>
              <p className="text-2xl font-semibold text-blue-600">
                {vietnameseCurrencyFormatter.format(dashboard.totalProfit)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Danh sách khách hàng</h2>
        <Table
          columns={customerColumns}
          dataSource={dashboard.customers}
          loading={isLoading}
          pagination={{ position: ["bottomRight"] }}
          scroll={{
            x: "max-content",
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
