
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Receipt from "./Receipt";

const ThankYou: React.FC = () => {
  const { lastOrder } = useCart();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      
      <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
      <p className="text-xl mb-1">Your order has been placed successfully.</p>
      <p className="text-gray-600 mb-8">A confirmation has been sent to your email.</p>
      
      {lastOrder && (
        <div className="w-full my-8">
          <Receipt 
            items={lastOrder.items} 
            totalPrice={lastOrder.totalPrice} 
            orderDate={lastOrder.orderDate} 
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button className="soapp-button flex items-center gap-2" asChild>
          <Link to="/dashboard">
            <Home size={18} />
            Back to Home
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          className="border-soapp text-soapp hover:bg-soapp-light flex items-center gap-2"
          asChild
        >
          <Link to="/scan-product">
            <ShoppingCart size={18} />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;
