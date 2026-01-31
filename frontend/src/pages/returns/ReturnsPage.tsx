import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  Calendar, 
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { ordersApi, Order } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { format, differenceInDays, isPast } from 'date-fns';

type ReturnStatus = 'pending' | 'scheduled' | 'completed' | 'overdue';

interface ReturnItem {
  id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  customerName: string;
  scheduledReturnDate?: string;
  actualReturnDate?: string;
  status: ReturnStatus;
  lateReturnFee?: number;
}

const statusColors: Record<ReturnStatus, string> = {
  pending: 'badge-warning',
  scheduled: 'badge-info',
  completed: 'badge-success',
  overdue: 'badge-danger',
};

const statusIcons: Record<ReturnStatus, React.ReactNode> = {
  pending: <Clock size={14} />,
  scheduled: <Calendar size={14} />,
  completed: <CheckCircle size={14} />,
  overdue: <AlertTriangle size={14} />,
};

// Generate returns from orders
const generateReturnsFromOrders = (orders: Order[]): ReturnItem[] => {
  const returns: ReturnItem[] = [];
  
  orders.forEach(order => {
    if (order.status === 'picked_up' || order.status === 'returned' || order.status === 'completed') {
      (order.lines || []).forEach(line => {
        const isOverdue = order.rental_end_date && isPast(new Date(order.rental_end_date)) && order.status === 'picked_up';
        const isCompleted = order.status === 'returned' || order.status === 'completed';
        
        let status: ReturnStatus = 'pending';
        if (isCompleted) {
          status = 'completed';
        } else if (isOverdue) {
          status = 'overdue';
        }
        
        returns.push({
          id: `ret-${order.id}-${line.id}`,
          orderId: order.id,
          orderNumber: order.order_number,
          productName: line.product_name,
          quantity: line.quantity,
          customerName: order.customer_name || 'N/A',
          scheduledReturnDate: order.rental_end_date,
          actualReturnDate: order.return_date,
          status,
          lateReturnFee: order.late_return_fee,
        });
      });
    }
  });
  
  return returns;
};

export default function ReturnsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load returns');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const returns = generateReturnsFromOrders(orders);

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: returns.filter(r => r.status === 'pending').length,
    overdue: returns.filter(r => r.status === 'overdue').length,
    completed: returns.filter(r => r.status === 'completed').length,
    total: returns.length,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Returns</h1>
          <p className="text-primary-500">Track and manage rental returns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{stats.pending}</p>
              <p className="text-sm text-primary-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-sm text-primary-500">Overdue</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-primary-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <RotateCcw size={20} className="text-primary-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{stats.total}</p>
              <p className="text-sm text-primary-500">Total Returns</p>
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
              placeholder="Search returns..."
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                {['all', 'pending', 'scheduled', 'completed', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as ReturnStatus | 'all');
                      setShowFilters(false);
                    }}
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

      {/* Returns List */}
      <div className="space-y-4">
        {filteredReturns.length === 0 ? (
          <div className="card p-12 text-center">
            <RotateCcw size={48} className="mx-auto text-primary-300 mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">No returns found</h3>
            <p className="text-primary-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No rental returns to process at this time'}
            </p>
          </div>
        ) : (
          filteredReturns.map((returnItem) => {
            const daysUntilReturn = returnItem.scheduledReturnDate 
              ? differenceInDays(new Date(returnItem.scheduledReturnDate), new Date())
              : 0;
            const isOverdue = returnItem.status === 'overdue';
            const daysOverdue = isOverdue ? Math.abs(daysUntilReturn) : 0;
            
            return (
              <div key={returnItem.id} className={`card p-6 card-hover ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isOverdue ? 'bg-red-100' : 'bg-primary-100'
                      }`}>
                        <Package size={20} className={isOverdue ? 'text-red-600' : 'text-primary-700'} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-900">{returnItem.productName}</h3>
                        <p className="text-sm text-primary-500">Order: {returnItem.orderNumber}</p>
                      </div>
                      <span className={`badge ${statusColors[returnItem.status]} flex items-center gap-1 ml-2`}>
                        {statusIcons[returnItem.status]}
                        <span className="capitalize">{returnItem.status}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-primary-500 mt-3">
                      <span className="flex items-center gap-1">
                        <Package size={14} />
                        Qty: {returnItem.quantity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Return by: {returnItem.scheduledReturnDate ? format(new Date(returnItem.scheduledReturnDate), 'MMM d, yyyy') : 'N/A'}
                      </span>
                      {user?.role !== 'customer' && (
                        <span>Customer: {returnItem.customerName}</span>
                      )}
                    </div>

                    {isOverdue && (
                      <div className="mt-3 p-3 bg-red-100 rounded-lg">
                        <p className="text-sm text-red-700 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          <span>
                            <strong>{daysOverdue} days overdue!</strong>
                            {returnItem.lateReturnFee && (
                              <span> Late fee: ₹{returnItem.lateReturnFee}/day</span>
                            )}
                          </span>
                        </p>
                      </div>
                    )}

                    {returnItem.status === 'pending' && daysUntilReturn <= 2 && daysUntilReturn >= 0 && (
                      <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                        <p className="text-sm text-yellow-700 flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            {daysUntilReturn === 0 ? 'Return due today!' : `Return due in ${daysUntilReturn} day${daysUntilReturn !== 1 ? 's' : ''}`}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/orders/${returnItem.orderId}`}
                      className="btn btn-secondary"
                    >
                      <Eye size={18} />
                      View Order
                    </Link>
                    {(user?.role === 'vendor' || user?.role === 'admin') && returnItem.status !== 'completed' && (
                      <button className="btn btn-primary">
                        <CheckCircle size={18} />
                        Mark Returned
                      </button>
                    )}
                  </div>
                </div>

                {returnItem.status === 'completed' && returnItem.actualReturnDate && (
                  <div className="mt-4 pt-4 border-t border-primary-100">
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Returned on {format(new Date(returnItem.actualReturnDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
