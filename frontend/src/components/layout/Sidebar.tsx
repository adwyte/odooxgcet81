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
  X,
  LayoutDashboard,
  FolderTree,
  Cog
} from 'lucide-react';
import logo from "../../assets/logo.png";
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

interface NavSection {
  title?: string;
  items: NavItem[];
  roles: ('customer' | 'vendor' | 'admin')[];
}

const navSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard', roles: ['customer', 'vendor', 'admin'] },
      { label: 'Products', icon: <Package size={20} />, path: '/products', roles: ['customer', 'vendor', 'admin'] },
      { label: 'Cart', icon: <ShoppingCart size={20} />, path: '/cart', roles: ['customer'] },
      { label: 'Quotations', icon: <FileText size={20} />, path: '/quotations', roles: ['customer', 'vendor', 'admin'] },
      { label: 'Orders', icon: <Truck size={20} />, path: '/orders', roles: ['customer', 'vendor', 'admin'] },
      { label: 'Returns', icon: <RotateCcw size={20} />, path: '/returns', roles: ['customer', 'vendor', 'admin'] },
      { label: 'Invoices', icon: <Receipt size={20} />, path: '/invoices', roles: ['customer', 'vendor', 'admin'] },
      { label: 'Reports', icon: <BarChart3 size={20} />, path: '/reports', roles: ['vendor', 'admin'] },
      { label: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['customer', 'vendor'] },
    ],
    roles: ['customer', 'vendor', 'admin'],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Admin Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin', roles: ['admin'] },
      { label: 'Users', icon: <Users size={20} />, path: '/admin/users', roles: ['admin'] },
      { label: 'Vendors', icon: <Building2 size={20} />, path: '/admin/vendors', roles: ['admin'] },
      { label: 'Categories', icon: <FolderTree size={20} />, path: '/admin/categories', roles: ['admin'] },
      { label: 'Platform Settings', icon: <Cog size={20} />, path: '/admin/settings', roles: ['admin'] },
    ],
    roles: ['admin'],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  // Filter sections and items based on user role
  const filteredSections = navSections
    .filter(section => user && section.roles.includes(user.role))
    .map(section => ({
      ...section,
      items: section.items.filter(item => user && item.roles.includes(user.role))
    }))
    .filter(section => section.items.length > 0);

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
            <Link to="/dashboard" className="flex items-center gap-3">
              <img
                src={logo}
                alt="RentPe"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-primary-900">RentPe</span>
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
            {filteredSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-6' : ''}>
                {section.title && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path));
                    
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
              </div>
            ))}
          </nav>

          {/* User Role Badge */}
          {user && (
            <div className="p-4 border-t border-primary-200">
              <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">{user.firstName} {user.lastName}</p>
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
