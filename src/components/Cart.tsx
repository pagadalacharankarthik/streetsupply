import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {itemCount}
        </Badge>
      )}
    </div>
  );
}

export function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      // Group items by supplier
      const ordersBySupplier = items.reduce((acc, item) => {
        if (!acc[item.supplierId]) {
          acc[item.supplierId] = {
            supplierId: item.supplierId,
            supplierName: item.supplierName,
            items: [],
            total: 0
          };
        }
        acc[item.supplierId].items.push(item);
        acc[item.supplierId].total += item.price * item.quantity;
        return acc;
      }, {} as Record<string, any>);

      // Create orders for each supplier
      for (const order of Object.values(ordersBySupplier)) {
        // Create order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            vendor_id: user?.id,
            supplier_id: order.supplierId,
            total_amount: order.total,
            status: 'pending' as const,
            order_number: `ORD-${Date.now()}`
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = order.items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      clearCart();
      toast({
        title: "Success",
        description: "Orders placed successfully!",
      });

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <CartIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your items and place orders
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 mt-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {items.map((item) => (
                  <Card key={item.productId}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">{item.supplierName}</p>
                          <p className="text-sm font-medium">₹{item.price}/{item.unit}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= item.minQuantity}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || item.minQuantity)}
                            className="w-20 text-center"
                            min={item.minQuantity}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total: ₹{getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearCart} 
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}