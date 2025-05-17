
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import OrderHistory from "@/components/orders/OrderHistory";

const OrdersPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Order History</h1>
        <p className="text-gray-600 mb-6">
          All orders made with your account will be displayed below.
        </p>
        <OrderHistory />
      </div>
    </Layout>
  );
};

export default OrdersPage;
