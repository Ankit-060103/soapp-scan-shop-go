
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Scan, Store, ShoppingCart, List } from "lucide-react";
import { Link } from "react-router-dom";
import { useList } from "@/contexts/ListContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { selectedStore } = useStore();
  const { listItems } = useList();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Extract first name from user's name or email
  const getFirstName = () => {
    if (user?.name) {
      // Split name by spaces and get the first part
      return user.name.split(' ')[0];
    } else if (user?.email) {
      // If no name, use the part before @ in email
      return user.email.split('@')[0];
    }
    return '';
  };

  const firstName = getFirstName();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="soapp-card bg-soapp-light">
          <h1 className="text-2xl font-bold mb-2">
            Welcome{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            What would you like to do today?
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/select-store" className="soapp-card flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="bg-soapp-light p-3 rounded-full">
              <Store className="text-soapp" size={24} />
            </div>
            <div>
              <h2 className="font-bold">Select Store</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
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
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Scan NFC tags to view product details
              </p>
            </div>
          </Link>
          
          <Link to="/shopping-list" className="soapp-card flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="bg-soapp-light p-3 rounded-full">
              <List className="text-soapp" size={24} />
            </div>
            <div>
              <h2 className="font-bold">My List</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {listItems.length > 0 
                  ? `${listItems.length} items on your list` 
                  : "Create your shopping list"}
              </p>
            </div>
          </Link>
          
          <Link to="/cart" className="soapp-card flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="bg-soapp-light p-3 rounded-full">
              <ShoppingCart className="text-soapp" size={24} />
            </div>
            <div>
              <h2 className="font-bold">View Cart</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Check your items and checkout
              </p>
            </div>
          </Link>
        </div>
        
        {/* My List Preview */}
        {listItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>My Shopping List</CardTitle>
                <Link to="/shopping-list">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {listItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={item.checked ? "line-through text-gray-400" : ""}>
                        {item.name} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {item.inStore === true ? "In stock" : 
                       item.inStore === false ? "Not in stock" : "Unknown"}
                    </span>
                  </li>
                ))}
                {listItems.length > 3 && (
                  <li className="pt-2 text-center text-sm text-gray-500">
                    + {listItems.length - 3} more items
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
