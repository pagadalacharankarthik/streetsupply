import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart, Star, Package, Clock, Shield } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string;
  category: string;
  minimum_quantity: number;
  stock_quantity: number;
  is_active: boolean;
  image_url?: string;
  suppliers: {
    business_name: string;
    rating: number;
    delivery_time: string;
    trust_score: number;
  };
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const userRole = user?.user_metadata?.role || 'vendor';

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          suppliers (
            business_name,
            rating,
            delivery_time,
            trust_score
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
      setQuantity(data.minimum_quantity);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Product not found or unavailable",
        variant: "destructive",
      });
      navigate('/suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      supplierId: product.suppliers?.business_name || 'Unknown',
      supplierName: product.suppliers?.business_name || 'Unknown',
      price: product.price_per_unit,
      unit: product.unit,
      minQuantity: product.minimum_quantity,
      imageUrl: product.image_url,
      quantity
    });

    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.unit} of ${product.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 md:p-6 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-4">The product you're looking for is not available.</p>
        <Button onClick={() => navigate('/suppliers')}>
          Browse Suppliers
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <p className="text-lg text-gray-600 capitalize">{product.category}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-3xl font-bold text-primary">
                ₹{product.price_per_unit}
                <span className="text-lg text-gray-600">/{product.unit}</span>
              </div>
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Stock Available</div>
              <div className="font-semibold">{product.stock_quantity} {product.unit}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Minimum Order</div>
              <div className="font-semibold">{product.minimum_quantity} {product.unit}</div>
            </div>
          </div>

          {/* Supplier Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Business Name</span>
                <span className="font-medium">{product.suppliers?.business_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.suppliers?.rating || 0}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Delivery Time</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{product.suppliers?.delivery_time}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trust Score</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{product.suppliers?.trust_score}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart (only for vendors) */}
          {userRole === 'vendor' && product.is_active && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity ({product.unit})</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.minimum_quantity, parseInt(e.target.value) || product.minimum_quantity))}
                    min={product.minimum_quantity}
                    max={product.stock_quantity}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Minimum order: {product.minimum_quantity} {product.unit}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Cost</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{(product.price_per_unit * quantity).toLocaleString()}
                  </span>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                  disabled={quantity > product.stock_quantity}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>

                {quantity > product.stock_quantity && (
                  <p className="text-sm text-red-600 text-center">
                    Requested quantity exceeds available stock
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;