import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { adminApi, DashboardStats } from '../../api/adminApi';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingVendors, setPendingVendors] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getFullDashboard();
      setStats(data.stats);
      setTotalProducts(data.total_products);
      setTotalRevenue(data.total_revenue);
      setPendingVendors(data.pending_vendors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return '₹' + (value / 100000).toFixed(2) + 'L';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statCards: StatCard[] = stats ? [
    {
      title: 'Total Users',
      value: stats.total_users.toLocaleString(),
      change: 12.5,
      changeLabel: 'vs last month',
      icon: <Users size={24} />,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Active Vendors',
      value: stats.total_vendors.toLocaleString(),
      change: 8.2,
      changeLabel: 'vs last month',
      icon: <Building2 size={24} />,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      change: 15.3,
      changeLabel: 'vs last month',
      icon: <Package size={24} />,
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: -2.4,
      changeLabel: 'vs last month',
      icon: <DollarSign size={24} />,
      iconBg: 'bg-yellow-100 text-yellow-600',
    },
  ] : [];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Admin Dashboard</h1>
          <p className="text-primary-500 mt-1">
            Welcome back, {user?.firstName}! Here is your platform overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary-500">
          <Clock size={16} />
          <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-primary-200 p-6">
            <div className="flex items-start justify-between">
              <div className={'w-12 h-12 rounded-xl ' + stat.iconBg + ' flex items-center justify-center'}>
                {stat.icon}
              </div>
              <div className={'flex items-center gap-1 text-sm ' + (stat.change >= 0 ? 'text-green-600' : 'text-red-600')}>
                {stat.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-primary-900">{stat.value}</h3>
              <p className="text-sm text-primary-500 mt-1">{stat.title}</p>
              <p className="text-xs text-primary-400 mt-1">{stat.changeLabel}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Summary */}
        <div className="bg-white rounded-xl border border-primary-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-primary-900">User Statistics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-primary-600">Total Customers</span>
              <span className="font-semibold text-primary-900">{stats?.total_customers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-600">Total Vendors</span>
              <span className="font-semibold text-primary-900">{stats?.total_vendors || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-600">Active Users</span>
              <span className="font-semibold text-primary-900">{stats?.active_users || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-600">New This Month</span>
              <span className="font-semibold text-green-600">+{stats?.new_users_this_month || 0}</span>
            </div>
          </div>
        </div>

        {/* Vendors Summary */}
        <div className="bg-white rounded-xl border border-primary-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Building2 className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-primary-900">Vendor Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-primary-600">Total Vendors</span>
              <span className="font-semibold text-primary-900">{stats?.total_vendors || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-600">Pending Approval</span>
              <span className="font-semibold text-yellow-600">{pendingVendors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-600">New This Month</span>
              <span className="font-semibold text-green-600">+{stats?.new_vendors_this_month || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-primary-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Activity className="text-purple-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-primary-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <a href="/admin/users" className="block p-3 rounded-lg hover:bg-primary-50 transition-colors">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-primary-600" />
                <span className="text-primary-900">Manage Users</span>
              </div>
            </a>
            <a href="/admin/categories" className="block p-3 rounded-lg hover:bg-primary-50 transition-colors">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-primary-600" />
                <span className="text-primary-900">Manage Categories</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700">
            <Users size={18} />
            <span className="text-sm font-medium">New Users This Month</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">{stats?.new_users_this_month || 0}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 text-green-700">
            <Building2 size={18} />
            <span className="text-sm font-medium">New Vendors</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">{stats?.new_vendors_this_month || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700">
            <Package size={18} />
            <span className="text-sm font-medium">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2">{totalProducts}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">Pending Approvals</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-2">{pendingVendors}</p>
        </div>
      </div>
    </div>
  );
}
