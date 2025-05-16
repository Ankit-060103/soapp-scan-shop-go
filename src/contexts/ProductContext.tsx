
import React, { createContext, useContext, ReactNode } from "react";
import { Product } from "./CartContext";

type ProductContextType = {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByNfcId: (nfcId: string) => Product | undefined;
};

// Mock products data
const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Wireless Headphones",
    price: 129.99,
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&q=80&w=400",
    category: "Electronics",
    inStock: true
  },
  {
    id: "p2",
    name: "Smart Watch",
    price: 249.99,
    description: "Track your fitness, receive notifications, and more with this premium smart watch.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&q=80&w=400",
    category: "Electronics",
    inStock: true
  },
  {
    id: "p3",
    name: "Organic Coffee Beans",
    price: 15.99,
    description: "Ethically sourced premium organic coffee beans from the mountains of Colombia.",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&q=80&w=400",
    category: "Food & Beverages",
    inStock: true
  },
  {
    id: "p4",
    name: "Yoga Mat",
    price: 29.99,
    description: "Eco-friendly, non-slip yoga mat perfect for all types of yoga practices.",
    imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&q=80&w=400",
    category: "Fitness",
    inStock: true
  },
  {
    id: "p5",
    name: "Smartphone Case",
    price: 24.99,
    description: "Durable, shock-absorbent smartphone case with stylish design.",
    imageUrl: "https://images.unsplash.com/photo-1541345023926-55d6e0853f4b?auto=format&q=80&w=400",
    category: "Accessories",
    inStock: true
  }
];

// Map for NFC tag IDs to product IDs
const nfcToProductMap: Record<string, string> = {
  "nfc123": "p1",
  "nfc456": "p2",
  "nfc789": "p3",
  "nfc012": "p4",
  "nfc345": "p5"
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getProductById = (id: string) => {
    return mockProducts.find(product => product.id === id);
  };

  const getProductsByNfcId = (nfcId: string) => {
    const productId = nfcToProductMap[nfcId];
    if (!productId) return undefined;
    return getProductById(productId);
  };

  return (
    <ProductContext.Provider value={{ products: mockProducts, getProductById, getProductsByNfcId }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
