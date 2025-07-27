import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Store,
  ShoppingCart,
  Users,
  Package,
  Star,
  Settings,
  BarChart3,
  Truck,
  Plus
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  // Get user role from profile or metadata
  const userRole = user?.user_metadata?.role || 'vendor';

  const vendorItems = [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "Browse Suppliers", url: "/suppliers", icon: Store },
    { title: "My Orders", url: "/orders", icon: ShoppingCart },
    { title: "Group Orders", url: "/group-orders", icon: Users },
    { title: "Reviews", url: "/reviews", icon: Star },
    { title: "Profile", url: "/profile", icon: Settings },
  ];

  const supplierItems = [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "My Products", url: "/products", icon: Package },
    { title: "Orders", url: "/orders", icon: ShoppingCart },
    { title: "Add Product", url: "/add-product", icon: Plus },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Profile", url: "/profile", icon: Settings },
  ];

  const items = userRole === 'supplier' ? supplierItems : vendorItems;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-orange-100 text-orange-600 font-medium" : "hover:bg-gray-100";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-orange-600 ${state === "collapsed" ? "text-xs" : "text-lg"}`}>
            {state === "collapsed" ? "SS" : "StreetSupply"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            {userRole === 'supplier' ? 'Supplier Tools' : 'Vendor Tools'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}