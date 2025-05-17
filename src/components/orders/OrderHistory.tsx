
import React, { useState } from "react";
import { useCart, Order, CartItem, Product } from "@/contexts/CartContext";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Receipt from "@/components/checkout/Receipt";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

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
  },
];

const OrderHistory: React.FC = () => {
  const { lastOrder } = useCart();
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user
  
  // Filter orders for the current logged-in user only
  const userOrders = lastOrder && lastOrder.userId === user?.id
    ? [lastOrder] 
    : [];
  
  // Add mock past orders that belong to the current user
  const mockUserOrders = MOCK_PAST_ORDERS.filter(order => 
    order.userId === user?.id
  );
  
  // Combine last order with filtered mock past orders
  const allOrders = [...userOrders, ...mockUserOrders];
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleReorderClick = (order: Order) => {
    toast({
      title: "Coming Soon",
      description: "Reorder functionality will be available soon!",
    });
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
        allOrders.map((order, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">
                    Order #{Math.random().toString(36).substring(2, 8).toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    Placed on {order.orderDate.toLocaleDateString()}
                  </CardDescription>
                </div>
                <span className="font-medium">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Items:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {order.items.map((item, idx) => (
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
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Receipt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order Receipt</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                      <Receipt 
                        items={selectedOrder.items}
                        totalPrice={selectedOrder.totalPrice}
                        orderDate={selectedOrder.orderDate}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="border-soapp text-soapp hover:bg-soapp-light"
                  onClick={() => handleReorderClick(order)}
                >
                  Reorder
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
