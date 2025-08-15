
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, ClipboardList, FileText, Calendar } from "lucide-react";

interface DashboardStatsProps {
  isLoading: boolean;
  userAuditions: any[];
  auditionApplications: any[];
  userEvents: any[];
  userRole?: string;
}

export const DashboardStats = ({ 
  isLoading, 
  userAuditions, 
  auditionApplications, 
  userEvents,
  userRole 
}: DashboardStatsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-1">My Auditions</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mb-4" />
          ) : (
            <p className="text-3xl font-bold mb-4">{userAuditions.length}</p>
          )}
          <Button 
            onClick={() => navigate("/auditions/create")} 
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Post Audition
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-medium text-lg mb-1">My Events</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mb-4" />
          ) : (
            <p className="text-3xl font-bold mb-4">{userEvents.length}</p>
          )}
          <Button 
            onClick={() => navigate("/events/create")} 
            className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-medium text-lg mb-1">Applications</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mb-4" />
          ) : (
            <p className="text-3xl font-bold mb-4">{auditionApplications.length}</p>
          )}
          {userRole === 'recruiter' ? (
            <Button 
              onClick={() => navigate("/auditions/applications")} 
              variant="outline"
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Applications
            </Button>
          ) : (
            <Button 
              onClick={() => navigate("/auditions")} 
              variant="outline"
              className="w-full"
            >
              Browse Auditions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
