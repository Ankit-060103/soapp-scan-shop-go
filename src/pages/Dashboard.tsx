
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Scan, Store, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { selectedStore } = useStore();
  const { products } = useProducts();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Get featured products (first 3)
  const featuredProducts = products.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="soapp-card bg-soapp-light">
          <h1 className="text-2xl font-bold mb-2">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-gray-600">
            What would you like to do today?
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/select-store" className="soapp-card flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="bg-soapp-light p-3 rounded-full">
              <Store className="text-soapp" size={24} />
            </div>
            <div>
              <h2 className="font-bold">Select Store</h2>
              <p className="text-sm text-gray-600">
                {selectedStore ? `Current: ${selectedStore.name}` : "Find a store near you"}
              </p>
            </div>
          </Link>
          
          <Link to="/scan-product" className="soapp-card flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="bg-soapp-light p-3 rounded-full">
              <Scan className="text-soapp" size={24} />
            </div>
            <div>
              <h2 className="font-bold">Scan Products</h2>
              <p className="text-sm text-gray-600">
                Scan NFC tags to view product details
              </p>
            </div>
          </Link>
          
          <Link to="/cart" className="soapp-card flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="bg-soapp-light p-3 rounded-full">
              <ShoppingCart className="text-soapp" size={24} />
            </div>
            <div>
              <h2 className="font-bold">View Cart</h2>
              <p className="text-sm text-gray-600">
                Check your items and checkout
              </p>
            </div>
          </Link>
        </div>
        
        {/* Featured products */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Featured Products</h2>
            <Link to="/scan-product" className="text-soapp hover:underline text-sm">
              View More
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map(product => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id}
                className="soapp-card hover:shadow-xl transition-shadow"
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-40 object-cover rounded-t-md mb-3" 
                />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-soapp font-medium">${product.price.toFixed(2)}</p>
                <p className="text-gray-600 text-sm truncate mt-1">{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
