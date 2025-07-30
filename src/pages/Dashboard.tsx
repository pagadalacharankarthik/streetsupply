import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Package, 
  Clock, 
  Star,
  ArrowRight,
  Plus,
  Store
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [supplierData, setSupplierData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userRole = user?.user_metadata?.role || 'vendor';
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      if (userRole === 'supplier') {
        // Fetch supplier data
        const { data: supplier, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!supplierError) {
          setSupplierData(supplier);
        }
      }

      // Fetch orders (different based on role)
      let ordersQuery;
      if (userRole === 'supplier' && supplierData?.id) {
        ordersQuery = supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (name, unit, price_per_unit)
            ),
            profiles!orders_vendor_id_fkey (name, email)
          `)
          .eq('supplier_id', supplierData.id);
      } else {
        ordersQuery = supabase
          .from('orders')
          .select(`
            *,
            suppliers (business_name),
            order_items (
              *,
              products (name, unit, price_per_unit)
            )
          `)
          .eq('vendor_id', user.id);
      }

      const { data: ordersData, error: ordersError } = await ordersQuery;

      if (!ordersError) {
        setOrders(ordersData || []);
      }
    } catch (error: any) {
      toast.error('Error loading dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(o => ['pending', 'processing', 'in_transit'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const totalRevenue = userRole === 'supplier' ? totalSpent : 0;

  const vendorStats = [
    { title: "Active Orders", value: activeOrders.length.toString(), icon: ShoppingCart, color: "text-blue-600" },
    { title: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
    { title: "Total Orders", value: orders.length.toString(), icon: Store, color: "text-orange-600" },
    { title: "Completed", value: completedOrders.length.toString(), icon: Users, color: "text-purple-600" }
  ];

  const supplierStats = [
    { title: "Total Orders", value: orders.length.toString(), icon: Package, color: "text-blue-600" },
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
    { title: "Active Orders", value: activeOrders.length.toString(), icon: ShoppingCart, color: "text-orange-600" },
    { title: "Rating", value: supplierData?.rating?.toFixed(1) || "0.0", icon: Star, color: "text-yellow-600" }
  ];

  const stats = userRole === 'supplier' ? supplierStats : vendorStats;

  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.order_number,
    item: order.order_items?.[0]?.products?.name || 'Multiple items',
    supplier: userRole === 'supplier' ? 'Your order' : order.suppliers?.business_name || 'Unknown',
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' '),
    amount: `₹${parseFloat(order.total_amount).toLocaleString()}`
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = userRole === 'supplier' ? [
    { 
      title: supplierData ? "Add Product" : "Setup Supplier Profile", 
      icon: Plus, 
      action: () => navigate(supplierData ? '/add-product' : '/supplier-setup') 
    },
    { title: "View Orders", icon: ShoppingCart, action: () => navigate('/orders') },
    { title: "Manage Products", icon: Package, action: () => navigate('/products') }
  ] : [
    { title: "Browse Suppliers", icon: Store, action: () => navigate('/suppliers') },
    { title: "My Orders", icon: ShoppingCart, action: () => navigate('/orders') },
    { title: "Find Products", icon: Plus, action: () => navigate('/suppliers') }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'supplier' 
              ? "Manage your products and track your business performance" 
              : "Find suppliers and manage your orders efficiently"
            }
          </p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          {userRole === 'supplier' ? 'Supplier' : 'Vendor'}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={action.action}
              >
                <action.icon className="h-6 w-6" />
                <span>{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{order.item}</p>
                      <p className="text-sm text-gray-600">{order.supplier}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders yet</p>
                <Button className="mt-4" onClick={() => navigate('/suppliers')}>
                  {userRole === 'supplier' ? 'Wait for orders' : 'Browse Suppliers'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>
              {userRole === 'supplier' ? 'Business Insights' : 'Savings This Month'}
            </CardTitle>
            <CardDescription>
              {userRole === 'supplier' 
                ? 'Your performance metrics' 
                : 'How much you\'ve saved with group orders'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {userRole === 'supplier' ? 'Orders Completed' : 'Individual Orders'}
                </span>
                <span className="font-medium">
                  {userRole === 'supplier' ? '89' : '₹8,200'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {userRole === 'supplier' ? 'Average Rating' : 'Group Orders'}
                </span>
                <span className="font-medium">
                  {userRole === 'supplier' ? '4.8/5' : '₹4,250'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {userRole === 'supplier' ? 'Response Time' : 'Total Savings'}
                </span>
                <span className="font-medium text-green-600">
                  {userRole === 'supplier' ? '< 2 hours' : '₹3,950'}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {userRole === 'supplier' ? '+12% from last month' : '32% savings rate'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Order #ORD-001 delivered successfully</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New group order available for Rice (25kg)</p>
                <p className="text-xs text-gray-600">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Price alert: Cooking oil prices dropped by 5%</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;