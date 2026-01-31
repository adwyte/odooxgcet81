import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { mockProducts } from "../../data/mockData";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const product = mockProducts.find((p) => p.id === id);

  const [rentalType, setRentalType] = useState<"hour" | "day" | "week">("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link to="/products" className="btn btn-secondary mt-4">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  const isDateValid =
    startDate && endDate && new Date(endDate) > new Date(startDate);

  const handleAddToCart = async () => {
    if (!isDateValid || user?.role !== "customer") return;

    await addToCart({
      product_id: product.id,
      rental_start: new Date(startDate).toISOString(),
      rental_end: new Date(endDate).toISOString(),
      quantity,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2500);
  };

  const maxQuantity = Math.min(product.availableQuantity, 10);

  return (
    <div className="space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-primary-600"
      >
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-primary-100 rounded-2xl overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-primary-500 mt-2">{product.description}</p>
          </div>

          {/* Vendor */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
            <Building2 size={20} />
            <p className="font-medium">{product.vendorName}</p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-3">
            {product.rentalPricing.hourly && (
              <button
                onClick={() => setRentalType("hour")}
                className={`p-3 border rounded-lg ${
                  rentalType === "hour" && "border-primary-900"
                }`}
              >
                <Clock size={18} />
                Hourly
              </button>
            )}
            {product.rentalPricing.daily && (
              <button
                onClick={() => setRentalType("day")}
                className={`p-3 border rounded-lg ${
                  rentalType === "day" && "border-primary-900"
                }`}
              >
                <Calendar size={18} />
                Daily
              </button>
            )}
            {product.rentalPricing.weekly && (
              <button
                onClick={() => setRentalType("week")}
                className={`p-3 border rounded-lg ${
                  rentalType === "week" && "border-primary-900"
                }`}
              >
                <CalendarDays size={18} />
                Weekly
              </button>
            )}
          </div>

          {/* Rental period */}
          {user?.role === "customer" && (
            <div className="card p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(maxQuantity, quantity + 1))
                  }
                >
                  <Plus />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isDateValid}
                className="btn btn-primary w-full"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              {showAddedMessage && (
                <div className="flex items-center gap-2 text-green-700">
                  <Check size={18} />
                  Added to cart!
                  <Link to="/cart" className="underline ml-auto">
                    View Cart
                  </Link>
                </div>
              )}

              {!isDateValid && startDate && endDate && (
                <div className="text-yellow-600 text-sm flex gap-2">
                  <AlertCircle size={16} />
                  End date must be after start date
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-primary-600">
            <Package size={18} />
            {product.availableQuantity} units available
          </div>
        </div>
      </div>
    </div>
  );
}
