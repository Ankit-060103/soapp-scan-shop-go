
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ShoppingList from "@/components/list/ShoppingList";

const ShoppingListPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Shopping List</h1>
        <ShoppingList />
      </div>
    </Layout>
  );
};

export default ShoppingListPage;
