import Table from "main/components/Table";
import { FunctionComponent, useState, useMemo } from "react";
import { vietnameseCurrencyFormatter } from "main/utils/number";
import { useGetDashboard } from "main/hooks/dashboard";
import { Input } from "antd";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
  const { data: dashboard, isLoading } = useGetDashboard();
  const [searchText, setSearchText] = useState("");

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
      sorter: (a: any, b: any) => (a.totalSell || 0) - (b.totalSell || 0),
      render: (value: number) => vietnameseCurrencyFormatter.format(value || 0),
    },
    {
      title: "Tổng lợi nhuận",
      key: "totalProfit",
      dataIndex: "totalProfit",
      sorter: (a: any, b: any) => (a.totalProfit || 0) - (b.totalProfit || 0),
      render: (value: number) => vietnameseCurrencyFormatter.format(value || 0),
    },
  ];

  // Filter customers by name - must be called before early returns
  const filteredCustomers = useMemo(() => {
    if (!dashboard?.customers) return [];
    if (!searchText.trim()) return dashboard.customers;

    return dashboard.customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [dashboard?.customers, searchText]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-lg">
          Không tìm thấy dữ liệu dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
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
              <p
                className={`text-2xl font-semibold ${
                  dashboard.totalProfit >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {vietnameseCurrencyFormatter.format(dashboard.totalProfit)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Profit Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg
                className="w-6 h-6 text-indigo-600"
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
                Tổng lợi nhuận không tính Bum Bi
              </p>
              <p
                className={`text-2xl font-semibold ${
                  dashboard.totalProfitWithoutInternalUse >= 0
                    ? "text-indigo-600"
                    : "text-red-600"
                }`}
              >
                {vietnameseCurrencyFormatter.format(
                  dashboard.totalProfitWithoutInternalUse
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Danh sách khách hàng
          </h2>
          <div className="w-64">
            <Input
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
              allowClear
              className="w-full inventory-filter-input"
            />
          </div>
        </div>
        <Table
          columns={customerColumns}
          dataSource={filteredCustomers}
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
