
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, LogOut, Home, Scan, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { selectedStore } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="soapp-gradient p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white text-2xl font-bold">
            SoApp
          </Link>
          
          <div className="flex items-center space-x-4">
            {selectedStore && (
              <span className="text-white">
                Store: {selectedStore.name}
              </span>
            )}
            
            <Link to="/cart" className="text-white relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-soapp-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <Button variant="ghost" onClick={logout} className="text-white p-2">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>

      {/* Footer navigation */}
      {isAuthenticated && (
        <nav className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-2 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <NavLink to="/dashboard" icon={<Home size={20} />} label="Home" currentPath={location.pathname} />
            <NavLink to="/select-store" icon={<Store size={20} />} label="Store" currentPath={location.pathname} />
            <NavLink to="/scan-product" icon={<Scan size={20} />} label="Scan" currentPath={location.pathname} />
            <NavLink to="/cart" icon={<ShoppingCart size={20} />} label="Cart" currentPath={location.pathname} />
          </div>
        </nav>
      )}
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, currentPath }) => {
  const isActive = currentPath === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center px-2 py-1 rounded-md transition-colors",
        isActive 
          ? "text-soapp font-medium" 
          : "text-gray-500 hover:text-soapp"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default Layout;
