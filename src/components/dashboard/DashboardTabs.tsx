
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuditionsTab } from "./AuditionsTab";
import { ApplicationsTab } from "./ApplicationsTab";

interface DashboardTabsProps {
  isLoading: boolean;
  userAuditions: any[];
  auditionApplications: any[];
  formatDate: (dateString: string) => string;
}

export const DashboardTabs = ({ 
  isLoading, 
  userAuditions, 
  auditionApplications, 
  formatDate 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="auditions" className="mt-6">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="auditions">My Auditions</TabsTrigger>
        <TabsTrigger value="applications">Audition Applications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="auditions">
        <AuditionsTab 
          isLoading={isLoading}
          userAuditions={userAuditions}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab 
          isLoading={isLoading}
          auditionApplications={auditionApplications}
          formatDate={formatDate}
        />
      </TabsContent>
    </Tabs>
  );
};
