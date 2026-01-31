import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CreditCard,
    Wallet,
    Building2,
    Check,
    Shield,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { invoicesApi, Invoice } from '../../api/invoices';
import { ordersApi } from '../../api/orders';
import { walletApi } from '../../api/wallet';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types';

export default function OrderPaymentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');

    // Razorpay payment link (simulated)
    const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/gg6pjKf';

    useEffect(() => {
        const initPayment = async () => {
            if (!id) return;
            try {
                setLoading(true);

                // 1. Check for existing invoice
                let inv = await invoicesApi.getInvoiceByOrder(id);

                if (!inv) {
                    // 2. If no invoice, create one from the order
                    const order = await ordersApi.getOrder(id);

                    if (order.status === 'cancelled') {
                        throw new Error('This order has been cancelled');
                    }

                    inv = await invoicesApi.createInvoice({
                        order_id: order.id,
                        lines: order.lines.map(line => ({
                            description: `${line.product_name} x ${line.quantity} (${line.rental_period_type})`,
                            quantity: line.quantity,
                            unit_price: line.unit_price,
                            total_price: line.total_price
                        })),
                        due_days: 7, // Default due date
                        notes: `Generated from Order #${order.order_number}`
                    });
                }

                setInvoice(inv);

                // 3. Fetch wallet balance
                const wallet = await walletApi.getWallet();
                setWalletBalance(wallet.balance);

            } catch (err: any) {
                console.error('Payment init error:', err);
                setError(err.message || 'Failed to initialize payment');
            } finally {
                setLoading(false);
            }
        };

        initPayment();
    }, [id]);

    const handlePayment = async () => {
        if (!invoice) return;

        // Check if already paid
        if (invoice.status === 'paid') {
            navigate(`/orders/${id}`);
            return;
        }

        const amountToPay = invoice.total_amount - invoice.paid_amount;

        if (paymentMethod === 'online') {
            // Simulate Online Payment redirect
            window.open(RAZORPAY_PAYMENT_LINK, '_blank');
            // In a real app, we'd wait for webhook or callback. 
            // Here we might just navigate to invoice or order page.
            alert('Redirecting to payment gateway. After payment, refresh the order status.');
            navigate(`/orders/${id}`);
        } else if (paymentMethod === 'wallet') { // Note: 'wallet' matches frontend type, mapped to 'WALLET' enum in backend
            if (walletBalance < amountToPay) {
                alert('Insufficient wallet balance');
                return;
            }

            if (!confirm(`Pay ₹${amountToPay} using your wallet balance?`)) return;

            try {
                setProcessing(true);
                await invoicesApi.addPayment(invoice.id, {
                    amount: amountToPay,
                    method: 'WALLET' // Backend expects uppercase for enum mapping if not handled, but let's send what API expects
                });

                alert('Payment successful!');
                navigate(`/orders/${id}`);
            } catch (err: any) {
                alert(err.message || 'Payment failed');
            } finally {
                setProcessing(false);
            }
        } else {
            alert('Bank Transfer details: ... (Simulated)');
            navigate(`/orders/${id}`);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
                <p className="text-primary-600 font-medium">Preparing payment details...</p>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-red-700 mb-2">Something went wrong</h2>
                <p className="text-red-600 mb-6">{error || 'Could not load payment information'}</p>
                <button onClick={() => navigate('/orders')} className="btn btn-primary w-full">
                    Back to Orders
                </button>
            </div>
        );
    }

    const amountDue = invoice.total_amount - invoice.paid_amount;
    const isFullyPaid = amountDue <= 0;

    if (isFullyPaid) {
        return (
            <div className="max-w-md mx-auto mt-12 p-8 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Complete!</h2>
                <p className="text-green-700 mb-6">This order has already been paid for.</p>
                <button onClick={() => navigate(`/orders/${id}`)} className="btn btn-primary w-full">
                    View Order Details
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Make Payment</h1>
                    <p className="text-primary-500">Order #{invoice.order_id.slice(0, 8)}...</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="space-y-4">
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                            <CreditCard size={20} />
                            Select Payment Method
                        </h2>

                        <div className="space-y-3">
                            {/* Online Payment */}
                            <button
                                onClick={() => setPaymentMethod('online')}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${paymentMethod === 'online'
                                    ? 'border-primary-600 bg-primary-50 shadow-sm'
                                    : 'border-primary-100 hover:border-primary-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-primary-100 shadow-sm">
                                            <CreditCard size={20} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-primary-900">Pay Online</p>
                                            <p className="text-xs text-primary-500">UPI, Cards, Netbanking</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'online' && (
                                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Wallet Payment */}
                            <button
                                onClick={() => setPaymentMethod('wallet')}
                                disabled={walletBalance < amountDue}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${paymentMethod === 'wallet'
                                        ? 'border-accent-600 bg-accent-50 shadow-sm'
                                        : 'border-primary-100 hover:border-primary-200'
                                    } ${walletBalance < amountDue ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-primary-100 shadow-sm">
                                            <Wallet size={20} className="text-accent-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-primary-900">Wallet Balance</p>
                                            <p className={`text-xs ${walletBalance < amountDue ? 'text-red-500 font-medium' : 'text-primary-500'}`}>
                                                Available: {formatPrice(walletBalance)}
                                            </p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'wallet' && (
                                        <div className="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Bank Transfer */}
                            <button
                                onClick={() => setPaymentMethod('bank_transfer')}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${paymentMethod === 'bank_transfer'
                                    ? 'border-primary-600 bg-primary-50 shadow-sm'
                                    : 'border-primary-100 hover:border-primary-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-primary-100 shadow-sm">
                                            <Building2 size={20} className="text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-primary-900">Bank Transfer</p>
                                            <p className="text-xs text-primary-500">NEFT / RTGS</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                    <div className="card p-6 bg-primary-900 text-white">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Shield size={20} className="text-accent-400" />
                            Payment Summary
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-primary-100">
                                <span>Order Total</span>
                                <span>{formatPrice(invoice.total_amount)}</span>
                            </div>
                            {invoice.paid_amount > 0 && (
                                <div className="flex justify-between text-green-300">
                                    <span>Paid So Far</span>
                                    <span>- {formatPrice(invoice.paid_amount)}</span>
                                </div>
                            )}
                            <div className="h-px bg-primary-700 my-4" />
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Total Payable</span>
                                <span>{formatPrice(amountDue)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full btn bg-white text-primary-900 hover:bg-primary-50 border-0 font-bold h-12"
                        >
                            {processing ? (
                                <Loader2 className="animate-spin mx-auto" />
                            ) : (
                                `Pay ${formatPrice(amountDue)}`
                            )}
                        </button>

                        <p className="text-xs text-center text-primary-300 mt-4 opacity-80">
                            Secure payment powered by Razorpay & RentPe Wallet
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                        <p className="text-xs text-yellow-800 leading-relaxed">
                            <strong>Note:</strong> Order confirmation is subject to payment capability.
                            For bank transfers, order updates may take up to 24 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
