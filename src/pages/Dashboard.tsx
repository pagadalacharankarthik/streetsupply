import { useAuth } from '@/hooks/useAuth';
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.user_metadata?.role || 'vendor';
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const vendorStats = [
    { title: "Active Orders", value: "3", icon: ShoppingCart, color: "text-blue-600" },
    { title: "Total Spent", value: "₹12,450", icon: TrendingUp, color: "text-green-600" },
    { title: "Suppliers", value: "8", icon: Store, color: "text-orange-600" },
    { title: "Group Orders", value: "2", icon: Users, color: "text-purple-600" }
  ];

  const supplierStats = [
    { title: "Active Products", value: "24", icon: Package, color: "text-blue-600" },
    { title: "Total Revenue", value: "₹45,230", icon: TrendingUp, color: "text-green-600" },
    { title: "Orders Today", value: "12", icon: ShoppingCart, color: "text-orange-600" },
    { title: "Rating", value: "4.8", icon: Star, color: "text-yellow-600" }
  ];

  const stats = userRole === 'supplier' ? supplierStats : vendorStats;

  const recentOrders = [
    { id: "ORD-001", item: "Basmati Rice (25kg)", supplier: "Krishna Traders", status: "Delivered", amount: "₹1,250" },
    { id: "ORD-002", item: "Cooking Oil (5L)", supplier: "Sharma Suppliers", status: "In Transit", amount: "₹450" },
    { id: "ORD-003", item: "Onions (10kg)", supplier: "Fresh Produce Co.", status: "Processing", amount: "₹300" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = userRole === 'supplier' ? [
    { title: "Add Product", icon: Plus, action: () => navigate('/add-product') },
    { title: "View Orders", icon: ShoppingCart, action: () => navigate('/orders') },
    { title: "Analytics", icon: TrendingUp, action: () => navigate('/analytics') }
  ] : [
    { title: "Browse Suppliers", icon: Store, action: () => navigate('/suppliers') },
    { title: "Join Group Order", icon: Users, action: () => navigate('/group-orders') },
    { title: "Place Order", icon: Plus, action: () => navigate('/suppliers') }
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