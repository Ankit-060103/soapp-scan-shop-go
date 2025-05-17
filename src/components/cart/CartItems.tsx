
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

const CartItems: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, checkout } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setIsCheckingOut(true);
      await checkout();
      // Redirect is now handled in the checkout function
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <ShoppingCart size={64} className="mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="mb-6">Start scanning products to add items to your cart.</p>
        <Button className="soapp-button" asChild>
          <a href="/scan-product">Scan Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="soapp-card flex flex-col sm:flex-row items-center gap-4">
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            
            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="bg-gray-200 p-1.5 rounded-full hover:bg-gray-300 text-gray-700"
              >
                <Minus size={14} />
              </button>
              <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="bg-gray-200 p-1.5 rounded-full hover:bg-gray-300 text-gray-700"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="font-bold text-lg w-20 text-center">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg mb-2">
          <span>Subtotal ({totalItems} items)</span>
          <span className="font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg mb-4">
          <span>Tax</span>
          <span className="font-bold">${(totalPrice * 0.08).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold mb-6">
          <span>Total</span>
          <span>${(totalPrice + totalPrice * 0.08).toFixed(2)}</span>
        </div>
        
        <Button 
          className="soapp-button w-full py-6 text-lg"
          disabled={isCheckingOut}
          onClick={handleCheckout}
        >
          {isCheckingOut ? "Processing..." : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
};

export default CartItems;
