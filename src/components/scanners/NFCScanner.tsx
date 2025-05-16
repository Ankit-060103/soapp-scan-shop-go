
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ScanQrCode } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";

const NFCScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedTag, setScannedTag] = useState<string | null>(null);
  const { getProductsByNfcId } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const startScanning = () => {
    setScanning(true);
    
    // In a real app, this would use the Web NFC API to scan for NFC tags
    // For this demo, we'll simulate finding an NFC tag after a delay
    setTimeout(() => {
      // Simulate scanning one of our mock NFC tags
      const mockNfcTags = ["nfc123", "nfc456", "nfc789", "nfc012", "nfc345"];
      const randomTag = mockNfcTags[Math.floor(Math.random() * mockNfcTags.length)];
      setScannedTag(randomTag);
    }, 2500);
  };

  // Monitor for successful scan
  useEffect(() => {
    if (!scannedTag) return;
    
    // Find the product that matches the scanned NFC tag
    const product = getProductsByNfcId(scannedTag);
    
    if (product) {
      toast({
        title: "Product found!",
        description: `Scanned: ${product.name}`,
      });
      
      // Stop scanning
      setScanning(false);
      
      // Navigate to the product details page
      navigate(`/product/${product.id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Unknown product",
        description: "This product tag could not be recognized.",
      });
      setScanning(false);
      setScannedTag(null);
    }
  }, [scannedTag, getProductsByNfcId, navigate, toast]);

  // For demo purposes, provide a list of available products to scan
  const { products } = useProducts();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative w-full max-w-sm h-64 border-4 rounded-lg mb-6 ${scanning ? 'border-soapp' : 'border-gray-300'}`}>
        {scanning ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scanning-animation">
              <ScanQrCode size={60} className="text-soapp" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <ScanQrCode size={48} />
            <p className="mt-2 text-center">Bring your phone close to an NFC tag to scan the product</p>
          </div>
        )}
      </div>
      
      <Button
        onClick={startScanning}
        disabled={scanning}
        className="soapp-button"
      >
        {scanning ? "Scanning..." : "Scan Product Tag"}
      </Button>

      <div className="mt-8 w-full max-w-md">
        <h3 className="font-bold text-lg mb-4">Demo Products</h3>
        <div className="space-y-3">
          {products.map(product => (
            <div 
              key={product.id}
              className="soapp-card cursor-pointer flex items-center"
              onClick={() => {
                navigate(`/product/${product.id}`);
              }}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-16 h-16 object-cover rounded-md mr-4" 
              />
              <div>
                <h4 className="font-bold">{product.name}</h4>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NFCScanner;
