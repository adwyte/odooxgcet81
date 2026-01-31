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
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockDashboardStats, mockOrders, mockProducts } from '../../data/mockData';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(mockDashboardStats.totalRevenue),
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign size={24} />,
      roles: ['vendor', 'admin'],
    },
    {
      title: user?.role === 'customer' ? 'My Orders' : 'Total Orders',
      value: mockDashboardStats.totalOrders.toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: <ShoppingCart size={24} />,
      roles: ['customer', 'vendor', 'admin'],
    },
    {
      title: 'Active Rentals',
      value: mockDashboardStats.activeRentals.toString(),
      change: '+3',
      changeType: 'positive',
      icon: <Package size={24} />,
      roles: ['customer', 'vendor', 'admin'],
    },
    {
      title: 'Pending Returns',
      value: mockDashboardStats.pendingReturns.toString(),
      change: '-2',
      changeType: 'negative',
      icon: <Clock size={24} />,
      roles: ['customer', 'vendor', 'admin'],
    },
    {
      title: 'Total Products',
      value: mockProducts.length.toString(),
      change: '+5',
      changeType: 'positive',
      icon: <Package size={24} />,
      roles: ['vendor', 'admin'],
    },
    {
      title: 'Active Vendors',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: <Building2 size={24} />,
      roles: ['admin'],
    },
    {
      title: 'Total Users',
      value: '156',
      change: '+15',
      changeType: 'positive',
      icon: <Users size={24} />,
      roles: ['admin'],
    },
  ];

  const filteredStats = stats.filter(stat => 
    user && stat.roles.includes(user.role)
  ).slice(0, 4);

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">
            Welcome back, {user?.name?.split(' ')[0]}!
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
        {filteredStats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-900">
                {stat.icon}
              </div>
              <span className={`inline-flex items-center text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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
          </div>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart - Only for Vendor/Admin */}
        {(user?.role === 'vendor' || user?.role === 'admin') && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary-900">Revenue Overview</h2>
              <select className="text-sm border border-primary-200 rounded-lg px-3 py-1.5">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {mockDashboardStats.revenueByMonth.map((item) => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="w-10 text-sm text-primary-500">{item.month}</span>
                  <div className="flex-1 bg-primary-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-primary-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.revenue / 25000) * 100}%` }}
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

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary-900">Top Rental Products</h2>
            <BarChart3 size={20} className="text-primary-400" />
          </div>
          
          <div className="space-y-4">
            {mockDashboardStats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-primary-700">{product.name}</span>
                <span className="text-sm font-medium text-primary-900">{product.rentals} rentals</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status - For Customer show different view */}
        {user?.role === 'customer' ? (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary-900">My Rental Status</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {mockDashboardStats.ordersByStatus.map((item) => (
                <div key={item.status} className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary-900">{item.count}</p>
                  <p className="text-sm text-primary-500">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary-900">Orders by Status</h2>
            </div>
            
            <div className="space-y-3">
              {mockDashboardStats.ordersByStatus.map((item) => {
                const total = mockDashboardStats.ordersByStatus.reduce((acc, i) => acc + i.count, 0);
                const percentage = Math.round((item.count / total) * 100);
                const colors: Record<string, string> = {
                  'Completed': 'bg-green-500',
                  'Active': 'bg-blue-500',
                  'Pending': 'bg-yellow-500',
                  'Cancelled': 'bg-red-500',
                };
                
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-600">{item.status}</span>
                      <span className="font-medium text-primary-900">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors[item.status] || 'bg-primary-500'}`}
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
        <div className="p-6 border-b border-primary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-900">Recent Orders</h2>
            <a href="/orders" className="text-sm text-primary-600 hover:text-primary-900 font-medium">
              View all →
            </a>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50">
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-3">Order #</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-3">Customer</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-3">Rental Period</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-3">Amount</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4">
                    <a href={`/orders/${order.id}`} className="text-sm font-medium text-primary-900 hover:text-primary-600">
                      {order.orderNumber}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-600">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-primary-600">
                    {format(new Date(order.rentalStartDate), 'MMM d')} - {format(new Date(order.rentalEndDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-primary-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      order.status === 'completed' || order.status === 'returned' ? 'badge-success' :
                      order.status === 'picked_up' ? 'badge-info' :
                      order.status === 'confirmed' ? 'badge-info' :
                      order.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    } capitalize`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions - For Customers */}
      {user?.role === 'customer' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-primary-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a href="/products" className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <Package size={24} className="text-primary-700" />
              <span className="text-sm font-medium text-primary-700">Browse Products</span>
            </a>
            <a href="/quotations" className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <TrendingUp size={24} className="text-primary-700" />
              <span className="text-sm font-medium text-primary-700">My Quotations</span>
            </a>
            <a href="/orders" className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <ShoppingCart size={24} className="text-primary-700" />
              <span className="text-sm font-medium text-primary-700">My Orders</span>
            </a>
            <a href="/invoices" className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <DollarSign size={24} className="text-primary-700" />
              <span className="text-sm font-medium text-primary-700">Invoices</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
