import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant, RentalPeriodSelection } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant | undefined, rentalPeriod: RentalPeriodSelection) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => { subtotal: number; tax: number; total: number };
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateRentalPrice(product: Product, variant: ProductVariant | undefined, rentalPeriod: RentalPeriodSelection): number {
  const { rentalPricing } = product;
  const startDate = new Date(rentalPeriod.startDate);
  const endDate = new Date(rentalPeriod.endDate);
  const diffHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffHours / 24);
  const diffWeeks = Math.ceil(diffDays / 7);

  let basePrice = 0;

  switch (rentalPeriod.type) {
    case 'hour':
      basePrice = (rentalPricing.hourly || 0) * diffHours;
      break;
    case 'day':
      basePrice = (rentalPricing.daily || 0) * diffDays;
      break;
    case 'week':
      basePrice = (rentalPricing.weekly || 0) * diffWeeks;
      break;
    case 'custom':
      if (rentalPricing.customPeriod) {
        const periods = Math.ceil(diffDays / rentalPricing.customPeriod.days);
        basePrice = rentalPricing.customPeriod.price * periods;
      }
      break;
  }

  // Add variant price modifier
  if (variant) {
    basePrice += variant.priceModifier;
  }

  return basePrice * rentalPeriod.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('cartItems');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = useCallback((product: Product, variant: ProductVariant | undefined, rentalPeriod: RentalPeriodSelection) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      );

      const totalPrice = calculateRentalPrice(product, variant, rentalPeriod);
      const unitPrice = totalPrice / rentalPeriod.quantity;

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          rentalPeriod,
          unitPrice,
          totalPrice,
        };
        return updated;
      }

      return [...prev, {
        product,
        variant,
        rentalPeriod,
        unitPrice,
        totalPrice,
      }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.variant?.id === variantId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.variant?.id === variantId) {
        const newRentalPeriod = { ...item.rentalPeriod, quantity };
        const totalPrice = calculateRentalPrice(item.product, item.variant, newRentalPeriod);
        return {
          ...item,
          rentalPeriod: newRentalPeriod,
          unitPrice: totalPrice / quantity,
          totalPrice,
        };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const getTotal = useCallback(() => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxRate = 0.18; // 18% GST
    const tax = subtotal * taxRate;
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.rentalPeriod.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
