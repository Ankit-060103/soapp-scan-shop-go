
import React, { useState, useEffect } from "react";
import { useList } from "@/contexts/ListContext";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Store, Check, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const ShoppingList: React.FC = () => {
  const { listItems, addItem, removeItem, updateQuantity, toggleChecked, clearCheckedItems, checkItemsAvailability } = useList();
  const { selectedStore } = useStore();
  const { toast } = useToast();
  
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [showChecked, setShowChecked] = useState(true);
  
  // Check availability when store changes or when the list is updated
  useEffect(() => {
    if (selectedStore && listItems.length > 0) {
      checkItemsAvailability();
    }
  }, [selectedStore, checkItemsAvailability]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    addItem(newItemName, newItemQuantity);
    setNewItemName("");
    setNewItemQuantity(1);
    
    toast({
      title: "Item Added",
      description: `${newItemName} added to your shopping list.`,
    });
  };
  
  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Item Removed",
      description: `${name} removed from your shopping list.`,
    });
  };
  
  const handleClearChecked = () => {
    clearCheckedItems();
    toast({
      title: "List Updated",
      description: "All checked items have been removed.",
    });
  };
  
  const filteredItems = showChecked ? listItems : listItems.filter(item => !item.checked);
  const hasCheckedItems = listItems.some(item => item.checked);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-soapp" />
            Add Items to Your List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="flex flex-wrap gap-2">
            <div className="flex-grow min-w-[200px]">
              <Input
                type="text"
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="w-20">
              <Input
                type="number"
                min="1"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="soapp-button">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add
            </Button>
          </form>
          
          <div className="mt-4 flex items-center space-x-2">
            <Switch 
              id="show-checked"
              checked={showChecked}
              onCheckedChange={setShowChecked}
            />
            <Label htmlFor="show-checked">Show checked items</Label>
          </div>
        </CardContent>
      </Card>
      
      {!selectedStore && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Store className="h-5 w-5" />
              <p>Select a store to check item availability</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {filteredItems.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Shopping List</CardTitle>
              {hasCheckedItems && (
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleClearChecked}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Clear checked
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {filteredItems.map((item) => (
                <li 
                  key={item.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md border",
                    item.checked 
                      ? "bg-muted/50 text-muted-foreground" 
                      : "bg-background"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleChecked(item.id)}
                      className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center",
                        item.checked 
                          ? "bg-green-500/20 text-green-500 border-green-500" 
                          : "border-gray-300 text-transparent hover:border-gray-400"
                      )}
                    >
                      {item.checked && <Check className="h-4 w-4" />}
                    </button>
                    <span className={cn(item.checked ? "line-through" : "")}>
                      {item.name} × {item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.inStore !== null && (
                      <Badge 
                        variant={item.inStore ? "default" : "outline"} 
                        className={cn(
                          "flex items-center gap-1",
                          item.inStore 
                            ? "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30" 
                            : "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                        )}
                      >
                        {item.inStore 
                          ? <><Check className="h-3.5 w-3.5" /> In stock</> 
                          : <><X className="h-3.5 w-3.5" /> Not in stock</>
                        }
                      </Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground">Your list is empty. Add items above to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShoppingList;
