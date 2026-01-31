// User Types
export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  businessCategory?: string;
  gstin?: string;
  role: UserRole;
  createdAt: string;
  referralCode?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  profilePhoto?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Product Types
export type RentalPeriod = 'hour' | 'day' | 'week' | 'custom';

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  attributes: ProductAttribute[];
  priceModifier: number;
  quantity: number;
}

export interface RentalPricing {
  hourly?: number;
  daily?: number;
  weekly?: number;
  customPeriod?: {
    days: number;
    price: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  isRentable: boolean;
  rentalPricing: RentalPricing;
  costPrice: number;
  salesPrice: number;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  isPublished: boolean;
  vendorId: string;
  vendorName: string;
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Quotation & Order Types
export type QuotationStatus = 'draft' | 'sent' | 'confirmed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'picked_up' | 'returned' | 'completed' | 'cancelled';

export interface RentalPeriodSelection {
  type: RentalPeriod;
  startDate: string;
  endDate: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  rentalPeriod: RentalPeriodSelection;
  unitPrice: number;
  totalPrice: number;
}

export interface QuotationLine {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  rentalPeriod: RentalPeriodSelection;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  status: QuotationStatus;
  lines: QuotationLine[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  quotationId: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  lines: QuotationLine[];
  subtotal: number;
  taxAmount: number;
  securityDeposit: number;
  totalAmount: number;
  paidAmount: number;
  rentalStartDate: string;
  rentalEndDate: string;
  pickupDate?: string;
  returnDate?: string;
  lateReturnFee?: number;
  createdAt: string;
  updatedAt: string;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'cancelled';

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerGstin: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export type PaymentMethod = 'online' | 'card' | 'bank_transfer' | 'cash';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

// Address Type
export interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeRentals: number;
  pendingReturns: number;
  topProducts: { name: string; rentals: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}

// Report Types
export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  vendorId?: string;
  status?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'products' | 'orders' | 'vendors';
  data: Record<string, unknown>[];
  generatedAt: string;
}

// Notification Types
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
