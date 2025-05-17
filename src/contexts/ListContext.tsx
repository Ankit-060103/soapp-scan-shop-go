
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";

export type ListItem = {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  inStore: boolean | null; // true if available in the selected store, false if not, null if unknown
};

type ListContextType = {
  listItems: ListItem[];
  addItem: (name: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleChecked: (id: string) => void;
  clearCheckedItems: () => void;
  checkItemsAvailability: () => void;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const { selectedStore } = useStore();
  const { products } = useProducts();
  const { user } = useAuth();

  // Generate a unique storage key for each user
  const getStorageKey = () => {
    return user ? `soapp_shopping_list_${user.id}` : 'soapp_shopping_list_guest';
  };

  // Load saved list from localStorage on mount or when user changes
  useEffect(() => {
    const savedList = localStorage.getItem(getStorageKey());
    if (savedList) {
      try {
        setListItems(JSON.parse(savedList));
      } catch (e) {
        console.error("Failed to parse saved shopping list:", e);
        localStorage.removeItem(getStorageKey());
      }
    } else {
      // Clear the list if no saved list for this user
      setListItems([]);
    }
  }, [user?.id]);

  // Save list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(listItems));
  }, [listItems, user?.id]);

  const addItem = (name: string, quantity: number) => {
    if (!name.trim()) return;
    
    const newId = `list-${Date.now()}`;
    const newItem: ListItem = {
      id: newId,
      name: name.trim(),
      quantity,
      checked: false,
      inStore: null,
    };

    setListItems((prevItems) => [...prevItems, newItem]);
  };

  const removeItem = (id: string) => {
    setListItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setListItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const toggleChecked = (id: string) => {
    setListItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearCheckedItems = () => {
    setListItems((prevItems) => prevItems.filter((item) => !item.checked));
  };

  // Check which items might be available in the selected store
  // This is a simplified implementation that compares item names with product names
  const checkItemsAvailability = () => {
    if (!selectedStore) {
      setListItems((prevItems) =>
        prevItems.map((item) => ({ ...item, inStore: null }))
      );
      return;
    }

    setListItems((prevItems) =>
      prevItems.map((item) => {
        // Simple check: if any product name contains the item name (case insensitive)
        const isAvailable = products.some((product) =>
          product.name.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(product.name.toLowerCase())
        );
        return { ...item, inStore: isAvailable };
      })
    );
  };

  return (
    <ListContext.Provider
      value={{
        listItems,
        addItem,
        removeItem,
        updateQuantity,
        toggleChecked,
        clearCheckedItems,
        checkItemsAvailability,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export const useList = (): ListContextType => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};
