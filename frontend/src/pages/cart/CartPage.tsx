import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Calendar, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { format } from "date-fns";

export default function CartPage() {
  const { lines, total, removeLine } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateStr: string) =>
    format(new Date(dateStr), "MMM d, yyyy h:mm a");

  if (lines.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart size={40} className="mx-auto text-primary-400 mb-4" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary mt-6">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {lines.map((line) => (
            <div key={line.id} className="card p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Product ID</p>
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <Calendar size={14} />
                    {formatDate(line.rental_start)} →{" "}
                    {formatDate(line.rental_end)}
                  </div>
                  <p className="text-sm">Qty: {line.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold">{formatPrice(line.subtotal)}</p>
                  <button
                    onClick={() => removeLine(line.id)}
                    className="text-red-600 mt-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-primary-600"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>

            <button
              disabled
              className="btn btn-primary w-full mt-6 opacity-50 cursor-not-allowed"
            >
              Checkout (Next Step)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
