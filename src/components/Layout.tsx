import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Cart } from "@/components/Cart";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-white px-4">
            <SidebarTrigger />
            
            <div className="flex items-center gap-4">
              {(user.user_metadata?.role || 'vendor') === 'vendor' && <Cart />}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{user.user_metadata?.name || user.email}</span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                  {user.user_metadata?.role || 'vendor'}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}