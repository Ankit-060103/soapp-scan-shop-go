
import React from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import Layout from "@/components/Layout";
import ProductDetails from "@/components/products/ProductDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductDetailPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { productId } = useParams<{ productId: string }>();
  const { getProductById } = useProducts();
  const navigate = useNavigate();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const product = productId ? getProductById(productId) : undefined;

  // If product not found, show error message
  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            Sorry, the product you're looking for doesn't exist or has been removed.
          </p>
          <Button className="soapp-button" onClick={() => navigate("/scan-product")}>
            Scan Another Product
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center gap-1"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      
      <ProductDetails product={product} />
    </Layout>
  );
};

export default ProductDetailPage;
