import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Define the Product type directly in CartContext to avoid circular imports
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
  addToCart: (product: Product, quantity: number) => void; // renamed from addItemToCart
  removeFromCart: (id: string) => void; // renamed from removeItemFromCart
  updateQuantity: (id: string, quantity: number) => void; // renamed from updateCartItemQuantity
  clearCart: () => void;
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
    if (lastOrder) {
      localStorage.setItem("soapp_last_order", JSON.stringify(lastOrder));
    }
  }, [lastOrder]);

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
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

  const removeFromCart = (id: string) => {
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

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
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

  const checkout = async () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Add items to your cart before checking out.",
      });
      return;
    }

    // Create order and include user ID
    const newOrder: Order = {
      items: cartItems,
      totalPrice: totalPrice,
      orderDate: new Date(),
      userId: user?.id // Include the current user's ID
    };

    // Save as last order
    setLastOrder(newOrder);
    
    // Also save as a unique order in localStorage with a unique key
    const orderId = uuidv4();
    localStorage.setItem(`soapp_order_${orderId}`, JSON.stringify(newOrder));
    
    // Clear the cart
    setCartItems([]);
    
    toast({
      title: "Order confirmed",
      description: "Thank you for your order!",
    });

    // Add a short delay before redirecting so the toast notification is visible
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate('/thank-you');
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
        addToCart,
        removeFromCart,
        updateQuantity,
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
