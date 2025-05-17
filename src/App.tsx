
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ListProvider } from "@/contexts/ListContext";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SelectStore from "./pages/SelectStore";
import ScanProduct from "./pages/ScanProduct";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import SupportPage from "./pages/SupportPage";
import ShoppingListPage from "./pages/ShoppingListPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <ProductProvider>
                <ListProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/select-store" element={<SelectStore />} />
                      <Route path="/scan-product" element={<ScanProduct />} />
                      <Route path="/product/:productId" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/thank-you" element={<ThankYouPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/support" element={<SupportPage />} />
                      <Route path="/shopping-list" element={<ShoppingListPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TooltipProvider>
                </ListProvider>
              </ProductProvider>
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
