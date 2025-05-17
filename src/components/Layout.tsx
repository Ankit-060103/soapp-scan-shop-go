
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { Link, useLocation } from "react-router-dom";
import { 
  ShoppingCart, 
  LogOut, 
  Home, 
  Scan, 
  Store, 
  User, 
  ListOrdered, 
  Mail, 
  Menu, 
  X, 
  List, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems } = useCart();
  const { selectedStore } = useStore();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="soapp-gradient p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Mobile menu trigger (left uppermost) */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2 text-white md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-sidebar border-sidebar-border max-w-[280px] p-0">
                <SheetHeader className="p-4 border-b border-sidebar-border">
                  <SheetTitle className="text-sidebar-foreground text-xl font-bold">SoApp Menu</SheetTitle>
                </SheetHeader>
                
                <div className="py-4">
                  <div className="px-4 py-2">
                    <div className="mb-4 text-sidebar-foreground">
                      <p className="text-sm font-medium">Signed in as:</p>
                      <p className="font-semibold">{user?.name || "User"}</p>
                      <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-1 px-2">
                    <SidebarNavLink to="/dashboard" icon={<Home size={18} />} label="Dashboard" />
                    <SidebarNavLink to="/select-store" icon={<Store size={18} />} label="Select Store" />
                    <SidebarNavLink to="/scan-product" icon={<Scan size={18} />} label="Scan Products" />
                    <SidebarNavLink to="/shopping-list" icon={<List size={18} />} label="My List" />
                    <SidebarNavLink to="/profile" icon={<User size={18} />} label="My Profile" />
                    <SidebarNavLink to="/orders" icon={<ListOrdered size={18} />} label="Order History" />
                    <SidebarNavLink to="/support" icon={<Mail size={18} />} label="Customer Support" />
                    <SidebarNavLink to="/cart" icon={<ShoppingCart size={18} />} label="Shopping Cart" />
                  </nav>
                  
                  <div className="mt-6 px-4 pt-4 border-t border-sidebar-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sidebar-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="mt-4 w-full text-sidebar-foreground justify-start"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/dashboard" className="text-white text-2xl font-bold">
              SoApp
            </Link>
          </div>
          
          {/* Desktop middle navigation - We're removing this as navigation is now at bottom */}
          
          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {selectedStore && !isMobile && (
              <span className="text-white hidden sm:inline-block">
                Store: {selectedStore.name}
              </span>
            )}
            
            <ThemeToggle />
            
            <Link to="/cart" className="text-white relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-soapp-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User Account Menu - top rightmost corner */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2 text-white flex items-center gap-1 hover:bg-white/10">
                  <User size={20} />
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    <ListOrdered size={16} />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="flex items-center gap-2 cursor-pointer">
                    <Mail size={16} />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut size={16} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>

      {/* Footer navigation - now this will be the main navigation for all devices */}
      {isAuthenticated && (
        <nav className="sticky bottom-0 w-full bg-background border-t border-gray-200 p-2 shadow-lg dark:border-gray-800">
          <div className="container mx-auto flex justify-between items-center">
            <NavLink to="/dashboard" icon={<Home size={20} />} label="Home" currentPath={location.pathname} />
            <NavLink to="/select-store" icon={<Store size={20} />} label="Store" currentPath={location.pathname} />
            <NavLink to="/scan-product" icon={<Scan size={20} />} label="Scan" currentPath={location.pathname} />
            <NavLink to="/shopping-list" icon={<List size={20} />} label="List" currentPath={location.pathname} />
            <NavLink to="/cart" icon={<ShoppingCart size={20} />} label="Cart" currentPath={location.pathname} />
          </div>
        </nav>
      )}
    </div>
  );
};

// Components used in Layout
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
        "flex flex-col items-center px-3 py-1.5 rounded-md transition-colors",
        isActive 
          ? "text-soapp font-medium" 
          : "text-muted-foreground hover:text-soapp"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

const SidebarNavLink: React.FC<{to: string, icon: React.ReactNode, label: string}> = ({
  to,
  icon,
  label,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default Layout;
