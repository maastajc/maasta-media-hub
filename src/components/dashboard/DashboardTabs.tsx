
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EventsTab } from "./EventsTab";
import { AuditionsTab } from "./AuditionsTab";
import { RegisteredEventsTab } from "./RegisteredEventsTab";
import { ApplicationsTab } from "./ApplicationsTab";

interface DashboardTabsProps {
  isLoading: boolean;
  userEvents: any[];
  userAuditions: any[];
  registeredEvents: any[];
  auditionApplications: any[];
  formatDate: (dateString: string) => string;
}

export const DashboardTabs = ({ 
  isLoading, 
  userEvents, 
  userAuditions, 
  registeredEvents, 
  auditionApplications, 
  formatDate 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="events" className="mt-6">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="events">My Events</TabsTrigger>
        <TabsTrigger value="auditions">My Auditions</TabsTrigger>
        <TabsTrigger value="registered">Registered Events</TabsTrigger>
        <TabsTrigger value="applications">Audition Applications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="events">
        <EventsTab 
          isLoading={isLoading}
          userEvents={userEvents}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="auditions">
        <AuditionsTab 
          isLoading={isLoading}
          userAuditions={userAuditions}
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="registered">
        <RegisteredEventsTab 
          isLoading={isLoading}
          registeredEvents={registeredEvents}
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
