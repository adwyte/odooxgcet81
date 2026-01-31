import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ChevronDown, 
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

interface MockVendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  gstin: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  commission: number;
  createdAt: string;
}

const mockVendorsList: MockVendor[] = [
  {
    id: '1',
    name: 'Jane Vendor',
    email: 'vendor@example.com',
    phone: '+91 98765 43211',
    companyName: 'Vendor Inc',
    gstin: '29XYZAB5678G2H3',
    address: '456 Vendor Street, Mumbai',
    status: 'active',
    rating: 4.8,
    totalProducts: 25,
    totalOrders: 156,
    totalRevenue: 850000,
    commission: 10,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Equipment Pro',
    email: 'contact@equipmentpro.com',
    phone: '+91 98765 43220',
    companyName: 'Equipment Pro Solutions',
    gstin: '29EQPRO1234A1B2',
    address: '789 Industrial Area, Delhi',
    status: 'active',
    rating: 4.6,
    totalProducts: 42,
    totalOrders: 198,
    totalRevenue: 1200000,
    commission: 12,
    createdAt: '2023-11-15',
  },
  {
    id: '3',
    name: 'RentAll Solutions',
    email: 'info@rentall.com',
    phone: '+91 98765 43225',
    companyName: 'RentAll Solutions Pvt Ltd',
    gstin: '29RNTALL5678C3D4',
    address: '321 Tech Park, Bangalore',
    status: 'active',
    rating: 4.5,
    totalProducts: 38,
    totalOrders: 145,
    totalRevenue: 680000,
    commission: 10,
    createdAt: '2023-12-01',
  },
  {
    id: '4',
    name: 'Prime Rentals',
    email: 'hello@primerentals.com',
    phone: '+91 98765 43230',
    companyName: 'Prime Rental Services',
    gstin: '29PRIME9012E5F6',
    address: '555 Business Hub, Pune',
    status: 'pending',
    rating: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    commission: 10,
    createdAt: '2024-01-25',
  },
  {
    id: '5',
    name: 'EventGear Co',
    email: 'support@eventgear.com',
    phone: '+91 98765 43235',
    companyName: 'EventGear Company',
    gstin: '29EVNTG3456G7H8',
    address: '999 Event Plaza, Chennai',
    status: 'suspended',
    rating: 3.2,
    totalProducts: 15,
    totalOrders: 45,
    totalRevenue: 180000,
    commission: 8,
    createdAt: '2023-10-20',
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
};

export default function VendorsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto text-primary-300 mb-4" />
        <h2 className="text-xl font-semibold text-primary-900 mb-2">Access Denied</h2>
        <p className="text-primary-500">You don't have permission to view this page.</p>
      </div>
    );
  }

  const filteredVendors = mockVendorsList.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stats = {
    total: mockVendorsList.length,
    active: mockVendorsList.filter(v => v.status === 'active').length,
    pending: mockVendorsList.filter(v => v.status === 'pending').length,
    totalRevenue: mockVendorsList.reduce((sum, v) => sum + v.totalRevenue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Vendors</h1>
          <p className="text-primary-500">Manage vendor accounts and performance</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-primary-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{stats.total}</p>
              <p className="text-sm text-primary-500">Total Vendors</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-primary-500">Active</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-primary-500">Pending Approval</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-sm text-primary-500">Total Revenue</p>
            </div>
          </div>
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
              placeholder="Search vendors..."
              className="input pl-10"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary w-full sm:w-auto"
            >
              <Filter size={18} />
              {statusFilter === 'all' ? 'All Status' : statusFilter}
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                {['all', 'active', 'pending', 'suspended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setShowFilters(false); }}
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

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="card p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-700">{vendor.companyName.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">{vendor.companyName}</h3>
                  <p className="text-sm text-primary-500">{vendor.name}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setSelectedVendor(selectedVendor === vendor.id ? null : vendor.id)}
                  className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={18} className="text-primary-500" />
                </button>
                
                {selectedVendor === vendor.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2">
                      <Edit2 size={14} />
                      Edit Vendor
                    </button>
                    {vendor.status === 'pending' && (
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-green-600">
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    )}
                    {vendor.status === 'active' && (
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-yellow-600">
                        <XCircle size={14} />
                        Suspend
                      </button>
                    )}
                    {vendor.status === 'suspended' && (
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-green-600">
                        <CheckCircle size={14} />
                        Reactivate
                      </button>
                    )}
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 text-red-600">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[vendor.status]} capitalize mb-4`}>
              {vendor.status}
            </span>

            <div className="space-y-2 text-sm mb-4">
              <p className="text-primary-600 flex items-center gap-2">
                <Mail size={14} className="text-primary-400" />
                {vendor.email}
              </p>
              <p className="text-primary-600 flex items-center gap-2">
                <Phone size={14} className="text-primary-400" />
                {vendor.phone}
              </p>
              <p className="text-primary-600 flex items-center gap-2">
                <MapPin size={14} className="text-primary-400" />
                {vendor.address}
              </p>
            </div>

            {vendor.status !== 'pending' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-primary-900">{vendor.rating}</span>
                  <span className="text-primary-500 text-sm">rating</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-primary-100">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary-900">{vendor.totalProducts}</p>
                    <p className="text-xs text-primary-500">Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary-900">{vendor.totalOrders}</p>
                    <p className="text-xs text-primary-500">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary-900">{vendor.commission}%</p>
                    <p className="text-xs text-primary-500">Commission</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary-500">Total Revenue</span>
                    <span className="font-semibold text-primary-900">{formatPrice(vendor.totalRevenue)}</span>
                  </div>
                </div>
              </>
            )}

            {vendor.status === 'pending' && (
              <div className="pt-4 border-t border-primary-100">
                <p className="text-sm text-primary-500 mb-3">
                  Applied on {format(new Date(vendor.createdAt), 'MMM d, yyyy')}
                </p>
                <div className="flex gap-2">
                  <button className="btn btn-primary flex-1 text-sm">
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button className="btn btn-danger flex-1 text-sm">
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="card p-12 text-center">
          <Building2 size={48} className="mx-auto text-primary-300 mb-4" />
          <h3 className="text-lg font-medium text-primary-900 mb-2">No vendors found</h3>
          <p className="text-primary-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary-900 mb-6">Add New Vendor</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Contact Name</label>
                  <input type="text" className="input" placeholder="Full name" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="Email address" />
                </div>
              </div>
              <div>
                <label className="label">Company Name</label>
                <input type="text" className="input" placeholder="Company name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input type="tel" className="input" placeholder="Phone number" />
                </div>
                <div>
                  <label className="label">GSTIN</label>
                  <input type="text" className="input" placeholder="GSTIN number" />
                </div>
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input min-h-[80px]" placeholder="Full address" rows={2} />
              </div>
              <div>
                <label className="label">Commission Rate (%)</label>
                <input type="number" className="input" placeholder="10" min={0} max={100} />
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
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
