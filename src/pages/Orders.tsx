import { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    {
      id: "ORD-001",
      items: [
        { name: "Basmati Rice", quantity: "25kg", price: "₹1,250" }
      ],
      supplier: "Krishna Traders",
      status: "Delivered",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-16",
      total: "₹1,250",
      tracking: "DEL123456789",
      rating: 5
    },
    {
      id: "ORD-002",
      items: [
        { name: "Cooking Oil", quantity: "5L", price: "₹450" },
        { name: "Mustard Oil", quantity: "2L", price: "₹200" }
      ],
      supplier: "Sharma Suppliers",
      status: "In Transit",
      orderDate: "2024-01-18",
      deliveryDate: "2024-01-19",
      total: "₹650",
      tracking: "TRN987654321",
      rating: null
    },
    {
      id: "ORD-003",
      items: [
        { name: "Red Onions", quantity: "10kg", price: "₹300" }
      ],
      supplier: "Fresh Produce Co.",
      status: "Processing",
      orderDate: "2024-01-20",
      deliveryDate: "2024-01-21",
      total: "₹300",
      tracking: "PROC456789123",
      rating: null
    },
    {
      id: "ORD-004",
      items: [
        { name: "Turmeric Powder", quantity: "1kg", price: "₹180" },
        { name: "Red Chilli Powder", quantity: "1kg", price: "₹120" }
      ],
      supplier: "Spice Masters",
      status: "Cancelled",
      orderDate: "2024-01-12",
      deliveryDate: null,
      total: "₹300",
      tracking: null,
      rating: null
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'In Transit': return <Truck className="h-4 w-4" />;
      case 'Processing': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{order.id}</h3>
            <p className="text-gray-600">{order.supplier}</p>
          </div>
          <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600 ml-2">({item.quantity})</span>
              </div>
              <span className="font-medium">{item.price}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-600">Order Date:</span>
            <div className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</div>
          </div>
          {order.deliveryDate && (
            <div>
              <span className="text-gray-600">Delivery Date:</span>
              <div className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</div>
            </div>
          )}
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <div className="font-medium text-lg">{order.total}</div>
          </div>
          {order.tracking && (
            <div>
              <span className="text-gray-600">Tracking ID:</span>
              <div className="font-medium">{order.tracking}</div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {order.status !== 'Cancelled' && (
            <>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Supplier
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </>
          )}
          {order.status === 'Delivered' && !order.rating && (
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              Rate Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
          {filteredOrders.length > 0 ? (
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
          {filteredOrders.filter(o => ['Processing', 'In Transit'].includes(o.status)).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredOrders.filter(o => o.status === 'Delivered').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,200</div>
            <p className="text-xs text-gray-600">Total spent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹320</div>
            <p className="text-xs text-gray-600">From group orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;