
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";

interface OptimizedApplicationsTabProps {
  userId: string;
  formatDate: (dateString: string) => string;
}

export const OptimizedApplicationsTab = ({ userId, formatDate }: OptimizedApplicationsTabProps) => {
  const navigate = useNavigate();
  const [auditionApplications, setAuditionApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuditionApplications();
  }, [userId]);

  const fetchAuditionApplications = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching audition applications...');
      const { data, error } = await supabase
        .from("audition_applications")
        .select(`
          id,
          status,
          application_date,
          audition_id,
          notes,
          auditions!inner(
            id,
            title,
            location
          )
        `)
        .eq("artist_id", userId)
        .order('application_date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setAuditionApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching audition applications:", error);
      setAuditionApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (auditionApplications.length === 0) {
    return (
      <EmptyState
        title="You haven't applied to any auditions yet"
        buttonText="Browse Auditions"
        buttonAction={() => navigate("/auditions")}
        buttonClassName="bg-maasta-purple hover:bg-maasta-purple/90"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {auditionApplications.map((application) => (
        <Card key={application.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{application.auditions.title}</h3>
            <div className="mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                application.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {application.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                Applied: {formatDate(application.application_date)}
              </span>
            </div>
            <p className="text-sm">
              <span className="font-medium">Location:</span> {application.auditions.location || "Not specified"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Notes:</span> {application.notes || "No notes"}
            </p>
            <Button 
              onClick={() => navigate(`/auditions/${application.audition_id}`)}
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              View Audition
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
