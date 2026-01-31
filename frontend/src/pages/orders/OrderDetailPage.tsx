import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Package, 
  Truck, 
  RotateCcw, 
  Receipt,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { mockOrders, mockInvoices } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { OrderStatus } from '../../types';

const statusColors: Record<OrderStatus, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  picked_up: 'badge-success',
  returned: 'badge-success',
  completed: 'badge-neutral',
  cancelled: 'badge-danger',
};

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'picked_up', 'returned', 'completed'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const order = mockOrders.find(o => o.id === id);
  const relatedInvoice = mockInvoices.find(inv => inv.orderId === id);

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-primary-300 mb-4" />
        <h2 className="text-xl font-semibold text-primary-900 mb-2">Order not found</h2>
        <p className="text-primary-500 mb-4">The order you're looking for doesn't exist.</p>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCurrentStep = () => {
    if (order.status === 'cancelled') return -1;
    return statusSteps.indexOf(order.status);
  };

  const currentStep = getCurrentStep();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary-900">{order.orderNumber}</h1>
          <p className="text-primary-500">Order Details</p>
        </div>
        <span className={`badge ${statusColors[order.status]} capitalize`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <div className="card p-6">
          <h3 className="font-semibold text-primary-900 mb-6">Order Progress</h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-primary-200">
              <div 
                className="h-full bg-primary-900 transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="flex justify-between relative">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                      isCompleted 
                        ? 'bg-primary-900 text-white' 
                        : 'bg-white border-2 border-primary-200 text-primary-400'
                    } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                      {isCompleted ? <CheckCircle size={20} /> : (index + 1)}
                    </div>
                    <p className={`text-xs mt-2 capitalize ${
                      isCompleted ? 'text-primary-900 font-medium' : 'text-primary-400'
                    }`}>
                      {step.replace('_', ' ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rental Period */}
          <div className="card p-6">
            <h3 className="font-semibold text-primary-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Rental Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm text-primary-500">Start Date</p>
                <p className="text-lg font-semibold text-primary-900">
                  {format(new Date(order.rentalStartDate), 'EEEE, MMM d, yyyy')}
                </p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm text-primary-500">End Date</p>
                <p className="text-lg font-semibold text-primary-900">
                  {format(new Date(order.rentalEndDate), 'EEEE, MMM d, yyyy')}
                </p>
              </div>
            </div>
            {order.pickupDate && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <Truck size={16} />
                Picked up on {format(new Date(order.pickupDate), 'MMM d, yyyy')}
              </div>
            )}
            {order.returnDate && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <RotateCcw size={16} />
                Returned on {format(new Date(order.returnDate), 'MMM d, yyyy')}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <h3 className="font-semibold text-primary-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.lines.map((line) => (
                <div key={line.id} className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-primary-900">{line.productName}</h4>
                    <p className="text-sm text-primary-500">
                      {line.rentalPeriod.type}ly rental • Qty: {line.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-900">{formatPrice(line.totalPrice)}</p>
                    <p className="text-sm text-primary-500">{formatPrice(line.unitPrice)}/{line.rentalPeriod.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor/Customer Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-primary-900 mb-4">
              {user?.role === 'customer' ? 'Vendor Information' : 'Customer Information'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-700">
                    {user?.role === 'customer' ? order.vendorName[0] : order.customerName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-primary-900">
                    {user?.role === 'customer' ? order.vendorName : order.customerName}
                  </p>
                  <p className="text-sm text-primary-500">
                    {user?.role === 'customer' ? 'Vendor' : 'Customer'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-primary-500 flex items-center gap-2">
                  <Mail size={14} />
                  contact@example.com
                </p>
                <p className="text-sm text-primary-500 flex items-center gap-2">
                  <Phone size={14} />
                  +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="card p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-primary-600">Subtotal</span>
                <span className="text-primary-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Tax (18% GST)</span>
                <span className="text-primary-900">{formatPrice(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Security Deposit</span>
                <span className="text-primary-900">{formatPrice(order.securityDeposit)}</span>
              </div>
              {order.lateReturnFee && (
                <div className="flex justify-between text-red-600">
                  <span>Late Return Fee</span>
                  <span>{formatPrice(order.lateReturnFee)}</span>
                </div>
              )}
              <div className="border-t border-primary-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-primary-900">Total</span>
                  <span className="text-primary-900">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid</span>
                <span>{formatPrice(order.paidAmount)}</span>
              </div>
              {order.paidAmount < order.totalAmount && (
                <div className="flex justify-between font-medium text-yellow-600">
                  <span>Balance Due</span>
                  <span>{formatPrice(order.totalAmount - order.paidAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {relatedInvoice && (
                <Link to={`/invoices/${relatedInvoice.id}`} className="btn btn-secondary w-full">
                  <Receipt size={18} />
                  View Invoice
                </Link>
              )}
              {user?.role === 'customer' && order.paidAmount < order.totalAmount && (
                <button className="btn btn-primary w-full">
                  Pay Balance
                </button>
              )}
              {(user?.role === 'vendor' || user?.role === 'admin') && (
                <>
                  {order.status === 'confirmed' && (
                    <button className="btn btn-primary w-full">
                      <Truck size={18} />
                      Mark as Picked Up
                    </button>
                  )}
                  {order.status === 'picked_up' && (
                    <button className="btn btn-primary w-full">
                      <RotateCcw size={18} />
                      Mark as Returned
                    </button>
                  )}
                </>
              )}
              {order.status === 'pending' && (
                <button className="btn btn-danger w-full">
                  <XCircle size={18} />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-primary-900 mb-4">Order Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-500">Order Number</span>
                <span className="text-primary-900 font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-500">Quotation</span>
                <Link to={`/quotations`} className="text-primary-600 hover:text-primary-900">
                  {order.quotationId}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-500">Created</span>
                <span className="text-primary-900">
                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-500">Last Updated</span>
                <span className="text-primary-900">
                  {format(new Date(order.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
