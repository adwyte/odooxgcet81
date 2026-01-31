import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
  Users,
  Building2,
  Loader2,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, DashboardStats } from '../../api/dashboard';
import { ordersApi, Order } from '../../api/orders';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          dashboardApi.getStats(),
          ordersApi.getOrders({ limit: 5 })
        ]);
        setStats(statsData);
        setRecentOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.total_revenue || 0),
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign size={24} />,
      roles: ['vendor', 'admin'],
      link: '/reports/revenue',
    },
    {
      title: user?.role === 'customer' ? 'My Orders' : 'Total Orders',
      value: (stats?.total_orders || 0).toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: <ShoppingCart size={24} />,
      roles: ['customer', 'vendor', 'admin'],
      link: user?.role === 'customer' ? '/orders?filter=paid' : '/orders',
    },
    {
      title: 'Active Rentals',
      value: (stats?.active_rentals || 0).toString(),
      change: '+3',
      changeType: 'positive',
      icon: <Package size={24} />,
      roles: ['customer', 'vendor', 'admin'],
      link: '/orders?status=picked_up',
    },
    {
      title: 'Pending Returns',
      value: (stats?.pending_returns || 0).toString(),
      change: '-2',
      changeType: 'negative',
      icon: <Clock size={24} />,
      roles: ['customer', 'vendor', 'admin'],
      link: '/returns?filter=pending',
    },
    {
      title: 'Total Products',
      value: (stats?.total_products || 0).toString(),
      change: '+5',
      changeType: 'positive',
      icon: <Package size={24} />,
      roles: ['vendor', 'admin'],
      link: '/products',
    },
    {
      title: 'Active Vendors',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: <Building2 size={24} />,
      roles: ['admin'],
      link: '/vendors',
    },
    {
      title: 'Total Users',
      value: '156',
      change: '+15',
      changeType: 'positive',
      icon: <Users size={24} />,
      roles: ['admin'],
      link: '/users',
    },
  ];

  const filteredStats = statCards.filter(stat =>
    user && stat.roles.includes(user.role)
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-primary-500">
            Here's what's happening with your {user?.role === 'customer' ? 'rentals' : 'business'} today.
          </p>
        </div>
        <div className="text-sm text-primary-500 flex items-center gap-2">
          <Calendar size={16} />
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStats.map((stat, index) => {
          const content = (
            <>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-900">
                  {stat.icon}
                </div>
                <span className={`inline-flex items-center text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-primary-900">{stat.value}</p>
                <p className="text-sm text-primary-500">{stat.title}</p>
              </div>
            </>
          );

          if (stat.link) {
            return (
              <a key={index} href={stat.link} className="card p-6 hover:shadow-md transition-shadow">
                {content}
              </a>
            );
          }

          return (
            <div key={index} className="card p-6">
              {content}
            </div>
          );
        })}
      </div>

      {/* Revenue Chart - Full Width for Vendor/Admin */}
      {(user?.role === 'vendor' || user?.role === 'admin') && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary-900">Revenue Overview</h2>
            <select className="text-sm border border-primary-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {(stats?.revenue_by_month || []).map((item) => (
              <div key={item.month} className="flex items-center gap-4">
                <span className="w-10 text-sm text-primary-500">{item.month}</span>
                <div className="flex-1 bg-primary-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-primary-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.revenue / Math.max(...(stats?.revenue_by_month || []).map(m => m.revenue), 1)) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-sm font-medium text-right">
                  {formatPrice(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid for Split Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Top Product - Flexible Height */}
        <div className="card p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary-900">Top Rental Products</h2>
            <BarChart3 size={20} className="text-primary-400" />
          </div>

          <div className="space-y-4">
            {(stats?.top_products || []).map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary-900">{product.name}</p>
                  <div className="w-full bg-primary-100 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary-900 h-1.5 rounded-full"
                      style={{ width: `${Math.min((product.rentals / 20) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-primary-900">{product.rentals}</span>
              </div>
            ))}
            {(stats?.top_products || []).length === 0 && (
              <p className="text-sm text-primary-500 text-center py-4">No products yet</p>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        {user?.role === 'customer' ? (
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary-900">My Rental Status</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(stats?.orders_by_status || []).map((item) => {
                const icons: Record<string, React.ReactNode> = {
                  'Completed': <CheckCircle size={20} />,
                  'Returned': <RotateCcw size={20} />,
                  'Picked Up': <Package size={20} />,
                  'Confirmed': <Calendar size={20} />,
                  'Pending': <Clock size={20} />,
                  'Cancelled': <AlertTriangle size={20} />,
                };
                // Map status to readable format if needed, assuming backend sends Camel/Pascal or formatted
                const statusKey = item.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

                return (
                  <div key={item.status} className="border border-primary-100 rounded-xl p-4 hover:border-primary-300 transition-colors flex flex-col items-center justify-center text-center group">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 mb-3 group-hover:bg-primary-900 group-hover:text-white transition-colors">
                      {icons[statusKey] || <Activity size={20} />}
                    </div>
                    <p className="text-3xl font-bold text-primary-900">{item.count}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary-500 mt-1">{statusKey}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary-900">Orders by Status</h2>
            </div>

            <div className="space-y-4">
              {(stats?.orders_by_status || []).map((item) => {
                const total = (stats?.orders_by_status || []).reduce((acc, i) => acc + i.count, 0);
                const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-primary-700 capitalize">{item.status.replace('_', ' ').toLowerCase()}</span>
                      <span className="font-bold text-primary-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-900"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-primary-100 bg-primary-50/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-900">Recent Orders</h2>
            <a href="/orders" className="btn btn-sm btn-outline bg-white">
              View All Orders
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-4">Order Details</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-4">Customer</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-4">Duration</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-4">Amount</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-primary-500 px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-primary-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <a href={`/orders/${order.id}`} className="block">
                        <span className="text-sm font-bold text-primary-900 group-hover:text-primary-700 transition-colors">
                          {order.order_number}
                        </span>
                        <span className="text-xs text-primary-400 block mt-0.5">
                          {format(new Date(order.created_at), 'MMM d, yyyy')}
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                          {(order.customer_name || 'U').charAt(0)}
                        </div>
                        {order.customer_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-600">
                      {order.rental_start_date && order.rental_end_date ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-primary-900">
                            {format(new Date(order.rental_start_date), 'MMM d')} - {format(new Date(order.rental_end_date), 'MMM d')}
                          </span>
                          <span className="text-xs text-primary-400">
                            {format(new Date(order.rental_end_date), 'yyyy')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${order.status === 'completed' || order.status === 'returned' ? 'bg-green-100 text-green-800' :
                          order.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-primary-500">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingCart size={32} className="text-primary-200 mb-2" />
                      <p>No orders found recentlly</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
