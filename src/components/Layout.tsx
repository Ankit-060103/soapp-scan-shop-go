
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, LogOut, Home, Scan, Store, User, ListOrdered, Mail, Menu, X } from "lucide-react";
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
          {/* Mobile menu trigger */}
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
            
            <Button variant="ghost" onClick={logout} className="text-white p-2 hidden md:flex">
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
        <nav className="sticky bottom-0 w-full bg-background border-t border-gray-200 p-2 shadow-lg md:hidden dark:border-gray-800">
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
