
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  items: CartItem[];
  totalPrice: number;
  orderDate: Date;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  checkout: () => Promise<void>;
  lastOrder: Order | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("soapp_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem("soapp_cart");
      }
    }
    
    const savedOrder = localStorage.getItem("soapp_last_order");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        parsedOrder.orderDate = new Date(parsedOrder.orderDate);
        setLastOrder(parsedOrder);
      } catch (e) {
        localStorage.removeItem("soapp_last_order");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("soapp_cart", JSON.stringify(items));
  }, [items]);
  
  // Save last order to localStorage
  useEffect(() => {
    if (lastOrder) {
      localStorage.setItem("soapp_last_order", JSON.stringify(lastOrder));
    }
  }, [lastOrder]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async () => {
    // In a real app, this would connect to a payment processor
    // Simulate processing payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save order details before clearing cart
    const newOrder: Order = {
      items: [...items],
      totalPrice,
      orderDate: new Date()
    };
    
    setLastOrder(newOrder);
    clearCart();
    
    toast({
      title: "Payment successful!",
      description: "Your order has been processed. Thank you for shopping with SoApp!",
    });
    
    navigate("/thank-you");
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      checkout,
      lastOrder
    }}>
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
