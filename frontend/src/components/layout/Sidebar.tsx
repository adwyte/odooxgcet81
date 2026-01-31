import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  FileText, 
  Receipt, 
  BarChart3, 
  Settings, 
  Users,
  Truck,
  RotateCcw,
  Building2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: ('customer' | 'vendor' | 'admin')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard', roles: ['customer', 'vendor', 'admin'] },
  { label: 'Products', icon: <Package size={20} />, path: '/products', roles: ['customer', 'vendor', 'admin'] },
  { label: 'Cart', icon: <ShoppingCart size={20} />, path: '/cart', roles: ['customer'] },
  { label: 'Quotations', icon: <FileText size={20} />, path: '/quotations', roles: ['customer', 'vendor', 'admin'] },
  { label: 'Orders', icon: <Truck size={20} />, path: '/orders', roles: ['customer', 'vendor', 'admin'] },
  { label: 'Returns', icon: <RotateCcw size={20} />, path: '/returns', roles: ['customer', 'vendor', 'admin'] },
  { label: 'Invoices', icon: <Receipt size={20} />, path: '/invoices', roles: ['customer', 'vendor', 'admin'] },
  { label: 'Reports', icon: <BarChart3 size={20} />, path: '/reports', roles: ['vendor', 'admin'] },
  { label: 'Users', icon: <Users size={20} />, path: '/users', roles: ['admin'] },
  { label: 'Vendors', icon: <Building2 size={20} />, path: '/vendors', roles: ['admin'] },
  { label: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['vendor', 'admin'] },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-primary-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-primary-200">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-primary-900">RentFlow</span>
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-primary-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-900 text-white'
                          : 'text-primary-600 hover:bg-primary-100 hover:text-primary-900'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Role Badge */}
          {user && (
            <div className="p-4 border-t border-primary-200">
              <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">{user.name}</p>
                  <p className="text-xs text-primary-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
