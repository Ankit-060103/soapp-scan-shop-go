
import React, { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem } from "@/contexts/CartContext";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReceiptText, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";

interface ReceiptProps {
  items: CartItem[];
  totalPrice: number;
  orderDate: Date | string;
  storeInfo?: {
    name: string;
    location: string;
  };
}

const Receipt: React.FC<ReceiptProps> = ({ items, totalPrice, orderDate, storeInfo }) => {
  const { user } = useAuth();
  const { selectedStore } = useStore();
  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;
  
  const store = storeInfo || selectedStore || { 
    name: "SoApp Store", 
    location: "Online" 
  };
  
  // Ensure orderDate is a Date object
  const ensuredOrderDate = orderDate instanceof Date ? orderDate : new Date(orderDate);
  
  // Generate receipt data for QR code
  const receiptData = useMemo(() => {
    const receiptInfo = {
      store: {
        name: store.name,
        location: store.location
      },
      customer: {
        name: user?.name || "Valued Customer",
        email: user?.email || "guest@example.com",
        id: user?.id || "guest"
      },
      date: ensuredOrderDate.toLocaleDateString(),
      time: ensuredOrderDate.toLocaleTimeString(),
      orderId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      items: items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      subtotal: totalPrice,
      tax: tax,
      total: total
    };
    return encodeURIComponent(JSON.stringify(receiptInfo));
  }, [items, totalPrice, tax, total, ensuredOrderDate, user, store]);

  // QR code URL - using QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${receiptData}`;
  
  // Function to download receipt as text file
  const handleDownloadText = () => {
    // Generate text content for receipt
    const textContent = [
      "SoApp Receipt",
      "=============",
      "",
      `Store: ${store.name}`,
      `Location: ${store.location}`,
      `Customer: ${user?.name || "Valued Customer"}`,
      `Email: ${user?.email || "guest@example.com"}`,
      `Date: ${ensuredOrderDate.toLocaleDateString()}`,
      `Time: ${ensuredOrderDate.toLocaleTimeString()}`,
      `Order ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      "",
      "Items:",
      "------",
      ...items.map(item => `${item.quantity}x ${item.product.name} - $${item.product.price.toFixed(2)} = $${(item.product.price * item.quantity).toFixed(2)}`),
      "",
      `Subtotal: $${totalPrice.toFixed(2)}`,
      `Tax (8%): $${tax.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      "",
      "Thank you, shop again!",
      "We appreciate your business"
    ].join('\n');
    
    // Create a Blob with the text content
    const blob = new Blob([textContent], { type: 'text/plain' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SoApp_Receipt_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="relative">
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={handleDownloadText}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          Download Receipt
        </Button>
      </div>
      
      <div id="receipt-to-download" className="border border-gray-300 rounded-md p-6 bg-background shadow-md max-w-2xl mx-auto dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">SoApp Receipt</h2>
            <p className="text-muted-foreground">Thank you for your purchase!</p>
          </div>
          <ReceiptText size={32} className="text-soapp dark:text-soapp-light" />
        </div>
        
        <div className="border-t border-b border-gray-300 py-4 mb-6 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            <p><span className="font-semibold">Store:</span> {store.name}</p>
            <p><span className="font-semibold">Location:</span> {store.location}</p>
            <p><span className="font-semibold">Customer:</span> {user?.name || "Valued Customer"}</p>
            <p><span className="font-semibold">Email:</span> {user?.email || "guest@example.com"}</p>
            <p><span className="font-semibold">Date:</span> {ensuredOrderDate.toLocaleDateString()}</p>
            <p><span className="font-semibold">Time:</span> {ensuredOrderDate.toLocaleTimeString()}</p>
            <p><span className="font-semibold">Order ID:</span> {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${(item.product.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Subtotal</TableCell>
              <TableCell className="text-right">${totalPrice.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Tax (8%)</TableCell>
              <TableCell className="text-right">${tax.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">${total.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        
        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-2">Scan to save receipt</p>
          <img 
            src={qrCodeUrl} 
            alt="Receipt QR Code" 
            className="border border-gray-300 rounded-md p-1 dark:border-gray-700"
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg font-medium">Thank you, shop again!</p>
          <p className="text-sm text-muted-foreground mt-2">We appreciate your business</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
