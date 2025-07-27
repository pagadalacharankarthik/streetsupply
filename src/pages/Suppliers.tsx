import { useState } from 'react';
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
  Heart
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const suppliers = [
    {
      id: 1,
      name: "Krishna Traders",
      rating: 4.8,
      location: "Andheri East, Mumbai",
      phone: "+91 98765 43210",
      categories: ["Rice", "Pulses", "Grains"],
      trustScore: 95,
      deliveryTime: "Same Day",
      minOrder: "₹500",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      featured: true,
      discount: "5% off on bulk orders"
    },
    {
      id: 2,
      name: "Sharma Suppliers",
      rating: 4.6,
      location: "Karol Bagh, Delhi",
      phone: "+91 98765 43211",
      categories: ["Oil", "Spices", "Condiments"],
      trustScore: 92,
      deliveryTime: "24 hours",
      minOrder: "₹300",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
      featured: false,
      discount: null
    },
    {
      id: 3,
      name: "Fresh Produce Co.",
      rating: 4.7,
      location: "Whitefield, Bangalore",
      phone: "+91 98765 43212",
      categories: ["Vegetables", "Fruits", "Herbs"],
      trustScore: 94,
      deliveryTime: "4-6 hours",
      minOrder: "₹200",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
      featured: true,
      discount: "Free delivery on orders above ₹1000"
    },
    {
      id: 4,
      name: "Gourmet Grocers",
      rating: 4.5,
      location: "Park Street, Kolkata",
      phone: "+91 98765 43213",
      categories: ["Dairy", "Meat", "Seafood"],
      trustScore: 89,
      deliveryTime: "Same Day",
      minOrder: "₹400",
      image: "https://images.unsplash.com/photo-1556909114-4c8cb99e4d3e?w=400",
      featured: false,
      discount: null
    }
  ];

  const categories = ["All", "Rice", "Pulses", "Oil", "Spices", "Vegetables", "Dairy", "Meat"];
  const locations = ["All", "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Pune"];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           supplier.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    const matchesLocation = selectedLocation === 'all' ||
                           supplier.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
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
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="relative hover:shadow-lg transition-shadow">
            {supplier.featured && (
              <Badge className="absolute top-4 left-4 z-10 bg-orange-600">
                Featured
              </Badge>
            )}
            
            <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              <img 
                src={supplier.image} 
                alt={supplier.name}
                className="w-full h-full object-cover"
              />
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
                <h3 className="font-semibold text-lg">{supplier.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{supplier.rating}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {supplier.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {supplier.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  Min Order: {supplier.minOrder}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {supplier.categories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-600">Trust Score</div>
                  <div className="font-medium text-green-600">{supplier.trustScore}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Delivery</div>
                  <div className="font-medium">{supplier.deliveryTime}</div>
                </div>
              </div>

              {supplier.discount && (
                <div className="bg-green-50 text-green-700 p-2 rounded text-sm mb-4">
                  🎉 {supplier.discount}
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1">
                  View Products
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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