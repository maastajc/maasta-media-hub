import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import { BottomNavigation } from "./BottomNavigation";

interface ProfileLayoutProps {
  children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Only show sidebar on mobile for profile pages */}
        <div className="md:hidden">
          <ProfileSidebar />
        </div>
        
        <main className="flex-1 p-4">
          {/* Sidebar trigger for mobile */}
          <div className="md:hidden mb-4">
            <SidebarTrigger />
          </div>
          
          {children}
        </main>
      </div>
      
      {/* Bottom navigation still available */}
      <BottomNavigation />
    </SidebarProvider>
  );
}