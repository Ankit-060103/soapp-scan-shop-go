
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, LogOut, Home, Scan, Store, User, ListOrdered, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="soapp-gradient p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white text-2xl font-bold">
            SoApp
          </Link>
          
          <div className="hidden md:flex items-center">
            <NavigationMenu className="mx-4">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10">
                    My Account
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <ListItem title="Profile" href="/profile" icon={<User size={18} />}>
                        Manage your personal information
                      </ListItem>
                      <ListItem title="Orders" href="/orders" icon={<ListOrdered size={18} />}>
                        View your order history
                      </ListItem>
                      <ListItem title="Support" href="/support" icon={<Mail size={18} />}>
                        Get help with your purchases
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center space-x-4">
            {selectedStore && (
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
        <nav className="sticky bottom-0 w-full bg-background border-t border-gray-200 p-2 shadow-lg dark:border-gray-800">
          <div className="container mx-auto flex justify-between items-center">
            <NavLink to="/dashboard" icon={<Home size={20} />} label="Home" currentPath={location.pathname} />
            <NavLink to="/select-store" icon={<Store size={20} />} label="Store" currentPath={location.pathname} />
            <NavLink to="/scan-product" icon={<Scan size={20} />} label="Scan" currentPath={location.pathname} />
            <NavLink to="/cart" icon={<ShoppingCart size={20} />} label="Cart" currentPath={location.pathname} />
            <NavLink to="/profile" icon={<User size={20} />} label="Profile" currentPath={location.pathname} />
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
          : "text-muted-foreground hover:text-soapp"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

// Navigation menu list item
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon && icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Layout;
