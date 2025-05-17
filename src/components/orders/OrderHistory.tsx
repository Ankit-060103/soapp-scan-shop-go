
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Receipt from "@/components/checkout/Receipt";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { FileText, Trash2 } from "lucide-react";

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
  const { lastOrder, deleteOrder } = useCart();
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user
  
  // Get all orders for the current user from localStorage
  const getUserOrders = () => {
    const orders = [];
    
    // Add the last order if it exists and belongs to the current user
    if (lastOrder && lastOrder.userId === user?.id) {
      orders.push(lastOrder);
    }
    
    // Get all orders from localStorage
    const allStoredOrders = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('soapp_order_')) {
        try {
          const orderData = JSON.parse(localStorage.getItem(key) || '');
          if (orderData && orderData.userId === user?.id) {
            // Convert string date back to Date object
            orderData.orderDate = new Date(orderData.orderDate);
            
            // Add the local storage key as a property to use for deletion
            orderData.storageKey = key;
            
            allStoredOrders.push(orderData);
          }
        } catch (e) {
          console.error('Error parsing order from localStorage:', e);
        }
      }
    }
    
    // Add mock past orders that belong to the current user
    const mockUserOrders = MOCK_PAST_ORDERS.filter(order => 
      order.userId === user?.id
    );
    
    return [...orders, ...allStoredOrders, ...mockUserOrders];
  };
  
  // Get all orders for the current user
  const allOrders = getUserOrders();
  
  // Sort orders by date (newest first)
  allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleReorderClick = (order: Order) => {
    toast({
      title: "Coming Soon",
      description: "Reorder functionality will be available soon!",
    });
  };

  const handleDeleteOrder = (storageKey: string) => {
    if (storageKey) {
      deleteOrder(storageKey);
      toast({
        title: "Order Deleted",
        description: "The order has been removed from your history."
      });
    }
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
                    {order.storeInfo?.name ? `Placed at ${order.storeInfo.name}` : 'Online Order'} on {order.orderDate.toLocaleDateString()}
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
                        Order placed on {order.orderDate.toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                      <Receipt 
                        items={selectedOrder.items}
                        totalPrice={selectedOrder.totalPrice}
                        orderDate={selectedOrder.orderDate}
                        storeInfo={selectedOrder.storeInfo}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="border-soapp text-soapp hover:bg-soapp-light flex items-center gap-2"
                  onClick={() => handleReorderClick(order)}
                >
                  <ShoppingCart size={16} />
                  Reorder
                </Button>
                
                {order.storageKey && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order History</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this order from your history? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOrder(order.storageKey)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
