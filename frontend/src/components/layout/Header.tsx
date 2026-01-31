import { Menu, Bell, ShoppingCart, LogOut, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-primary-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-primary-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-primary-900">
              Welcome back, {user?.firstName}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Cart (Customer only) */}
          {user?.role === 'customer' && (
            <Link
              to="/cart"
              className="relative p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <ShoppingCart size={22} className="text-primary-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {/* Notifications */}
          <button className="relative p-2 hover:bg-primary-100 rounded-lg transition-colors">
            <Bell size={22} className="text-primary-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <ChevronDown size={16} className="text-primary-500 hidden sm:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-primary-200 rounded-xl shadow-lg py-2">
                <div className="px-4 py-2 border-b border-primary-100">
                  <p className="text-sm font-medium text-primary-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-primary-500">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50"
                >
                  <User size={16} />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
