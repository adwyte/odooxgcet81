import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Calendar,
  CalendarDays,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Building2,
  Package,
  Loader2
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { productsApi, Product } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { RentalPeriod, RentalPeriodSelection } from '../../types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [rentalType, setRentalType] = useState<RentalPeriod>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  // New state for split date/time inputs using Date objects for DatePicker
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);

  // Helper to combine date and time
  const combineDateTime = (date: Date | null, time: Date | null): string => {
    if (!date || !time) return '';
    const d = new Date(date);
    d.setHours(time.getHours());
    d.setMinutes(time.getMinutes());
    return d.toISOString();
  };

  // Helper to format date to ISO string (start/end of day)
  const formatDateISO = (date: Date | null, endOfDay = false): string => {
    if (!date) return '';
    const d = new Date(date);
    if (endOfDay) {
      d.setHours(23, 59, 59, 999);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    return d.toISOString(); // Or keep simplified string if backend prefers
  };

  // Update effect to calculate startDate and endDate for cart/calculations
  useEffect(() => {
    if (rentalType === 'hour') {
      if (selectedDate && startTime && endTime) {
        // For hourly, we need the specific time on the selected date
        // Note: startTime/endTime from DatePicker just hold the time part on *some* date
        // We need to merge it with selectedDate
        const start = new Date(selectedDate);
        start.setHours(startTime.getHours(), startTime.getMinutes());

        const end = new Date(selectedDate);
        end.setHours(endTime.getHours(), endTime.getMinutes());

        // Handle case where end time is next day (not supported in single date picker yet, assume same day)
        setStartDate(start.toISOString());
        setEndDate(end.toISOString());
      } else {
        setStartDate('');
        setEndDate('');
      }
    } else {
      // Daily/Weekly
      if (dateRangeStart && dateRangeEnd) {
        setStartDate(formatDateISO(dateRangeStart));
        setEndDate(formatDateISO(dateRangeEnd, true));
      } else {
        setStartDate('');
        setEndDate('');
      }
    }
  }, [rentalType, selectedDate, startTime, endTime, dateRangeStart, dateRangeEnd]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productsApi.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-primary-900">{error || 'Product not found'}</h2>
        <Link to="/products" className="btn btn-secondary mt-4">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  // Normalize pricing from API format
  const rentalPricing = product.rental_pricing || { hourly: 0, daily: 0, weekly: 0 };
  const availableQuantity = product.available_quantity || 0;
  const reservedQuantity = product.reserved_quantity || 0;
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];
  const category = product.category || 'Uncategorized';
  const vendorName = product.vendor_name || 'Unknown Vendor';
  const attributes = product.attributes || [];
  const variants: any[] = [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const diffDays = Math.max(1, Math.ceil(diffHours / 24));
    const diffWeeks = Math.max(1, Math.ceil(diffDays / 7));

    let basePrice = 0;

    switch (rentalType) {
      case 'hour':
        basePrice = (rentalPricing.hourly || 0) * diffHours;
        break;
      case 'day':
        basePrice = (rentalPricing.daily || 0) * diffDays;
        break;
      case 'week':
        basePrice = (rentalPricing.weekly || 0) * diffWeeks;
        break;
    }

    if (selectedVariant) {
      basePrice += (selectedVariant.priceModifier || 0) * (rentalType === 'day' ? diffDays : rentalType === 'week' ? diffWeeks : diffHours);
    }

    return basePrice * quantity;
  };

  const handleAddToCart = () => {
    if (!startDate || !endDate || user?.role !== 'customer') return;

    const rentalPeriod: RentalPeriodSelection = {
      type: rentalType,
      startDate,
      endDate,
      quantity,
    };

    // Convert product to cart-compatible format
    const cartProduct = {
      ...product,
      rentalPricing,
      availableQuantity,
      images,
    };

    addItem(cartProduct as any, selectedVariant || undefined, rentalPeriod);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const isDateValid = startDate && endDate && new Date(endDate) > new Date(startDate);
  const maxQuantity = Math.min(availableQuantity, 10);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900">
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-primary-100 rounded-2xl overflow-hidden">
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary-200 hover:border-primary-900"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-neutral">{category}</span>
              {availableQuantity > 0 ? (
                <span className="badge badge-success">Available</span>
              ) : (
                <span className="badge badge-danger">Out of Stock</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-primary-900">{product.name}</h1>
            <p className="text-primary-500 mt-2">{product.description}</p>
          </div>

          {/* Vendor */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
              <Building2 size={20} className="text-primary-700" />
            </div>
            <div>
              <p className="text-sm text-primary-500">Provided by</p>
              <p className="font-medium text-primary-900">{vendorName}</p>
            </div>
          </div>

          {/* Attributes */}
          {attributes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attributes.map((attr: any, idx: number) => (
                <span key={attr.id || idx} className="px-3 py-1 bg-primary-100 rounded-full text-sm">
                  <span className="text-primary-500">{attr.name}:</span>{' '}
                  <span className="text-primary-900 font-medium">{attr.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Pricing Options */}
          <div className="card p-4 space-y-4">
            <h3 className="font-semibold text-primary-900">Rental Pricing</h3>
            <div className="grid grid-cols-3 gap-3">
              {rentalPricing.hourly && (
                <button
                  onClick={() => setRentalType('hour')}
                  className={`p-3 rounded-lg border-2 transition-colors ${rentalType === 'hour'
                    ? 'border-primary-900 bg-primary-50'
                    : 'border-primary-200 hover:border-primary-300'
                    }`}
                >
                  <Clock size={20} className="mx-auto mb-1 text-primary-700" />
                  <p className="text-xs text-primary-500">Hourly</p>
                  <p className="font-bold text-primary-900">{formatPrice(rentalPricing.hourly)}</p>
                </button>
              )}
              {rentalPricing.daily && (
                <button
                  onClick={() => setRentalType('day')}
                  className={`p-3 rounded-lg border-2 transition-colors ${rentalType === 'day'
                    ? 'border-primary-900 bg-primary-50'
                    : 'border-primary-200 hover:border-primary-300'
                    }`}
                >
                  <Calendar size={20} className="mx-auto mb-1 text-primary-700" />
                  <p className="text-xs text-primary-500">Daily</p>
                  <p className="font-bold text-primary-900">{formatPrice(rentalPricing.daily)}</p>
                </button>
              )}
              {rentalPricing.weekly && (
                <button
                  onClick={() => setRentalType('week')}
                  className={`p-3 rounded-lg border-2 transition-colors ${rentalType === 'week'
                    ? 'border-primary-900 bg-primary-50'
                    : 'border-primary-200 hover:border-primary-300'
                    }`}
                >
                  <CalendarDays size={20} className="mx-auto mb-1 text-primary-700" />
                  <p className="text-xs text-primary-500">Weekly</p>
                  <p className="font-bold text-primary-900">{formatPrice(rentalPricing.weekly)}</p>
                </button>
              )}
            </div>
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-primary-900">Options</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${selectedVariant?.id === variant.id
                      ? 'border-primary-900 bg-primary-50'
                      : 'border-primary-200 hover:border-primary-300'
                      }`}
                  >
                    {variant.name}
                    {variant.priceModifier > 0 && (
                      <span className="text-primary-500 ml-1">(+{formatPrice(variant.priceModifier)})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rental Period Selection (Customer only) */}
          {user?.role === 'customer' && (
            <div className="card p-4 space-y-4">
              <h3 className="font-semibold text-primary-900">Select Rental Period</h3>

              {rentalType === 'hour' ? (
                <div className="space-y-4">
                  <div>
                    <label className="label">Select Date</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      className="input w-full"
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select date"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Start Time</label>
                      <DatePicker
                        selected={startTime}
                        onChange={(date: Date | null) => setStartTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="input w-full"
                        placeholderText="Start time"
                      />
                    </div>
                    <div>
                      <label className="label">End Time</label>
                      <DatePicker
                        selected={endTime}
                        onChange={(date: Date | null) => setEndTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="input w-full"
                        placeholderText="End time"
                        minTime={startTime || undefined}
                        maxTime={startTime ? new Date(new Date().setHours(23, 59, 59)) : undefined}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date</label>
                    <DatePicker
                      selected={dateRangeStart}
                      onChange={(date: Date | null) => setDateRangeStart(date)}
                      className="input w-full"
                      minDate={new Date()}
                      placeholderText="Start date"
                    />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <DatePicker
                      selected={dateRangeEnd}
                      onChange={(date: Date | null) => setDateRangeEnd(date)}
                      className="input w-full"
                      minDate={dateRangeStart || new Date()}
                      placeholderText="End date"
                    />
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="label">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-primary-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-primary-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      className="p-2.5 hover:bg-primary-50"
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-sm text-primary-500">
                    {availableQuantity} available
                  </span>
                </div>
              </div>

              {/* Total */}
              {isDateValid && (
                <div className="pt-4 border-t border-primary-200">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600">Estimated Total</span>
                    <span className="text-2xl font-bold text-primary-900">{formatPrice(calculateTotal())}</span>
                  </div>
                  <p className="text-xs text-primary-500 mt-1">* Tax will be calculated at checkout</p>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!isDateValid || availableQuantity === 0}
                className="btn btn-primary w-full"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              {showAddedMessage && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <Check size={18} />
                  Added to cart!
                  <Link to="/cart" className="ml-auto text-sm font-medium hover:underline">View Cart</Link>
                </div>
              )}

              {!isDateValid && startDate && endDate && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                  <AlertCircle size={18} />
                  End date must be after start date
                </div>
              )}
            </div>
          )}

          {/* Availability Info */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
            <Package size={20} className="text-primary-700" />
            <div>
              <p className="text-sm font-medium text-primary-900">
                {availableQuantity} units available
              </p>
              <p className="text-xs text-primary-500">
                {reservedQuantity} currently reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
