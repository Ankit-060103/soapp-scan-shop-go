
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QRScanner from "@/components/scanners/QRScanner";

const SelectStore: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Select a Store</h1>
          <p className="text-gray-600">
            Scan the QR code displayed in the store or select from the list below
          </p>
        </div>
        
        <QRScanner />
      </div>
    </Layout>
  );
};

export default SelectStore;
