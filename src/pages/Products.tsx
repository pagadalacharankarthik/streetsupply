import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  is_active: boolean;
  image_url?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // First get the supplier info
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!supplier) {
        setProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_active: !currentStatus } : p
      ));

      toast({
        title: "Success",
        description: `Product ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link to="/add-product">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first product to your catalog</p>
            <Link to="/add-product">
              <Button>Add Your First Product</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

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
                <CardDescription className="capitalize">
                  {product.category}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {product.description && (
                  <p className="text-sm text-gray-600">{product.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Price</div>
                    <div className="font-medium">₹{product.price_per_unit}/{product.unit}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Stock</div>
                    <div className="font-medium">{product.stock_quantity} {product.unit}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Min Order</div>
                    <div className="font-medium">{product.minimum_quantity} {product.unit}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleProductStatus(product.id, product.is_active)}
                    className="flex-1"
                  >
                    {product.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;