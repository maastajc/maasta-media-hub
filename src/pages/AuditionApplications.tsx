import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApplicationsForCreator } from "@/services/auditionApplicationService";
import { updateApplicationStatus } from "@/services/auditionApplicationService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, Eye, Check, X, Calendar, MapPin, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuditionApplication } from "@/services/auditionApplicationService";

const AuditionApplications = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<AuditionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    // Allow access if user is recruiter or if they have created auditions
    // We'll let the service handle the data fetching
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching applications for user:', user.id);
      const data = await fetchApplicationsForCreator(user.id);
      setApplications(data);
      
      // If no applications found and user is not a recruiter, show helpful message
      if (data.length === 0 && profile?.role !== 'recruiter') {
        console.log('No applications found, user role:', profile?.role);
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to load applications');
      toast({
        title: "Error",
        description: "Failed to load audition applications. " + (error.message || ''),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicationId);
      const success = await updateApplicationStatus(applicationId, newStatus);
      
      if (success) {
        setApplications(prev => 
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
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewProfile = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Error Loading Applications</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchApplications}>Try Again</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Audition Applications</h1>
            <p className="text-gray-500 mt-2">
              Review and manage applications for your auditions
            </p>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">
                  {profile?.role === 'recruiter' 
                    ? "You haven't received any applications for your auditions yet."
                    : "You need to create auditions first to receive applications."
                  }
                </p>
                <Button onClick={() => navigate("/auditions/create")}>
                  Create New Audition
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage 
                            src={application.artist?.profile_picture_url || ""} 
                            alt={application.artist?.full_name || "Artist"}
                          />
                          <AvatarFallback className="text-lg">
                            {application.artist?.full_name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">
                            {application.artist?.full_name || 'Unknown Artist'}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {application.artist?.email}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {application.artist?.category?.replace('_', ' ') || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              Experience: {application.artist?.experience_level || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={`${getStatusColor(application.status)} text-xs px-3 py-1`}>
                        {application.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2">Applied for:</h4>
                      <p className="text-lg font-medium text-maasta-purple mb-1">
                        {application.audition?.title}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {application.audition?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {application.audition.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Applied: {formatDate(application.application_date)}
                        </span>
                      </div>
                    </div>

                    {application.notes && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Application Notes:</h4>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {application.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleViewProfile(application.artist_id)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Full Profile
                      </Button>

                      {application.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            disabled={updatingStatus === application.id}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                          >
                            <Check size={16} />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updatingStatus === application.id}
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            <X size={16} />
                            Reject
                          </Button>
                        </>
                      )}

                      {application.status !== 'pending' && (
                        <Button
                          onClick={() => handleStatusUpdate(application.id, 'pending')}
                          disabled={updatingStatus === application.id}
                          variant="outline"
                        >
                          Reset to Pending
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuditionApplications;
