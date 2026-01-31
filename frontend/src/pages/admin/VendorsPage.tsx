import { useState, useEffect, useCallback } from 'react';
import {
  Store,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  Building2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { adminApi, AdminUser } from '../../api/adminApi';

type VendorStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface PaginationState {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export default function VendorsPage() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    perPage: 12,
    total: 0,
    totalPages: 0
  });

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: { page: number; per_page: number; search?: string; status?: string } = {
        page: pagination.page,
        per_page: pagination.perPage
      };
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await adminApi.getVendors(params);
      setVendors(response.users);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.pages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.perPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchQuery, statusFilter]);

  const handleApproveVendor = async (vendorId: string) => {
    try {
      setActionLoading(vendorId);
      await adminApi.approveVendor(vendorId, true);
      // Refresh the list
      await fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    try {
      setActionLoading(vendorId);
      await adminApi.approveVendor(vendorId, false);
      // Refresh the list
      await fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (vendor: AdminUser) => {
    if (vendor.is_approved === true) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle size={12} />
          Approved
        </span>
      );
    } else if (vendor.is_approved === false) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle size={12} />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Clock size={12} />
          Pending
        </span>
      );
    }
  };

  const statusOptions: { value: VendorStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Vendors', icon: <Store size={16} /> },
    { value: 'pending', label: 'Pending', icon: <Clock size={16} /> },
    { value: 'approved', label: 'Approved', icon: <CheckCircle size={16} /> },
    { value: 'rejected', label: 'Rejected', icon: <XCircle size={16} /> }
  ];

  const dismissError = () => setError(null);

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Vendor Management</h1>
          <p className="text-primary-500 mt-1">
            Manage and approve vendor applications
          </p>
        </div>
        <button
          onClick={fetchVendors}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={dismissError}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
          <input
            type="text"
            placeholder="Search vendors by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors min-w-[180px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary-500" />
              <span className="text-primary-700">
                {statusOptions.find(opt => opt.value === statusFilter)?.label}
              </span>
            </div>
            <ChevronDown size={16} className="text-primary-500" />
          </button>

          {showStatusDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStatusDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-primary-200 rounded-lg shadow-lg z-20">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-primary-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      statusFilter === option.value ? 'bg-accent-50 text-accent-700' : 'text-primary-700'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-primary-200 p-4">
          <div className="flex items-center gap-2 text-primary-600">
            <Store size={18} />
            <span className="text-sm font-medium">Total Vendors</span>
          </div>
          <p className="text-2xl font-bold text-primary-900 mt-2">{pagination.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center gap-2 text-yellow-700">
            <Clock size={18} />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-2">
            {vendors.filter(v => v.is_approved === null).length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {vendors.filter(v => v.is_approved === true).length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <XCircle size={18} />
            <span className="text-sm font-medium">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-2">
            {vendors.filter(v => v.is_approved === false).length}
          </p>
        </div>
      </div>

      {/* Vendors Grid */}
      {vendors.length === 0 ? (
        <div className="bg-white rounded-xl border border-primary-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary-900 mb-2">No Vendors Found</h3>
          <p className="text-primary-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No vendors have registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-primary-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Vendor Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                    <Store className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900 line-clamp-1">
                      {vendor.company_name || `${vendor.first_name} ${vendor.last_name}`}
                    </h3>
                    <p className="text-sm text-primary-500 line-clamp-1">
                      {vendor.first_name} {vendor.last_name}
                    </p>
                  </div>
                </div>
                {getStatusBadge(vendor)}
              </div>

              {/* Vendor Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <Mail size={16} className="text-primary-400 flex-shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <Calendar size={16} className="text-primary-400 flex-shrink-0" />
                  <span>
                    Joined {format(new Date(vendor.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                {vendor.company_name && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <Building2 size={16} className="text-primary-400 flex-shrink-0" />
                    <span className="truncate">{vendor.company_name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-primary-100">
                {vendor.is_approved === null && (
                  <>
                    <button
                      onClick={() => handleApproveVendor(vendor.id)}
                      disabled={actionLoading === vendor.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === vendor.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectVendor(vendor.id)}
                      disabled={actionLoading === vendor.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === vendor.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Reject
                    </button>
                  </>
                )}
                {vendor.is_approved === true && (
                  <button
                    onClick={() => handleRejectVendor(vendor.id)}
                    disabled={actionLoading === vendor.id}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === vendor.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    Revoke Approval
                  </button>
                )}
                {vendor.is_approved === false && (
                  <button
                    onClick={() => handleApproveVendor(vendor.id)}
                    disabled={actionLoading === vendor.id}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === vendor.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Approve Vendor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-primary-200 p-4">
          <p className="text-sm text-primary-600">
            Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
            {Math.min(pagination.page * pagination.perPage, pagination.total)} of{' '}
            {pagination.total} vendors
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-primary-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages || loading}
              className="px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
