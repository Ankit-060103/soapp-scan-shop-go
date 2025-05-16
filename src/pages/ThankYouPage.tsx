
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ThankYou from "@/components/checkout/ThankYou";
import { useStore } from "@/contexts/StoreContext";

const ThankYouPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectedStore, clearSelectedStore } = useStore();

  useEffect(() => {
    // Clear selected store when user completes checkout
    if (selectedStore) {
      clearSelectedStore();
    }
  }, []);

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <ThankYou />
    </Layout>
  );
};

export default ThankYouPage;
