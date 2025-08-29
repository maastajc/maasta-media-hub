
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuditionsTab } from "./AuditionsTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { ReviewTab } from "./ReviewTab";
import { EventsTab } from "./EventsTab";
import { OrganizationsTab } from "../organizations/OrganizationsTab";
import { BookingsTab } from "./BookingsTab";

interface DashboardTabsProps {
  isLoading: boolean;
  userAuditions: any[];
  auditionApplications: any[];
  userEvents: any[];
  formatDate: (dateString: string) => string;
}

export const DashboardTabs = ({ 
  isLoading, 
  userAuditions, 
  auditionApplications, 
  userEvents,
  formatDate 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="auditions" className="mt-6">
      <TabsList className="grid grid-cols-6 mb-6">
        <TabsTrigger value="auditions">My Auditions</TabsTrigger>
        <TabsTrigger value="events">My Events</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="organizations">Organizations</TabsTrigger>
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
      
      <TabsContent value="events">
        <EventsTab 
          isLoading={isLoading}
          userEvents={userEvents}
          formatDate={formatDate}
          onEventDeleted={() => window.location.reload()}
        />
      </TabsContent>

      <TabsContent value="bookings">
        <BookingsTab />
      </TabsContent>

      <TabsContent value="organizations">
        <OrganizationsTab />
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
