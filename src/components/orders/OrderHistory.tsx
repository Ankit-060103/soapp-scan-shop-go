
import React, { useState } from "react";
import { useCart, Order, CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Receipt from "@/components/checkout/Receipt";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { FileText, ShoppingCart } from "lucide-react";

// Mock past orders for demonstration
const MOCK_PAST_ORDERS: Order[] = [
  {
    items: [
      {
        id: uuidv4(),
        product: {
          id: "p1",
          name: "Organic Bananas",
          price: 2.99,
          description: "Fresh organic bananas",
          imageUrl: "/placeholder.svg",
          category: "Produce",
          inStock: true,
        },
        quantity: 2,
      },
      {
        id: uuidv4(),
        product: {
          id: "p2",
          name: "Whole Milk",
          price: 3.49,
          description: "Fresh whole milk",
          imageUrl: "/placeholder.svg",
          category: "Dairy",
          inStock: true,
        },
        quantity: 1,
      },
    ],
    totalPrice: 9.47,
    orderDate: new Date(2025, 4, 10),
    userId: "user_abc123", // Adding userId to track orders
    storeInfo: {
      name: "SoApp Downtown",
      location: "123 Main St"
    }
  },
  {
    items: [
      {
        id: uuidv4(),
        product: {
          id: "p3",
          name: "Avocado",
          price: 1.99,
          description: "Fresh avocados",
          imageUrl: "/placeholder.svg",
          category: "Produce",
          inStock: true,
        },
        quantity: 3,
      },
    ],
    totalPrice: 5.97,
    orderDate: new Date(2025, 4, 8),
    userId: "user_def456", // Different user
    storeInfo: {
      name: "SoApp Express",
      location: "456 Oak Ave"
    }
  },
];

const OrderHistory: React.FC = () => {
  const { lastOrder } = useCart();
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user
  
  // Helper function to ensure we have a valid Date object
  const ensureDate = (dateOrString: Date | string): Date => {
    if (dateOrString instanceof Date) {
      return dateOrString;
    }
    return new Date(dateOrString);
  };
  
  // Get all orders for the current user from localStorage
  const getUserOrders = () => {
    const orders = [];
    const processedKeys = new Set(); // Track keys we've already processed
    
    // Add the last order if it exists and belongs to the current user
    // Only if we haven't already processed it from localStorage
    if (lastOrder && lastOrder.userId === user?.id) {
      // Ensure orderDate is a Date object
      const processedLastOrder = {
        ...lastOrder,
        orderDate: ensureDate(lastOrder.orderDate)
      };
      orders.push(processedLastOrder);
      // Add "soapp_last_order" to processed keys to avoid duplicates
      processedKeys.add("soapp_last_order");
    }
    
    // Get all orders from localStorage
    const allStoredOrders = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('soapp_order_')) {
        try {
          const orderData = JSON.parse(localStorage.getItem(key) || '');
          if (orderData && orderData.userId === user?.id) {
            // Convert string date to Date object
            orderData.orderDate = ensureDate(orderData.orderDate);
            
            // Add the local storage key as a property to use for tracking
            orderData.storageKey = key;
            
            // Check if this is already in our list from lastOrder
            const isDuplicate = orders.some(order => 
              ensureDate(order.orderDate).getTime() === orderData.orderDate.getTime() && 
              order.totalPrice === orderData.totalPrice &&
              order.userId === orderData.userId
            );
            
            if (!isDuplicate) {
              allStoredOrders.push(orderData);
            }
          }
        } catch (e) {
          console.error('Error parsing order from localStorage:', e);
        }
      }
    }
    
    // Add mock past orders that belong to the current user
    // Only if they don't duplicate any existing orders
    const mockUserOrders = MOCK_PAST_ORDERS.filter(order => {
      if (order.userId === user?.id) {
        // Check if this mock order would be a duplicate of any real orders
        const isDuplicate = [...orders, ...allStoredOrders].some(existingOrder => 
          ensureDate(existingOrder.orderDate).getTime() === ensureDate(order.orderDate).getTime() && 
          existingOrder.totalPrice === order.totalPrice &&
          existingOrder.userId === order.userId
        );
        
        return !isDuplicate;
      }
      return false;
    });
    
    return [...orders, ...allStoredOrders, ...mockUserOrders];
  };
  
  // Get all orders for the current user
  const allOrders = getUserOrders();
  
  // Sort orders by date (newest first)
  allOrders.sort((a, b) => 
    ensureDate(b.orderDate).getTime() - ensureDate(a.orderDate).getTime()
  );
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleReorderClick = (order: Order) => {
    toast({
      title: "Coming Soon",
      description: "Reorder functionality will be available soon!",
    });
  };

  // Prepare order for display - ensure Date objects
  const prepareOrderForDisplay = (order: Order): Order => {
    return {
      ...order,
      orderDate: ensureDate(order.orderDate)
    };
  };

  return (
    <div className="space-y-6">
      {allOrders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No orders found for your account.</p>
          </CardContent>
        </Card>
      ) : (
        allOrders.map((order, index) => {
          const processedOrder = prepareOrderForDisplay(order);
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      {processedOrder.storeInfo?.name ? `Placed at ${processedOrder.storeInfo.name}` : 'Online Order'} on {processedOrder.orderDate.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <span className="font-medium">
                    ${processedOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Items:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {processedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.product.name} - ${(item.product.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedOrder(processedOrder)}
                        className="flex items-center gap-2"
                      >
                        <FileText size={16} />
                        View Receipt
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Receipt</DialogTitle>
                        <DialogDescription>
                          Order placed on {processedOrder.orderDate.toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedOrder && (
                        <Receipt 
                          items={selectedOrder.items}
                          totalPrice={selectedOrder.totalPrice}
                          orderDate={ensureDate(selectedOrder.orderDate)}
                          storeInfo={selectedOrder.storeInfo}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    className="border-soapp text-soapp hover:bg-soapp-light flex items-center gap-2"
                    onClick={() => handleReorderClick(processedOrder)}
                  >
                    <ShoppingCart size={16} />
                    Reorder
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default OrderHistory;
