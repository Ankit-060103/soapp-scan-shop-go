
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Store = {
  id: string;
  name: string;
  location: string;
  qrCode: string;
};

export type ProductInStore = {
  storeId: string;
  products: string[];  // List of product IDs available in this store
};

type StoreContextType = {
  selectedStore: Store | null;
  selectStore: (store: Store) => void;
  clearSelectedStore: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Check for stored selection on mount
  React.useEffect(() => {
    const storedStore = localStorage.getItem("soapp_selected_store");
    if (storedStore) {
      try {
        setSelectedStore(JSON.parse(storedStore));
      } catch (e) {
        localStorage.removeItem("soapp_selected_store");
      }
    }
  }, []);

  const selectStore = (store: Store) => {
    setSelectedStore(store);
    localStorage.setItem("soapp_selected_store", JSON.stringify(store));
  };

  const clearSelectedStore = () => {
    setSelectedStore(null);
    localStorage.removeItem("soapp_selected_store");
  };

  return (
    <StoreContext.Provider value={{ selectedStore, selectStore, clearSelectedStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
