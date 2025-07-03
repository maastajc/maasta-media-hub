
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import AuditionApplicationDialog from "@/components/auditions/AuditionApplicationDialog";

const AuditionDetails = () => {
  const { auditionNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  // Fetch audition by audition_number
  const { 
    data: audition, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['audition-by-number', auditionNumber],
    queryFn: async () => {
      if (!auditionNumber) {
        throw new Error('Audition number is required');
      }

      console.log('Fetching audition for number:', auditionNumber);

      const { data, error } = await supabase
        .from('auditions')
        .select(`
          *,
          profiles:creator_id (
            id,
            full_name,
            profile_picture_url,
            verified
          )
        `)
        .eq('audition_number', parseInt(auditionNumber))
        .eq('status', 'open')
        .single();

      if (error) {
        console.error('Database error fetching audition:', error);
        throw new Error(`Audition not found: ${error.message}`);
      }

      if (!data) {
        throw new Error('Audition not found');
      }

      console.log('Successfully fetched audition:', data.title);
      return data;
    },
    enabled: !!auditionNumber
  });

  // Check if user has already applied
  const { data: hasApplied } = useQuery({
    queryKey: ['application-status', audition?.id, user?.id],
    queryFn: async () => {
      if (!audition?.id || !user?.id) return false;

      const { data, error } = await supabase
        .from('audition_applications')
        .select('id')
        .eq('audition_id', audition.id)
        .eq('artist_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking application status:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!audition?.id && !!user?.id
  });

  const handleApplySuccess = () => {
    setShowApplicationDialog(false);
    toast.success("Application submitted successfully!");
    // Refetch to update application status
    refetch();
  };

  // Handle missing audition number
  if (!auditionNumber) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Invalid Audition URL</h2>
            <p className="text-gray-600 mb-4">No audition number was provided in the URL.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/auditions")}>
                Browse Auditions
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                Go Home
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading audition details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError || !audition) {
    const isNotFound = !audition || error?.message?.includes('not found');
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-lg">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">
              {isNotFound ? "Audition Not Found" : "Error Loading Audition"}
            </h2>
            <p className="text-gray-600 mb-4">
              {isNotFound 
                ? `We couldn't find audition #${auditionNumber}. It may have been removed or the link might be incorrect.`
                : "We're having trouble loading this audition. Please try again."
              }
            </p>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => navigate("/auditions")} variant="outline">
                Browse All Auditions
              </Button>
              {!isNotFound && (
                <Button onClick={() => refetch()} className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Try Again
                </Button>
              )}
              <Button onClick={() => navigate("/")} variant="secondary">
                Go Home
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === audition.creator_id;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auditions")}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Auditions
          </Button>

          {/* Audition Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">#{audition.audition_number}</Badge>
                    <Badge variant="outline">{audition.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-3">{audition.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {audition.location}
                    </div>
                    {audition.audition_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(audition.audition_date), "MMM dd, yyyy")}
                      </div>
                    )}
                    {audition.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Apply by {format(new Date(audition.deadline), "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!isOwner && user && (
                    <Button
                      onClick={() => setShowApplicationDialog(true)}
                      disabled={hasApplied}
                      className="bg-maasta-orange hover:bg-maasta-orange/90"
                    >
                      {hasApplied ? "Already Applied" : "Apply Now"}
                    </Button>
                  )}
                  {isOwner && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/edit-audition/${audition.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/auditions/${audition.audition_number}/applications`)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Applications
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Audition Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {audition.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{audition.description}</p>
                  </CardContent>
                </Card>
              )}

              {audition.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{audition.requirements}</p>
                  </CardContent>
                </Card>
              )}

              {audition.project_details && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{audition.project_details}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audition.experience_level && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Experience Level</h4>
                      <p className="capitalize">{audition.experience_level.replace('_', ' ')}</p>
                    </div>
                  )}
                  
                  {audition.age_range && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Age Range</h4>
                      <p>{audition.age_range}</p>
                    </div>
                  )}
                  
                  {audition.gender && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Gender</h4>
                      <p className="capitalize">{audition.gender}</p>
                    </div>
                  )}
                  
                  {audition.compensation && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Compensation</h4>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <p>{audition.compensation}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Posted By */}
              {audition.profiles && (
                <Card>
                  <CardHeader>
                    <CardTitle>Posted By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {audition.profiles.profile_picture_url ? (
                          <img 
                            src={audition.profiles.profile_picture_url} 
                            alt={audition.profiles.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {audition.profiles.full_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-1">
                          {audition.profiles.full_name}
                          {audition.profiles.verified && (
                            <span className="text-blue-500">✓</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">Casting Director</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {audition.tags && audition.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {audition.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Application Dialog */}
      {user && audition && (
        <AuditionApplicationDialog
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
          audition={audition}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default AuditionDetails;
