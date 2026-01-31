import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Package
} from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { RentalPeriod, RentalPeriodSelection } from '../../types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  
  const product = mockProducts.find(p => p.id === id);
  
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || null);
  const [rentalType, setRentalType] = useState<RentalPeriod>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-primary-900">Product not found</h2>
        <Link to="/products" className="btn btn-secondary mt-4">
          <ArrowLeft size={18} />
          Back to Products
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
        basePrice = (product.rentalPricing.hourly || 0) * diffHours;
        break;
      case 'day':
        basePrice = (product.rentalPricing.daily || 0) * diffDays;
        break;
      case 'week':
        basePrice = (product.rentalPricing.weekly || 0) * diffWeeks;
        break;
    }
    
    if (selectedVariant) {
      basePrice += selectedVariant.priceModifier * (rentalType === 'day' ? diffDays : rentalType === 'week' ? diffWeeks : diffHours);
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
    
    addItem(product, selectedVariant || undefined, rentalPeriod);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const isDateValid = startDate && endDate && new Date(endDate) > new Date(startDate);
  const maxQuantity = Math.min(product.availableQuantity, 10);

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
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
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
              <span className="badge badge-neutral">{product.category}</span>
              {product.availableQuantity > 0 ? (
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
              <p className="font-medium text-primary-900">{product.vendorName}</p>
            </div>
          </div>

          {/* Attributes */}
          {product.attributes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.attributes.map(attr => (
                <span key={attr.id} className="px-3 py-1 bg-primary-100 rounded-full text-sm">
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
              {product.rentalPricing.hourly && (
                <button
                  onClick={() => setRentalType('hour')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    rentalType === 'hour'
                      ? 'border-primary-900 bg-primary-50'
                      : 'border-primary-200 hover:border-primary-300'
                  }`}
                >
                  <Clock size={20} className="mx-auto mb-1 text-primary-700" />
                  <p className="text-xs text-primary-500">Hourly</p>
                  <p className="font-bold text-primary-900">{formatPrice(product.rentalPricing.hourly)}</p>
                </button>
              )}
              {product.rentalPricing.daily && (
                <button
                  onClick={() => setRentalType('day')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    rentalType === 'day'
                      ? 'border-primary-900 bg-primary-50'
                      : 'border-primary-200 hover:border-primary-300'
                  }`}
                >
                  <Calendar size={20} className="mx-auto mb-1 text-primary-700" />
                  <p className="text-xs text-primary-500">Daily</p>
                  <p className="font-bold text-primary-900">{formatPrice(product.rentalPricing.daily)}</p>
                </button>
              )}
              {product.rentalPricing.weekly && (
                <button
                  onClick={() => setRentalType('week')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    rentalType === 'week'
                      ? 'border-primary-900 bg-primary-50'
                      : 'border-primary-200 hover:border-primary-300'
                  }`}
                >
                  <CalendarDays size={20} className="mx-auto mb-1 text-primary-700" />
                  <p className="text-xs text-primary-500">Weekly</p>
                  <p className="font-bold text-primary-900">{formatPrice(product.rentalPricing.weekly)}</p>
                </button>
              )}
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-primary-900">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
                      selectedVariant?.id === variant.id
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input"
                    min={startDate || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

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
                    {product.availableQuantity} available
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
                disabled={!isDateValid || product.availableQuantity === 0}
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
                {product.availableQuantity} units available
              </p>
              <p className="text-xs text-primary-500">
                {product.reservedQuantity} currently reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
