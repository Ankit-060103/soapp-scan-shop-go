
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CartItems from "@/components/cart/CartItems";

const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
        <CartItems />
      </div>
    </Layout>
  );
};

export default CartPage;
