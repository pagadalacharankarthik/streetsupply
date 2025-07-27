import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Edit,
  Save,
  Camera,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    businessName: 'Street Food Express',
    businessType: 'vendor',
    address: '123 Street Food Lane, Andheri East, Mumbai - 400069',
    description: 'Serving delicious street food for over 5 years with fresh ingredients and authentic flavors.'
  });

  const handleSave = () => {
    // Here you would typically save to your profile table
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };

  const userRole = user?.user_metadata?.role || 'vendor';

  const stats = userRole === 'vendor' ? [
    { label: "Orders Placed", value: "23", icon: TrendingUp },
    { label: "Total Spent", value: "₹12,450", icon: TrendingUp },
    { label: "Suppliers", value: "8", icon: Building },
    { label: "Member Since", value: "Jan 2024", icon: Shield }
  ] : [
    { label: "Products Listed", value: "24", icon: TrendingUp },
    { label: "Total Revenue", value: "₹45,230", icon: TrendingUp },
    { label: "Orders Completed", value: "89", icon: TrendingUp },
    { label: "Rating", value: "4.8/5", icon: Star }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="gap-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-orange-600" />
                </div>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <Badge variant="outline" className="mt-2 text-orange-600 border-orange-600">
                {userRole === 'vendor' ? 'Vendor' : 'Supplier'}
              </Badge>
              
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{formData.businessName}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <CardHeader>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled={true}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select 
                      value={formData.businessType} 
                      onValueChange={(value) => setFormData({...formData, businessType: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendor">Street Food Vendor</SelectItem>
                        <SelectItem value="supplier">Raw Material Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Describe your business..."
                  />
                </div>

                {userRole === 'supplier' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Delivery Radius (km)</Label>
                      <Input defaultValue="25" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Order Amount</Label>
                      <Input defaultValue="₹500" disabled={!isEditing} />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <stat.icon className="h-8 w-8 text-orange-500" />
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {userRole === 'vendor' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Last order placed</span>
                          <span className="text-sm text-gray-600">2 days ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Profile completion</span>
                          <span className="text-sm text-green-600">85%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Favorite supplier</span>
                          <span className="text-sm text-gray-600">Krishna Traders</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {userRole === 'supplier' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">On-time delivery rate</span>
                          <span className="text-sm text-green-600">98%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Response time</span>
                          <span className="text-sm text-green-600">&lt; 2 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Customer satisfaction</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.8/5</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Profile;