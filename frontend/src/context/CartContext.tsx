import { createContext, useContext, useEffect, useState } from "react";
import {
  getOrCreateCart,
  addToCart as apiAddToCart,
  removeCartLine,
} from "../api/quotations";

type CartLine = {
  id: string;
  product_id: string;
  rental_start: string;
  rental_end: string;
  quantity: number;
  subtotal: number;
};

type CartContextType = {
  quotationId: string | null;
  lines: CartLine[];
  total: number;
  refreshCart: () => Promise<void>;
  addToCart: (payload: any) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [quotationId, setQuotationId] = useState<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [total, setTotal] = useState<number>(0);

  const refreshCart = async () => {
    const data = await getOrCreateCart();
    setQuotationId(data.id);
    setLines(data.lines);
    setTotal(data.total);
  };

  const addToCart = async (payload: any) => {
    if (!quotationId) return;
    await apiAddToCart(quotationId, payload);
    await refreshCart();
  };

  const removeLine = async (lineId: string) => {
    await removeCartLine(lineId);
    await refreshCart();
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        quotationId,
        lines,
        total,
        refreshCart,
        addToCart,
        removeLine,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
