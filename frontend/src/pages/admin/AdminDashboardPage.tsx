import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'vendor_signup' | 'order_placed' | 'vendor_approved' | 'vendor_rejected';
  description: string;
  timestamp: string;
}

interface PendingItem {
  id: string;
  type: 'vendor_approval' | 'refund_request' | 'dispute';
  title: string;
  description: string;
  createdAt: string;
}

const mockStats: StatCard[] = [
  {
    title: 'Total Users',
    value: '2,456',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: <Users size={24} />,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Active Vendors',
    value: '186',
    change: 8.2,
    changeLabel: 'vs last month',
    icon: <Building2 size={24} />,
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    title: 'Total Products',
    value: '1,847',
    change: 15.3,
    changeLabel: 'vs last month',
    icon: <Package size={24} />,
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Monthly Revenue',
    value: '₹12,45,678',
    change: -2.4,
    changeLabel: 'vs last month',
    icon: <DollarSign size={24} />,
    iconBg: 'bg-yellow-100 text-yellow-600',
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'vendor_signup',
    description: 'New vendor "Equipment Pro" registered',
    timestamp: '2024-01-30T10:30:00',
  },
  {
    id: '2',
    type: 'order_placed',
    description: 'Order #ORD-2024-0125 placed by John Doe',
    timestamp: '2024-01-30T09:45:00',
  },
  {
    id: '3',
    type: 'vendor_approved',
    description: 'Vendor "RentAll Solutions" approved',
    timestamp: '2024-01-30T09:00:00',
  },
  {
    id: '4',
    type: 'user_signup',
    description: 'New customer "Sarah Wilson" registered',
    timestamp: '2024-01-29T16:20:00',
  },
  {
    id: '5',
    type: 'vendor_rejected',
    description: 'Vendor application "QuickRent" rejected',
    timestamp: '2024-01-29T14:30:00',
  },
];

const mockPendingItems: PendingItem[] = [
  {
    id: '1',
    type: 'vendor_approval',
    title: 'Prime Rentals',
    description: 'Vendor registration pending approval',
    createdAt: '2024-01-28',
  },
  {
    id: '2',
    type: 'vendor_approval',
    title: 'Tech Equipment Hub',
    description: 'Vendor registration pending approval',
    createdAt: '2024-01-29',
  },
  {
    id: '3',
    type: 'refund_request',
    title: 'Order #ORD-2024-0098',
    description: 'Customer requested refund - damaged product',
    createdAt: '2024-01-27',
  },
  {
    id: '4',
    type: 'dispute',
    title: 'Order #ORD-2024-0089',
    description: 'Dispute raised by customer - late delivery',
    createdAt: '2024-01-26',
  },
];

const topVendors = [
  { name: 'Equipment Pro Solutions', revenue: 1200000, orders: 198, rating: 4.6 },
  { name: 'Vendor Inc', revenue: 850000, orders: 156, rating: 4.8 },
  { name: 'RentAll Solutions', revenue: 680000, orders: 145, rating: 4.5 },
  { name: 'Heavy Machinery Rentals', revenue: 520000, orders: 89, rating: 4.3 },
  { name: 'Event Equipment Pro', revenue: 450000, orders: 134, rating: 4.7 },
];

const categoryBreakdown = [
  { category: 'Construction Equipment', percentage: 35, color: 'bg-blue-500' },
  { category: 'Event & Party', percentage: 25, color: 'bg-green-500' },
  { category: 'Electronics', percentage: 20, color: 'bg-purple-500' },
  { category: 'Vehicles', percentage: 12, color: 'bg-yellow-500' },
  { category: 'Others', percentage: 8, color: 'bg-gray-500' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <Users className="text-blue-500" size={16} />;
      case 'vendor_signup':
        return <Building2 className="text-green-500" size={16} />;
      case 'order_placed':
        return <ShoppingCart className="text-purple-500" size={16} />;
      case 'vendor_approved':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'vendor_rejected':
        return <AlertTriangle className="text-red-500" size={16} />;
      default:
        return <Activity className="text-gray-500" size={16} />;
    }
  };

  const getPendingIcon = (type: PendingItem['type']) => {
    switch (type) {
      case 'vendor_approval':
        return <Building2 className="text-yellow-500" size={16} />;
      case 'refund_request':
        return <DollarSign className="text-red-500" size={16} />;
      case 'dispute':
        return <AlertTriangle className="text-orange-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Admin Dashboard</h1>
          <p className="text-primary-500 mt-1">
            Welcome back, {user?.firstName}! Here's your platform overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary-500">
          <Clock size={16} />
          <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-primary-200 p-6">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-primary-200">
          <div className="p-6 border-b border-primary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">Recent Activity</h2>
              <button className="text-sm text-primary-600 hover:text-primary-900">View all</button>
            </div>
          </div>
          <div className="divide-y divide-primary-100">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-primary-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary-900">{activity.description}</p>
                    <p className="text-xs text-primary-500 mt-1">
                      {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl border border-primary-200">
          <div className="p-6 border-b border-primary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">Pending Actions</h2>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                {mockPendingItems.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-primary-100">
            {mockPendingItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-primary-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {getPendingIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-900">{item.title}</p>
                    <p className="text-xs text-primary-500 mt-0.5">{item.description}</p>
                    <p className="text-xs text-primary-400 mt-1">
                      {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-900 font-medium">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-primary-200">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-900 font-medium">
              View all pending actions
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <div className="bg-white rounded-xl border border-primary-200">
          <div className="p-6 border-b border-primary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">Top Vendors</h2>
              <BarChart3 className="text-primary-400" size={20} />
            </div>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-primary-500 uppercase">
                  <th className="text-left pb-3">Vendor</th>
                  <th className="text-right pb-3">Revenue</th>
                  <th className="text-right pb-3">Orders</th>
                  <th className="text-right pb-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {topVendors.map((vendor, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-700">
                          {index + 1}
                        </span>
                        <span className="text-primary-900 font-medium truncate max-w-[150px]">
                          {vendor.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right text-primary-700">
                      ₹{(vendor.revenue / 100000).toFixed(1)}L
                    </td>
                    <td className="text-right text-primary-700">{vendor.orders}</td>
                    <td className="text-right">
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        ★ {vendor.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-primary-200">
          <div className="p-6 border-b border-primary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">Revenue by Category</h2>
              <PieChart className="text-primary-400" size={20} />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-primary-700">{item.category}</span>
                    <span className="text-primary-900 font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-primary-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-500">Total Revenue (This Month)</span>
                <span className="text-lg font-bold text-primary-900">₹12,45,678</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700">
            <Users size={18} />
            <span className="text-sm font-medium">New Users Today</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">24</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 text-green-700">
            <ShoppingCart size={18} />
            <span className="text-sm font-medium">Orders Today</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">47</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700">
            <Package size={18} />
            <span className="text-sm font-medium">Products Listed</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2">12</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">Issues Open</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}
