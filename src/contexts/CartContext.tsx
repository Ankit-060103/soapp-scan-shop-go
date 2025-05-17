import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/contexts/ProductContext";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type Order = {
  items: CartItem[];
  totalPrice: number;
  orderDate: Date;
  userId?: string; // Add userId to track orders per user
};

type CartContextType = {
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  lastOrder: Order | null;
  addItemToCart: (product: Product, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("soapp_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
        localStorage.removeItem("soapp_cart");
      }
    }
    
    const storedOrder = localStorage.getItem("soapp_last_order");
    if (storedOrder) {
      try {
        setLastOrder(JSON.parse(storedOrder));
      } catch (e) {
        console.error("Failed to parse last order from localStorage:", e);
        localStorage.removeItem("soapp_last_order");
      }
    }
  }, []);

  // Save cart items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("soapp_cart", JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    localStorage.setItem("soapp_last_order", JSON.stringify(lastOrder));
  }, [lastOrder]);

  const addItemToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: uuidv4(),
        product,
        quantity,
      };
      setCartItems((prevItems) => [...prevItems, newItem]);
      toast({
        title: "Item Added",
        description: `${product.name} added to cart.`,
      });
    }
  };

  const removeItemFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Item Removed",
          description: `${itemToRemove.product.name} removed from cart.`,
        });
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItemFromCart(id);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart.",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal > 50 || calculateTotalItems() === 0 ? 0 : 5;
  const totalItems = calculateTotalItems();
  const totalPrice = subtotal + shippingCost;

  const checkout = () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Add items to your cart before checking out.",
      });
      return;
    }

    // Mock order confirmation
    const newOrder: Order = {
      items: cartItems,
      totalPrice: totalPrice,
      orderDate: new Date(),
    };

    setLastOrder(newOrder);
    setCartItems([]);
    
    toast({
      title: "Order confirmed",
      description: "Thank you for your order!",
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        shippingCost,
        totalPrice,
        lastOrder,
        addItemToCart,
        removeItemFromCart,
        updateCartItemQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

