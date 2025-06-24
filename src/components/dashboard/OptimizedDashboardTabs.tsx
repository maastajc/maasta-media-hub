
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OptimizedAuditionsTab } from "./OptimizedAuditionsTab";
import { OptimizedApplicationsTab } from "./OptimizedApplicationsTab";
import { ApplicantManagementTab } from "./ApplicantManagementTab";

interface OptimizedDashboardTabsProps {
  userId: string;
  formatDate: (dateString: string) => string;
}

export const OptimizedDashboardTabs = ({ 
  userId, 
  formatDate 
}: OptimizedDashboardTabsProps) => {
  return (
    <Tabs defaultValue="auditions" className="mt-6">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="auditions">My Auditions</TabsTrigger>
        <TabsTrigger value="applications">My Applications</TabsTrigger>
        <TabsTrigger value="applicants">Manage Applicants</TabsTrigger>
      </TabsList>
      
      <TabsContent value="auditions">
        <OptimizedAuditionsTab 
          userId={userId}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="applications">
        <OptimizedApplicationsTab 
          userId={userId}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="applicants">
        <ApplicantManagementTab 
          userId={userId}
          formatDate={formatDate}
        />
      </TabsContent>
    </Tabs>
  );
};
