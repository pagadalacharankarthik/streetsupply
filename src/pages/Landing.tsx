import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Truck, Users, ShoppingCart, Star, TrendingUp, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Store,
      title: "For Vendors",
      description: "Find trusted suppliers, compare prices, and place orders easily"
    },
    {
      icon: Truck,
      title: "For Suppliers", 
      description: "Reach more customers, manage inventory, and grow your business"
    },
    {
      icon: Users,
      title: "Group Orders",
      description: "Join with nearby vendors for better bulk pricing"
    },
    {
      icon: Star,
      title: "Trust Ratings",
      description: "AI-powered supplier ratings based on delivery and quality"
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Active Vendors" },
    { icon: Store, value: "150+", label: "Verified Suppliers" },
    { icon: ShoppingCart, value: "1,200+", label: "Orders Completed" },
    { icon: TrendingUp, value: "98%", label: "Satisfaction Rate" }
  ];

  const benefits = [
    "AI-powered supplier recommendations",
    "Group ordering for better prices", 
    "Real-time price tracking",
    "Trust-based rating system",
    "WhatsApp integration for updates",
    "Multi-language support"
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">StreetSupply</h1>
              <span className="ml-2 text-sm text-gray-500">Connecting India's Street Food Vendors</span>
            </div>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powering India's
            <span className="text-orange-600"> Street Food </span>
            Economy
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with trusted suppliers, get AI-powered recommendations, and join group orders 
            to get the best prices for raw materials. Built for vendors, by vendors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              Start Selling
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              Become a Supplier
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              From discovery to delivery, we've got you covered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose StreetSupply?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We understand the unique challenges of street food vendors in India. 
                Our platform is designed specifically for your needs.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">₹2,000</div>
                <div className="text-sm text-gray-600">Average monthly savings per vendor</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">24hrs</div>
                <div className="text-sm text-gray-600">Average delivery time</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.8/5</div>
                <div className="text-sm text-gray-600">Average supplier rating</div>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Cities covered</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of vendors and suppliers already using StreetSupply
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">StreetSupply</h3>
              <p className="text-gray-400">
                Empowering India's street food vendors with trusted supplier connections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <div className="space-y-2 text-gray-400">
                <div>Find Suppliers</div>
                <div>Group Orders</div>
                <div>Price Tracking</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <div className="space-y-2 text-gray-400">
                <div>List Products</div>
                <div>Manage Orders</div>
                <div>Analytics</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>WhatsApp Support</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StreetSupply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;