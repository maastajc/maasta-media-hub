
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AuditionsTabProps {
  isLoading: boolean;
  userAuditions: any[];
  formatDate: (dateString: string) => string;
  onAuditionDeleted?: () => void;
}

export const AuditionsTab = ({ isLoading, userAuditions, formatDate, onAuditionDeleted }: AuditionsTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteAudition = async (auditionId: string) => {
    try {
      setDeletingId(auditionId);
      
      const { error } = await supabase
        .from('auditions')
        .delete()
        .eq('id', auditionId);

      if (error) {
        console.error('Error deleting audition:', error);
        toast({
          title: "Error",
          description: "Failed to delete audition",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Audition deleted successfully",
      });

      // Refresh the auditions list
      if (onAuditionDeleted) {
        onAuditionDeleted();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
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
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userAuditions.length === 0) {
    return (
      <EmptyState
        title="You haven't created any auditions yet"
        buttonText="Post Your First Audition"
        buttonAction={() => navigate("/auditions/create")}
        buttonClassName="bg-maasta-purple hover:bg-maasta-purple/90"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {userAuditions.map((audition) => (
        <Card key={audition.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{audition.title}</h3>
            <div className="flex items-center mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                audition.status === 'open' ? 'bg-green-100 text-green-800' :
                audition.status === 'closed' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {audition.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                Created: {formatDate(audition.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
              {audition.description || "No description available"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Location:</span> {audition.location || "Not specified"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Deadline:</span> {audition.deadline ? formatDate(audition.deadline) : "No deadline"}
            </p>
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={() => navigate(`/auditions/${audition.id}`)}
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                View
              </Button>
              <Button 
                onClick={() => navigate(`/auditions/edit/${audition.id}`)}
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    disabled={deletingId === audition.id}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingId === audition.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Audition</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{audition.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteAudition(audition.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
