
import React, { useState } from "react";
import { Product, useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Scan } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showCartOptions, setShowCartOptions] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowCartOptions(true);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      <div className="w-full md:w-1/2">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-auto object-cover rounded-lg shadow-md" 
        />
      </div>
      
      <div className="w-full md:w-1/2 space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        <p className="text-2xl font-bold text-soapp">
          ${product.price.toFixed(2)}
        </p>
        
        <div className="bg-soapp-light p-4 rounded-md">
          <h2 className="font-bold mb-2">Description</h2>
          <p>{product.description}</p>
        </div>
        
        <div>
          <h2 className="font-bold mb-2">Category</h2>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            {product.category}
          </span>
        </div>
        
        {!showCartOptions ? (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <button 
                onClick={decrementQuantity}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 text-gray-700"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-medium w-10 text-center">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 text-gray-700"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <Button 
              className="bg-soapp-accent hover:bg-soapp-accent/90 text-white flex-grow flex items-center justify-center gap-2 py-6"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              Add to Cart
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              className="bg-soapp-accent hover:bg-soapp-accent/90 text-white flex items-center justify-center gap-2 py-6"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart size={20} />
                View Cart
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="border-soapp text-soapp hover:bg-soapp-light flex items-center justify-center gap-2 py-6"
              asChild
            >
              <Link to="/scan-product">
                <Scan size={20} />
                Scan More Products
              </Link>
            </Button>
          </div>
        )}
        
        <div className="text-gray-600">
          {product.inStock ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
