
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuditionsTab } from "./AuditionsTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { ReviewTab } from "./ReviewTab";

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
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="auditions">My Auditions</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
      </TabsList>
      
      <TabsContent value="auditions">
            <AuditionsTab 
              isLoading={isLoading}
              userAuditions={userAuditions}
              formatDate={formatDate}
              onAuditionDeleted={() => window.location.reload()}
            />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab 
          isLoading={isLoading}
          auditionApplications={auditionApplications}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="review">
        <ReviewTab 
          isLoading={isLoading}
          userAuditions={userAuditions}
          formatDate={formatDate}
        />
      </TabsContent>
    </Tabs>
  );
};
