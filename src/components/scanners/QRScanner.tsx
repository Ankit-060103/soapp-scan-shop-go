
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Scan, Store } from "lucide-react";

// Mock stores data
const mockStores = [
  {
    id: "s1",
    name: "Downtown Electronics",
    location: "123 Main St, Downtown",
    qrCode: "store_downtown"
  },
  {
    id: "s2",
    name: "Westside Tech Shop",
    location: "456 Park Ave, Westside",
    qrCode: "store_westside"
  },
  {
    id: "s3",
    name: "Riverfront Gadgets",
    location: "789 River Rd, Riverside",
    qrCode: "store_riverfront"
  }
];

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { selectStore } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const startScanning = () => {
    setScanning(true);
    
    // In a real app, this would use a camera API to scan a QR code
    // For this demo, we'll simulate finding a QR code after a delay
    setTimeout(() => {
      // Randomly select one of our mock stores
      const randomStore = mockStores[Math.floor(Math.random() * mockStores.length)];
      setScannedCode(randomStore.qrCode);
    }, 3000);
  };
  
  // Monitor for successful scan
  useEffect(() => {
    if (!scannedCode) return;
    
    // Find the store that matches the scanned code
    const foundStore = mockStores.find(store => store.qrCode === scannedCode);
    
    if (foundStore) {
      selectStore(foundStore);
      toast({
        title: "Store selected",
        description: `You've selected ${foundStore.name}`,
      });
      
      // Stop scanning
      setScanning(false);
      
      // Navigate to the product scanning page
      navigate("/scan-product");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid QR code",
        description: "This QR code is not associated with any store.",
      });
      setScanning(false);
      setScannedCode(null);
    }
  }, [scannedCode, selectStore, navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative w-full max-w-sm h-64 border-4 rounded-lg mb-6 ${scanning ? 'border-soapp' : 'border-gray-300'}`}>
        {scanning ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scanning-animation">
              <Scan size={60} className="text-soapp" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <Store size={48} />
            <p className="mt-2 text-center">Position the QR code within the frame to scan</p>
          </div>
        )}
      </div>
      
      <Button
        onClick={startScanning}
        disabled={scanning}
        className="soapp-button"
      >
        {scanning ? "Scanning..." : "Scan Store QR Code"}
      </Button>
      
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Demo Stores</h3>
        <div className="space-y-3">
          {mockStores.map(store => (
            <div 
              key={store.id}
              className="soapp-card cursor-pointer"
              onClick={() => {
                selectStore(store);
                toast({
                  title: "Store selected",
                  description: `You've selected ${store.name}`,
                });
                navigate("/scan-product");
              }}
            >
              <h4 className="font-bold">{store.name}</h4>
              <p className="text-gray-600">{store.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
