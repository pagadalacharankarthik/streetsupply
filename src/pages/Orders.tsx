import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Phone,
  MessageSquare,
  Eye
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Orders = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const userRole = user.user_metadata?.role || 'vendor';
      
      let query;
      if (userRole === 'supplier') {
        // For suppliers, get orders for their products
        const { data: supplierData } = await supabase
          .from('suppliers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (supplierData) {
          query = supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, unit, price_per_unit)
              )
            `)
            .eq('supplier_id', supplierData.id);
        }
      } else {
        // For vendors, get their orders
        query = supabase
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

      if (query) {
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.suppliers?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_items?.some((item: any) => 
      item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const OrderCard = ({ order }: { order: any }) => {
    const userRole = user?.user_metadata?.role || 'vendor';
    const displayStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ');
    
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{order.order_number}</h3>
              <p className="text-gray-600">
                {userRole === 'supplier' ? 'Customer Order' : order.suppliers?.business_name || 'Unknown Supplier'}
              </p>
            </div>
            <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {displayStatus}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            {order.order_items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <span className="font-medium">{item.products?.name || 'Unknown Product'}</span>
                  <span className="text-gray-600 ml-2">({item.quantity} {item.products?.unit || 'units'})</span>
                </div>
                <span className="font-medium">₹{parseFloat(item.total_price).toLocaleString()}</span>
              </div>
            )) || (
              <div className="text-gray-600">No items found</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Order Date:</span>
              <div className="font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            {order.delivery_date && (
              <div>
                <span className="text-gray-600">Delivery Date:</span>
                <div className="font-medium">{new Date(order.delivery_date).toLocaleDateString()}</div>
              </div>
            )}
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <div className="font-medium text-lg">₹{parseFloat(order.total_amount).toLocaleString()}</div>
            </div>
            {order.tracking_id && (
              <div>
                <span className="text-gray-600">Tracking ID:</span>
                <div className="font-medium">{order.tracking_id}</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {order.status !== 'cancelled' && (
              <>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </>
            )}
            {order.status === 'delivered' && !order.rating && (
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Rate Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>
        <Button>
          Place New Order
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders, suppliers, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({filteredOrders.filter(o => ['Processing', 'In Transit'].includes(o.status)).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredOrders.filter(o => o.status === 'Delivered').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
                </p>
                <Button>Browse Suppliers</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredOrders.filter(o => ['processing', 'in_transit'].includes(o.status)).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredOrders.filter(o => o.status === 'delivered').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <p className="text-xs text-gray-600">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;