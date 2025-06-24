
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { ApplicantDetailsDialog } from "./ApplicantDetailsDialog";
import { ExportApplicantsDialog } from "./ExportApplicantsDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Users, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicantManagementTabProps {
  userId: string;
  formatDate: (dateString: string) => string;
}

export const ApplicantManagementTab = ({ userId, formatDate }: ApplicantManagementTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userAuditions, setUserAuditions] = useState<any[]>([]);
  const [selectedAudition, setSelectedAudition] = useState<string>("");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchUserAuditions();
  }, [userId]);

  useEffect(() => {
    if (selectedAudition) {
      fetchApplicants(selectedAudition);
    }
  }, [selectedAudition, statusFilter]);

  const fetchUserAuditions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("auditions")
        .select("id, title, status, created_at")
        .eq("creator_id", userId)
        .eq("status", "open")
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUserAuditions(data || []);
      
      // Auto-select first audition if available
      if (data && data.length > 0) {
        setSelectedAudition(data[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching user auditions:", error);
      setUserAuditions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicants = async (auditionId: string) => {
    try {
      setIsLoadingApplicants(true);
      let query = supabase
        .from("audition_applications")
        .select(`
          id,
          status,
          application_date,
          notes,
          artist_id,
          profiles!inner(
            id,
            full_name,
            email,
            profile_picture_url,
            category,
            experience_level,
            phone_number
          )
        `)
        .eq("audition_id", auditionId)
        .order('application_date', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setApplicants(data || []);
    } catch (error: any) {
      console.error("Error fetching applicants:", error);
      setApplicants([]);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("audition_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      // Update local state
      setApplicants(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (userAuditions.length === 0) {
    return (
      <EmptyState
        title="No auditions found"
        buttonText="Create Your First Audition"
        buttonAction={() => navigate("/auditions/create")}
        buttonClassName="bg-maasta-purple hover:bg-maasta-purple/90"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Audition Selection and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Manage Applicants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Audition:</label>
              <Select value={selectedAudition} onValueChange={setSelectedAudition}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an audition..." />
                </SelectTrigger>
                <SelectContent>
                  {userAuditions.map((audition) => (
                    <SelectItem key={audition.id} value={audition.id}>
                      {audition.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Filter by Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setShowExportDialog(true)}
                variant="outline"
                className="flex items-center gap-2"
                disabled={applicants.length === 0}
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants List */}
      {selectedAudition && (
        <Card>
          <CardHeader>
            <CardTitle>
              Applicants ({applicants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingApplicants ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : applicants.length === 0 ? (
              <EmptyState
                title="No applicants found"
                buttonText="Share Audition"
                buttonAction={() => navigate(`/auditions/${selectedAudition}`)}
              />
            ) : (
              <div className="space-y-4">
                {applicants.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src={application.profiles?.profile_picture_url || ""} 
                            alt={application.profiles?.full_name || "Applicant"}
                          />
                          <AvatarFallback>
                            {application.profiles?.full_name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {application.profiles?.full_name || 'Unknown Applicant'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {application.profiles?.email}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{application.profiles?.category}</span>
                            <span>•</span>
                            <span>{application.profiles?.experience_level}</span>
                            <span>•</span>
                            <span>Applied: {formatDate(application.application_date)}</span>
                          </div>
                          {application.notes && (
                            <p className="text-sm text-gray-700 mt-2 p-2 bg-blue-50 rounded">
                              {application.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.toUpperCase()}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedApplicant(application)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View
                          </Button>
                          
                          <Select
                            value={application.status}
                            onValueChange={(value) => updateApplicationStatus(application.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applicant Details Dialog */}
      {selectedApplicant && (
        <ApplicantDetailsDialog
          applicant={selectedApplicant}
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          formatDate={formatDate}
        />
      )}

      {/* Export Dialog */}
      <ExportApplicantsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        applicants={applicants}
        auditionTitle={userAuditions.find(a => a.id === selectedAudition)?.title || ""}
      />
    </div>
  );
};
