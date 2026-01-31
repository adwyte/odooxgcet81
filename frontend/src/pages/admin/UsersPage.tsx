import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Edit2,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { UserRole } from '../../types';

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

const mockUsersList: MockUser[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    phone: '+91 98765 43210',
    role: 'customer',
    companyName: 'Customer Corp',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-28',
  },
  {
    id: '2',
    name: 'Jane Vendor',
    email: 'vendor@example.com',
    phone: '+91 98765 43211',
    role: 'vendor',
    companyName: 'Vendor Inc',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-29',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+91 98765 43212',
    role: 'admin',
    companyName: 'RentPe',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-30',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    phone: '+91 98765 43213',
    role: 'customer',
    companyName: 'Wilson Enterprises',
    status: 'active',
    createdAt: '2024-01-18',
    lastLogin: '2024-01-25',
  },
  {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike@rentals.com',
    phone: '+91 98765 43214',
    role: 'vendor',
    companyName: 'Quick Rentals',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-20',
  },
  {
    id: '6',
    name: 'Emily Brown',
    email: 'emily@events.com',
    phone: '+91 98765 43215',
    role: 'customer',
    companyName: 'Event Masters',
    status: 'suspended',
    createdAt: '2023-12-15',
    lastLogin: '2024-01-10',
  },
];

const roleColors: Record<UserRole, string> = {
  customer: 'badge-info',
  vendor: 'badge-warning',
  admin: 'badge-success',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
};

export default function UsersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto text-primary-300 mb-4" />
        <h2 className="text-xl font-semibold text-primary-900 mb-2">Access Denied</h2>
        <p className="text-primary-500">You don't have permission to view this page.</p>
      </div>
    );
  }

  const filteredUsers = mockUsersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: mockUsersList.length,
    customers: mockUsersList.filter(u => u.role === 'customer').length,
    vendors: mockUsersList.filter(u => u.role === 'vendor').length,
    admins: mockUsersList.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Users</h1>
          <p className="text-primary-500">Manage system users and their access</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-2xl font-bold text-primary-900">{stats.total}</p>
          <p className="text-sm text-primary-500">Total Users</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.customers}</p>
          <p className="text-sm text-primary-500">Customers</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-yellow-600">{stats.vendors}</p>
          <p className="text-sm text-primary-500">Vendors</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-green-600">{stats.admins}</p>
          <p className="text-sm text-primary-500">Admins</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="input pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => { setShowRoleFilter(!showRoleFilter); setShowStatusFilter(false); }}
                className="btn btn-secondary"
              >
                <Shield size={18} />
                {roleFilter === 'all' ? 'All Roles' : roleFilter}
                <ChevronDown size={16} className={`transition-transform ${showRoleFilter ? 'rotate-180' : ''}`} />
              </button>
              
              {showRoleFilter && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                  {['all', 'customer', 'vendor', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => { setRoleFilter(role as UserRole | 'all'); setShowRoleFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 capitalize ${
                        roleFilter === role ? 'bg-primary-100 font-medium' : ''
                      }`}
                    >
                      {role === 'all' ? 'All Roles' : role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setShowStatusFilter(!showStatusFilter); setShowRoleFilter(false); }}
                className="btn btn-secondary"
              >
                <Filter size={18} />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
                <ChevronDown size={16} className={`transition-transform ${showStatusFilter ? 'rotate-180' : ''}`} />
              </button>
              
              {showStatusFilter && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                  {['all', 'active', 'inactive', 'suspended'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setShowStatusFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 capitalize ${
                        statusFilter === status ? 'bg-primary-100 font-medium' : ''
                      }`}
                    >
                      {status === 'all' ? 'All Status' : status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-200">
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-4">User</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-4">Contact</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-4">Company</th>
                <th className="text-center text-sm font-medium text-primary-600 px-6 py-4">Role</th>
                <th className="text-center text-sm font-medium text-primary-600 px-6 py-4">Status</th>
                <th className="text-left text-sm font-medium text-primary-600 px-6 py-4">Last Login</th>
                <th className="text-center text-sm font-medium text-primary-600 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-primary-900">{u.name}</p>
                        <p className="text-sm text-primary-500">Joined {format(new Date(u.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-primary-700 flex items-center gap-2">
                        <Mail size={14} className="text-primary-400" />
                        {u.email}
                      </p>
                      <p className="text-sm text-primary-500 flex items-center gap-2">
                        <Phone size={14} className="text-primary-400" />
                        {u.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-primary-700">{u.companyName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`badge ${roleColors[u.role]} capitalize`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[u.status]} capitalize`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-600">
                    {format(new Date(u.lastLogin), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() => setSelectedUser(selectedUser === u.id ? null : u.id)}
                        className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={18} className="text-primary-500" />
                      </button>
                      
                      {selectedUser === u.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2">
                            <Edit2 size={14} />
                            Edit User
                          </button>
                          {u.status === 'active' ? (
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-yellow-600">
                              <UserX size={14} />
                              Suspend User
                            </button>
                          ) : (
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-green-600">
                              <UserCheck size={14} />
                              Activate User
                            </button>
                          )}
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-red-600">
                            <Trash2 size={14} />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-primary-300 mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">No users found</h3>
            <p className="text-primary-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-6">Add New User</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" placeholder="Enter full name" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="Enter email" />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input" placeholder="Enter phone number" />
              </div>
              <div>
                <label className="label">Company Name</label>
                <input type="text" className="input" placeholder="Enter company name" />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input">
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button className="btn btn-primary flex-1">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
