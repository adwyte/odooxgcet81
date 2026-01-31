import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import CustomerSignupPage from './pages/auth/CustomerSignupPage';
import VendorSignupPage from './pages/auth/VendorSignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

// Legal Pages
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import VendorAgreementPage from './pages/legal/VendorAgreementPage';

// Main Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import NewProductPage from './pages/products/NewProductPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/cart/CheckoutPage';
import QuotationsPage from './pages/quotations/QuotationsPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import ReturnsPage from './pages/returns/ReturnsPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import WalletPage from './pages/wallet/WalletPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import VendorsPage from './pages/admin/VendorsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup/customer" element={<CustomerSignupPage />} />
              <Route path="/signup/vendor" element={<VendorSignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            
            {/* OAuth Callback (no layout) */}
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

            {/* Legal Pages (no layout) */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/vendor-agreement" element={<VendorAgreementPage />} />

            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<NewProductPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Admin Routes (protected) */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/vendors" element={<VendorsPage />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}