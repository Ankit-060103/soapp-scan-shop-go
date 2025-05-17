
import React, { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem } from "@/contexts/CartContext";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt as ReceiptIcon, QrCode } from "lucide-react";

interface ReceiptProps {
  items: CartItem[];
  totalPrice: number;
  orderDate: Date;
}

const Receipt: React.FC<ReceiptProps> = ({ items, totalPrice, orderDate }) => {
  const { user } = useAuth();
  const tax = totalPrice * 0.08;
  const total = totalPrice + tax;
  
  // Generate receipt data for QR code
  const receiptData = useMemo(() => {
    const receiptInfo = {
      customer: {
        name: user?.name || "Valued Customer",
        email: user?.email || "guest@example.com",
        id: user?.id || "guest"
      },
      date: orderDate.toLocaleDateString(),
      time: orderDate.toLocaleTimeString(),
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
  }, [items, totalPrice, tax, total, orderDate, user]);

  // QR code URL - using QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${receiptData}`;
  
  return (
    <div className="border border-gray-300 rounded-md p-6 bg-background shadow-md max-w-2xl mx-auto dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">SoApp Receipt</h2>
          <p className="text-muted-foreground">Thank you for your purchase!</p>
        </div>
        <ReceiptIcon size={32} className="text-soapp dark:text-soapp-light" />
      </div>
      
      <div className="border-t border-b border-gray-300 py-4 mb-6 dark:border-gray-700">
        <div className="flex flex-col gap-2">
          <p><span className="font-semibold">Customer:</span> {user?.name || "Valued Customer"}</p>
          <p><span className="font-semibold">Email:</span> {user?.email || "guest@example.com"}</p>
          <p><span className="font-semibold">Date:</span> {orderDate.toLocaleDateString()}</p>
          <p><span className="font-semibold">Time:</span> {orderDate.toLocaleTimeString()}</p>
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
  );
};

export default Receipt;
