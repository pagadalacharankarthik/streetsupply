import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  MapPin, 
  Phone, 
  Package,
  TrendingUp,
  Filter,
  Heart,
  Store
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      console.error('Error fetching suppliers:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const categories = ["All", "Rice", "Pulses", "Oil", "Spices", "Vegetables", "Dairy", "Meat"];
  const locations = ["All", "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Pune"];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (supplier.categories || []).some((cat: string) => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           (supplier.categories || []).some((cat: string) => cat.toLowerCase() === selectedCategory.toLowerCase());
    const matchesLocation = selectedLocation === 'all' ||
                           (supplier.city || '').toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Suppliers</h1>
        <p className="text-gray-600 mt-1">Find trusted suppliers for your raw materials</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredSuppliers.length} suppliers
        </p>
        <Select defaultValue="rating">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="delivery">Delivery Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading suppliers...</div>
        ) : filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="relative hover:shadow-lg transition-shadow">
              {supplier.is_featured && (
                <Badge className="absolute top-4 left-4 z-10 bg-orange-600">
                  Featured
                </Badge>
              )}
              
              <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {supplier.image_url ? (
                  <img 
                    src={supplier.image_url} 
                    alt={supplier.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Store className="h-16 w-16 text-gray-500" />
                  </div>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{supplier.business_name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{(supplier.rating || 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {supplier.city && supplier.state ? `${supplier.city}, ${supplier.state}` : 'Location not specified'}
                  </div>
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {supplier.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    Min Order: ₹{supplier.min_order_amount || 0}
                  </div>
                </div>

                {supplier.categories && supplier.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {supplier.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs capitalize">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-600">Trust Score</div>
                    <div className="font-medium text-green-600">{supplier.trust_score || 0}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Delivery</div>
                    <div className="font-medium">{supplier.delivery_time || 'Not specified'}</div>
                  </div>
                </div>

                {supplier.discount_text && (
                  <div className="bg-green-50 text-green-700 p-2 rounded text-sm mb-4">
                    🎉 {supplier.discount_text}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1">
                    View Products
                  </Button>
                  {supplier.phone && (
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900">AI Recommendations</CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            Based on your order history and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium">Krishna Traders</p>
                <p className="text-sm text-gray-600">Perfect match for your rice orders</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                95% Match
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium">Fresh Produce Co.</p>
                <p className="text-sm text-gray-600">Best prices for vegetables in your area</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                92% Match
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;