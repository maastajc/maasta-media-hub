
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Users, ClipboardList, FileText } from "lucide-react";

interface DashboardStatsProps {
  isLoading: boolean;
  userEvents: any[];
  userAuditions: any[];
  registeredEvents: any[];
  auditionApplications: any[];
  userRole?: string;
}

export const DashboardStats = ({ 
  isLoading, 
  userEvents, 
  userAuditions, 
  registeredEvents, 
  auditionApplications,
  userRole 
}: DashboardStatsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-maasta-orange/10 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-maasta-orange" />
          </div>
          <h3 className="font-medium text-lg mb-1">My Events</h3>
          <p className="text-3xl font-bold">{isLoading ? "-" : userEvents.length}</p>
          <Button 
            onClick={() => navigate("/events/create")} 
            className="mt-4 bg-maasta-orange hover:bg-maasta-orange/90 w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-maasta-purple/10 flex items-center justify-center mb-4">
            <ClipboardList className="h-6 w-6 text-maasta-purple" />
          </div>
          <h3 className="font-medium text-lg mb-1">My Auditions</h3>
          <p className="text-3xl font-bold">{isLoading ? "-" : userAuditions.length}</p>
          <Button 
            onClick={() => navigate("/auditions/create")} 
            className="mt-4 bg-maasta-purple hover:bg-maasta-purple/90 w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Post Audition
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Participations</h3>
          <p className="text-3xl font-bold">
            {isLoading ? "-" : registeredEvents.length + auditionApplications.length}
          </p>
          {userRole === 'recruiter' ? (
            <Button 
              onClick={() => navigate("/auditions/applications")} 
              variant="outline"
              className="mt-4 border-green-600 text-green-600 hover:bg-green-50 w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Applications
            </Button>
          ) : (
            <Button 
              onClick={() => navigate("/artists")} 
              variant="outline"
              className="mt-4 border-green-600 text-green-600 hover:bg-green-50 w-full"
            >
              View Artists
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
