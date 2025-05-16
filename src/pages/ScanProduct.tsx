
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Navigate, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import NFCScanner from "@/components/scanners/NFCScanner";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

const ScanProduct: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectedStore } = useStore();
  const navigate = useNavigate();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If no store is selected, show a message
  if (!selectedStore) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Store size={64} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Store Selected</h2>
          <p className="text-gray-600 text-center mb-6">
            You need to select a store before scanning products.
          </p>
          <Button className="soapp-button" onClick={() => navigate("/select-store")}>
            Select a Store
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Scan Products</h1>
          <p className="text-gray-600">
            Hold your phone near an NFC-tagged product to view its details
          </p>
        </div>
        
        <NFCScanner />
      </div>
    </Layout>
  );
};

export default ScanProduct;
