"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  getCartItems,
  getOrCreateSessionId,
  toggleCartItem,
} from "../actions/cartActions";
import { Product } from "../types/types";

interface CartContextType {
  cartItems: Product[];
  updateCart: (items: Product[]) => void;
  cartCount: number;
  cartTotal: number;
  toggleItem: (product: Product) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchInitialCartItems = async () => {
      try {
        const sessionId = await getOrCreateSessionId();
        const items = await getCartItems(sessionId);
        setCartItems(items);
        console.log("Initial Cart Items:", items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchInitialCartItems();
  }, []);

  const updateCart = useCallback((items: Product[]) => {
    setCartItems(items);
  }, []);

  const toggleItem = useCallback(async (product: Product) => {
    try {
      const sessionId = await getOrCreateSessionId();
      const updatedCartItems = await toggleCartItem(sessionId, product);
      setCartItems(updatedCartItems);
      console.log("Updated Cart Items:", updatedCartItems);
    } catch (error) {
      console.error("Error toggling cart item:", error);
    }
  }, []);

  const cartCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 1),
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateCart,
        cartCount,
        cartTotal,
        toggleItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
