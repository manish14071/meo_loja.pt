import { useEffect, useState } from "react"
import { useGetUsersQuery, useGetUserStatsQuery } from "../../redux/api/usersApiSlice"
import { useGetProductsQuery } from "../../redux/api/productApiSlice"
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice"
import { FaUsers, FaClipboardList, FaShoppingCart, FaUserShield } from "react-icons/fa"
import Loader from "../../components/Loader"
import { formatDate } from "../../utils/formatDate"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const AdminDashboard = () => {
  const { data: users, isLoading: loadingUsers, error: usersError } = useGetUsersQuery()
  const { data: userStats, isLoading: loadingStats, error: statsError } = useGetUserStatsQuery()
  const { data: products, isLoading: loadingProducts, error: productsError } = useGetProductsQuery({})
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useGetOrdersQuery()

  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    totalSales: 0,
  })

  useEffect(() => {
    if (users && products && orders) {
      setStats({
        userCount: users.length,
        productCount: products.length,
        orderCount: orders.length,
        totalSales: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      })
    }
  }, [users, products, orders])

  if (loadingUsers || loadingProducts || loadingOrders || loadingStats) {
    return <Loader />
  }

  if (usersError || statsError || productsError || ordersError) {
    return (
      <div className="text-red-500 p-4">
        Error: {usersError?.message || statsError?.message || productsError?.message || ordersError?.message}
      </div>
    )
  }

  const totalUsers = userStats?.total_users || 0
  const adminCount = userStats?.admin_count || 0
  const newUsersLastWeek = userStats?.new_users_last_week || 0

  // Mock data for the chart
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4500 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 5500 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Users" value={totalUsers} icon={<FaUsers />} color="bg-blue-500" />
        <DashboardCard title="Admin Users" value={adminCount} icon={<FaUserShield />} color="bg-purple-500" />
        <DashboardCard
          title="Total Products"
          value={stats.productCount}
          icon={<FaClipboardList />}
          color="bg-green-500"
        />
        <DashboardCard title="Total Orders" value={stats.orderCount} icon={<FaShoppingCart />} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.slice(0, 5).map((user) => (
                  <tr key={user.id} className="text-black">
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-lg shadow-md text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </div>
)

export default AdminDashboard

