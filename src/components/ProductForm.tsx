import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const categories = [
  'rice', 'pulses', 'oil', 'spices', 'vegetables', 
  'fruits', 'dairy', 'meat', 'seafood', 'grains', 
  'condiments', 'herbs'
];

const ProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [supplierId, setSupplierId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    price_per_unit: '',
    minimum_quantity: '1',
    stock_quantity: '0',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          toast.error('You need to create a supplier profile first!');
          navigate('/supplier-setup');
          return;
        }

        setSupplierId(data.id);
      } catch (error: any) {
        toast.error('Error fetching supplier data: ' + error.message);
        navigate('/dashboard');
      }
    };

    fetchSupplier();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supplierId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          supplier_id: supplierId,
          name: formData.name,
          description: formData.description,
          category: formData.category as any,
          unit: formData.unit,
          price_per_unit: parseFloat(formData.price_per_unit),
          minimum_quantity: parseInt(formData.minimum_quantity),
          stock_quantity: parseInt(formData.stock_quantity),
          image_url: formData.image_url || null,
          is_active: formData.is_active
        });

      if (error) throw error;

      toast.success('Product added successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Error adding product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!supplierId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Add a new product to your supplier catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="kg, litre, piece, etc."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_unit">Price per Unit (₹) *</Label>
                <Input
                  id="price_per_unit"
                  type="number"
                  step="0.01"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum_quantity">Minimum Quantity</Label>
                <Input
                  id="minimum_quantity"
                  type="number"
                  value={formData.minimum_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimum_quantity: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/product-image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Product is active and available for orders</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;