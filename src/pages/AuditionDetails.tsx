
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase, 
  AlertCircle,
  ArrowLeft,
  UserCheck
} from "lucide-react";
import { format, isAfter } from "date-fns";
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
    queryKey: ['audition-details', auditionNumber],
    queryFn: async () => {
      if (!auditionNumber) {
        throw new Error('Audition number is required');
      }

      console.log('Fetching audition details for number:', auditionNumber);

      const { data, error } = await supabase
        .from('auditions')
        .select(`
          *,
          profiles!auditions_creator_id_fkey (
            id,
            full_name,
            profile_picture_url,
            email
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
    enabled: !!auditionNumber,
    staleTime: 5 * 60 * 1000
  });

  // Check if user already applied
  const { data: existingApplication } = useQuery({
    queryKey: ['user-application', audition?.id, user?.id],
    queryFn: async () => {
      if (!audition?.id || !user?.id) return null;

      const { data, error } = await supabase
        .from('audition_applications')
        .select('*')
        .eq('audition_id', audition.id)
        .eq('artist_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking application:', error);
        return null;
      }

      return data;
    },
    enabled: !!audition?.id && !!user?.id
  });

  const handleApplySuccess = () => {
    setShowApplicationDialog(false);
    refetch();
    toast.success("Your application has been submitted successfully!");
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
                ? `We couldn't find audition #${auditionNumber}. The audition may have been removed or the link might be incorrect.`
                : "We're having trouble loading this audition. Please try again."
              }
            </p>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => navigate("/auditions")} variant="outline">
                Browse All Auditions
              </Button>
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

  const isDeadlinePassed = audition.deadline ? isAfter(new Date(), new Date(audition.deadline)) : false;
  const hasApplied = !!existingApplication;
  const canApply = user && !hasApplied && !isDeadlinePassed;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          {/* Audition Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{audition.title}</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Audition #{auditionNumber}
                    </Badge>
                  </div>
                  
                  {audition.category && (
                    <Badge variant="outline" className="mb-4">
                      {audition.category.charAt(0).toUpperCase() + audition.category.slice(1)}
                    </Badge>
                  )}

                  {audition.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {audition.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {canApply && (
                    <Button 
                      onClick={() => setShowApplicationDialog(true)}
                      className="bg-maasta-orange hover:bg-maasta-orange/90 text-white"
                    >
                      Apply Now
                    </Button>
                  )}
                  
                  {hasApplied && (
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <UserCheck size={16} />
                      Applied
                    </Button>
                  )}
                  
                  {isDeadlinePassed && (
                    <Button variant="outline" disabled>
                      Deadline Passed
                    </Button>
                  )}
                  
                  {!user && (
                    <Button onClick={() => navigate('/signin')}>
                      Sign In to Apply
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Project Details */}
              {audition.project_details && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {audition.project_details}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {audition.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {audition.requirements}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Posted by */}
              {audition.profiles && (
                <Card>
                  <CardHeader>
                    <CardTitle>Posted by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-maasta-orange rounded-full flex items-center justify-center text-white font-bold">
                        {audition.profiles.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{audition.profiles.full_name}</p>
                        <p className="text-sm text-gray-500">{audition.profiles.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Audition Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audition.audition_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="text-maasta-orange" size={20} />
                      <div>
                        <p className="font-medium">Audition Date</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(audition.audition_date), 'PPP')}
                        </p>
                      </div>
                    </div>
                  )}

                  {audition.deadline && (
                    <div className="flex items-center gap-3">
                      <Clock className="text-maasta-orange" size={20} />
                      <div>
                        <p className="font-medium">Application Deadline</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(audition.deadline), 'PPP')}
                        </p>
                      </div>
                    </div>
                  )}

                  {audition.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="text-maasta-orange" size={20} />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-gray-600">{audition.location}</p>
                      </div>
                    </div>
                  )}

                  {audition.compensation && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-maasta-orange" size={20} />
                      <div>
                        <p className="font-medium">Compensation</p>
                        <p className="text-sm text-gray-600">{audition.compensation}</p>
                      </div>
                    </div>
                  )}

                  {audition.experience_level && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-maasta-orange" size={20} />
                      <div>
                        <p className="font-medium">Experience Level</p>
                        <p className="text-sm text-gray-600">
                          {audition.experience_level.charAt(0).toUpperCase() + audition.experience_level.slice(1)}
                        </p>
                      </div>
                    </div>
                  )}

                  {(audition.gender || audition.age_range) && (
                    <div className="flex items-center gap-3">
                      <Users className="text-maasta-orange" size={20} />
                      <div>
                        <p className="font-medium">Looking for</p>
                        <p className="text-sm text-gray-600">
                          {[audition.gender, audition.age_range].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              {audition.tags && audition.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {audition.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
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
          auditionId={audition.id}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default AuditionDetails;
