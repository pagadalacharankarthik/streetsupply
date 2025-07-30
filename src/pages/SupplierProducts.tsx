import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string;
  category: string;
  minimum_quantity: number;
  stock_quantity: number;
  image_url?: string;
}

interface Supplier {
  id: string;
  business_name: string;
  description: string;
  image_url?: string;
}

const SupplierProducts = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (supplierId) {
      fetchSupplierAndProducts();
    }
  }, [supplierId]);

  const fetchSupplierAndProducts = async () => {
    try {
      // Fetch supplier info
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();

      if (supplierError) throw supplierError;
      setSupplier(supplierData);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_active', true)
        .order('name');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Initialize quantities
      const initialQuantities = (productsData || []).reduce((acc, product) => {
        acc[product.id] = product.minimum_quantity;
        return acc;
      }, {} as Record<string, number>);
      setQuantities(initialQuantities);

    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      toast({
        title: "Error",
        description: "Failed to fetch supplier products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number, minQuantity: number) => {
    if (newQuantity >= minQuantity) {
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || product.minimum_quantity;
    
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      supplierId: supplierId!,
      supplierName: supplier?.business_name || '',
      price: product.price_per_unit,
      unit: product.unit,
      minQuantity: product.minimum_quantity,
      imageUrl: product.image_url,
      quantity
    });

    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity} ${product.unit}) added to cart`,
    });
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  if (!supplier) {
    return <div className="p-6">Supplier not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/suppliers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Suppliers
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{supplier.business_name}</h1>
          <p className="text-gray-600 mt-1">Browse products from this supplier</p>
        </div>
      </div>

      {supplier.description && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700">{supplier.description}</p>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">This supplier hasn't added any products yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              {product.image_url && (
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="secondary" className="w-fit capitalize">
                  {product.category}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {product.description && (
                  <p className="text-sm text-gray-600">{product.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Price</div>
                    <div className="font-medium text-lg">₹{product.price_per_unit}/{product.unit}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Min Order</div>
                    <div className="font-medium">{product.minimum_quantity} {product.unit}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-600">Available</div>
                    <div className="font-medium">{product.stock_quantity} {product.unit}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(
                          product.id, 
                          (quantities[product.id] || product.minimum_quantity) - 1,
                          product.minimum_quantity
                        )}
                        disabled={(quantities[product.id] || product.minimum_quantity) <= product.minimum_quantity}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={quantities[product.id] || product.minimum_quantity}
                        onChange={(e) => updateQuantity(
                          product.id,
                          parseInt(e.target.value) || product.minimum_quantity,
                          product.minimum_quantity
                        )}
                        className="w-20 text-center"
                        min={product.minimum_quantity}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(
                          product.id,
                          (quantities[product.id] || product.minimum_quantity) + 1,
                          product.minimum_quantity
                        )}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 gap-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add ₹{((quantities[product.id] || product.minimum_quantity) * product.price_per_unit).toFixed(0)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierProducts;