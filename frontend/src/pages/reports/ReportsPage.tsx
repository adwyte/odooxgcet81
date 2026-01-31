import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  DollarSign, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  Filter,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, DashboardStats } from '../../api/dashboard';
import { ordersApi, Order } from '../../api/orders';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

type ReportType = 'revenue' | 'products' | 'orders' | 'vendors';
type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState<ReportType>('revenue');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          dashboardApi.getStats(),
          ordersApi.getOrders({ limit: 10 })
        ]);
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const reportTabs = [
    { id: 'revenue' as ReportType, label: 'Revenue', icon: <DollarSign size={18} /> },
    { id: 'products' as ReportType, label: 'Products', icon: <Package size={18} /> },
    { id: 'orders' as ReportType, label: 'Orders', icon: <TrendingUp size={18} /> },
    ...(user?.role === 'admin' ? [{ id: 'vendors' as ReportType, label: 'Vendors', icon: <Users size={18} /> }] : []),
  ];

  // Mock vendor performance data for admin (to be replaced with API later)
  const vendorPerformance = [
    { name: 'Vendor Inc', orders: 28, revenue: 85000, rating: 4.8 },
    { name: 'Equipment Pro', orders: 22, revenue: 62000, rating: 4.6 },
    { name: 'RentAll Solutions', orders: 18, revenue: 48000, rating: 4.5 },
    { name: 'Prime Rentals', orders: 15, revenue: 35000, rating: 4.3 },
    { name: 'EventGear Co', orders: 12, revenue: 28000, rating: 4.2 },
  ];

  const ordersByDay = [
    { day: 'Mon', orders: 8, revenue: 12500 },
    { day: 'Tue', orders: 12, revenue: 18000 },
    { day: 'Wed', orders: 10, revenue: 15500 },
    { day: 'Thu', orders: 15, revenue: 22000 },
    { day: 'Fri', orders: 18, revenue: 28000 },
    { day: 'Sat', orders: 22, revenue: 35000 },
    { day: 'Sun', orders: 14, revenue: 21000 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  const totalOrders = stats?.total_orders || 0;
  const totalRevenue = stats?.total_revenue || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Reports & Analytics</h1>
          <p className="text-primary-500">Insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="input w-auto"
          >
            <option value="week">Last 7 days</option>
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
            <option value="year">This year</option>
          </select>
          <button className="btn btn-primary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} />
              <span className="ml-1">+12.5%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-900 mt-4">{formatPrice(totalRevenue)}</p>
          <p className="text-sm text-primary-500">Total Revenue</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} />
              <span className="ml-1">+8.2%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-900 mt-4">{totalOrders}</p>
          <p className="text-sm text-primary-500">Total Orders</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} />
              <span className="ml-1">+5.3%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-900 mt-4">{formatPrice(Math.round(avgOrderValue))}</p>
          <p className="text-sm text-primary-500">Avg. Order Value</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-yellow-600" />
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <TrendingDown size={16} />
              <span className="ml-1">-2.1%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-900 mt-4">87%</p>
          <p className="text-sm text-primary-500">Repeat Customers</p>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="card">
        <div className="border-b border-primary-200">
          <div className="flex overflow-x-auto">
            {reportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeReport === tab.id
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-primary-500 hover:text-primary-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Revenue Report */}
          {activeReport === 'revenue' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900">Revenue by Month</h3>
              <div className="space-y-4">
                {(stats?.revenue_by_month || []).length > 0 ? (
                  (stats?.revenue_by_month || []).map((item) => {
                    const maxRevenue = Math.max(...(stats?.revenue_by_month || []).map(r => r.revenue), 1);
                    const percentage = (item.revenue / maxRevenue) * 100;
                    
                    return (
                      <div key={item.month} className="flex items-center gap-4">
                        <span className="w-12 text-sm text-primary-500">{item.month}</span>
                        <div className="flex-1 bg-primary-100 rounded-full h-8 overflow-hidden">
                          <div 
                            className="bg-primary-900 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 30 && (
                              <span className="text-xs font-medium text-white">{formatPrice(item.revenue)}</span>
                            )}
                          </div>
                        </div>
                        {percentage <= 30 && (
                          <span className="w-24 text-sm font-medium text-right">{formatPrice(item.revenue)}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-primary-500 py-4">No revenue data available</p>
                )}
              </div>

              {/* Daily breakdown */}
              <div className="mt-8 pt-6 border-t border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">This Week's Performance</h3>
                <div className="grid grid-cols-7 gap-2">
                  {ordersByDay.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="h-32 flex flex-col justify-end mb-2">
                        <div 
                          className="bg-primary-200 rounded-t-lg mx-auto w-8 transition-all hover:bg-primary-300"
                          style={{ height: `${(day.orders / 25) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs font-medium text-primary-700">{day.day}</p>
                      <p className="text-xs text-primary-500">{day.orders}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Report */}
          {activeReport === 'products' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900">Top Performing Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary-200">
                      <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Rank</th>
                      <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Product</th>
                      <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Category</th>
                      <th className="text-center text-sm font-medium text-primary-600 py-3 px-4">Rentals</th>
                      <th className="text-right text-sm font-medium text-primary-600 py-3 px-4">Revenue</th>
                      <th className="text-right text-sm font-medium text-primary-600 py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100">
                    {(stats?.top_products || []).length > 0 ? (
                      (stats?.top_products || []).map((product, index) => (
                        <tr key={product.name} className="hover:bg-primary-50">
                          <td className="py-4 px-4">
                            <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium ${
                              index < 3 ? 'bg-primary-900 text-white' : 'bg-primary-100 text-primary-700'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium text-primary-900">{product.name}</td>
                          <td className="py-4 px-4 text-primary-600">Electronics</td>
                          <td className="py-4 px-4 text-center text-primary-900">{product.rentals}</td>
                          <td className="py-4 px-4 text-right font-medium text-primary-900">
                            {formatPrice(product.rentals * 2500)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="inline-flex items-center text-green-600 text-sm">
                              <TrendingUp size={14} />
                              <span className="ml-1">+{Math.floor(Math.random() * 20) + 5}%</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-primary-500">
                          No product data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Product Category Distribution */}
              <div className="mt-8 pt-6 border-t border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Category Distribution</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {['Electronics', 'Audio', 'Event Equipment', 'Power Equipment', 'Furniture'].map((cat, idx) => {
                    const values = [35, 25, 18, 12, 10];
                    return (
                      <div key={cat} className="bg-primary-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-primary-900">{values[idx]}%</p>
                        <p className="text-sm text-primary-500">{cat}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Orders Report */}
          {activeReport === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900">Orders Overview</h3>
              
              {/* Order Status Distribution */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(stats?.orders_by_status || []).map((item) => {
                  const colors: Record<string, string> = {
                    'Completed': 'bg-green-100 text-green-700',
                    'Active': 'bg-blue-100 text-blue-700',
                    'Pending': 'bg-yellow-100 text-yellow-700',
                    'Cancelled': 'bg-red-100 text-red-700',
                  };
                  
                  return (
                    <div key={item.status} className={`rounded-xl p-4 ${colors[item.status] || 'bg-primary-100 text-primary-700'}`}>
                      <p className="text-3xl font-bold">{item.count}</p>
                      <p className="text-sm opacity-80">{item.status}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="mt-6 pt-6 border-t border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary-200">
                        <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Order #</th>
                        <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Customer</th>
                        <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Date</th>
                        <th className="text-right text-sm font-medium text-primary-600 py-3 px-4">Amount</th>
                        <th className="text-center text-sm font-medium text-primary-600 py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-primary-50">
                            <td className="py-4 px-4 font-medium text-primary-900">{order.order_number}</td>
                            <td className="py-4 px-4 text-primary-600">{order.customer_name || 'N/A'}</td>
                            <td className="py-4 px-4 text-primary-600">
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </td>
                            <td className="py-4 px-4 text-right font-medium text-primary-900">
                              {formatPrice(order.total_amount)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`badge ${
                                order.status === 'completed' || order.status === 'returned' ? 'badge-success' :
                                order.status === 'picked_up' || order.status === 'confirmed' ? 'badge-info' :
                                order.status === 'pending' ? 'badge-warning' : 'badge-danger'
                              } capitalize`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-primary-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Vendors Report (Admin Only) */}
          {activeReport === 'vendors' && user?.role === 'admin' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary-900">Vendor Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary-200">
                      <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Rank</th>
                      <th className="text-left text-sm font-medium text-primary-600 py-3 px-4">Vendor</th>
                      <th className="text-center text-sm font-medium text-primary-600 py-3 px-4">Orders</th>
                      <th className="text-right text-sm font-medium text-primary-600 py-3 px-4">Revenue</th>
                      <th className="text-center text-sm font-medium text-primary-600 py-3 px-4">Rating</th>
                      <th className="text-center text-sm font-medium text-primary-600 py-3 px-4">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100">
                    {vendorPerformance.map((vendor, index) => (
                      <tr key={vendor.name} className="hover:bg-primary-50">
                        <td className="py-4 px-4">
                          <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium ${
                            index < 3 ? 'bg-primary-900 text-white' : 'bg-primary-100 text-primary-700'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">{vendor.name[0]}</span>
                            </div>
                            <span className="font-medium text-primary-900">{vendor.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-primary-900">{vendor.orders}</td>
                        <td className="py-4 px-4 text-right font-medium text-primary-900">
                          {formatPrice(vendor.revenue)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-yellow-600">
                            ⭐ {vendor.rating}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="w-full bg-primary-100 rounded-full h-2 max-w-[100px] mx-auto">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(vendor.rating / 5) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="card p-6">
        <h3 className="font-semibold text-primary-900 mb-4">Export Reports</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-secondary">
            <Download size={18} />
            Export as PDF
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export as Excel
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
