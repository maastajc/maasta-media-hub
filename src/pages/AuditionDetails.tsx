
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, ArrowLeft, Calendar, MapPin, Clock, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import AuditionApplicationDialog from "@/components/auditions/AuditionApplicationDialog";
import { useState } from "react";

const AuditionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  const { data: audition, isLoading, isError, error } = useQuery({
    queryKey: ['audition-details', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Audition ID is required');
      }

      // Validate UUID format to prevent invalid queries
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid audition ID format');
      }

      console.log('Fetching audition details for ID:', id);

      const { data, error } = await supabase
        .from('auditions')
        .select(`
          *,
          profiles:creator_id (
            id,
            full_name,
            profile_picture_url,
            email
          )
        `)
        .eq('id', id)
        .eq('status', 'open')
        .single();

      if (error) {
        console.error('Database error fetching audition:', error);
        throw new Error(`Failed to fetch audition: ${error.message}`);
      }

      if (!data) {
        throw new Error('Audition not found');
      }

      return data;
    },
    enabled: !!id,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a validation error or not found
      if (error?.message?.includes('Invalid') || error?.message?.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    }
  });

  if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Invalid Audition URL</h2>
            <p className="text-gray-600 mb-4">The audition link appears to be invalid or malformed.</p>
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

  if (isError || !audition) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Audition Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error?.message || "This audition may have been closed or removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/auditions")}>
                Browse Other Auditions
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

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{audition.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {audition.category && (
                          <Badge variant="secondary">
                            {formatCategory(audition.category)}
                          </Badge>
                        )}
                        {audition.experience_level && (
                          <Badge variant="outline">
                            {formatCategory(audition.experience_level)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {audition.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>{audition.location}</span>
                      </div>
                    )}
                    {audition.audition_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>{format(new Date(audition.audition_date), 'PPP')}</span>
                      </div>
                    )}
                    {audition.deadline && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>Apply by {format(new Date(audition.deadline), 'PPP')}</span>
                      </div>
                    )}
                    {audition.compensation && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <span>{audition.compensation}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {audition.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{audition.description}</p>
                    </div>
                  )}

                  {/* Requirements */}
                  {audition.requirements && (
                    <div>
                      <h3 className="font-semibold mb-2">Requirements</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{audition.requirements}</p>
                    </div>
                  )}

                  {/* Project Details */}
                  {audition.project_details && (
                    <div>
                      <h3 className="font-semibold mb-2">Project Details</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{audition.project_details}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {audition.tags && audition.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {audition.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Button */}
              <Card>
                <CardContent className="p-6">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowApplicationDialog(true)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>

              {/* Organizer Info */}
              {audition.profiles && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Posted By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      {audition.profiles.profile_picture_url && (
                        <img 
                          src={audition.profiles.profile_picture_url} 
                          alt={audition.profiles.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{audition.profiles.full_name}</p>
                        <p className="text-sm text-gray-600">{audition.profiles.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {audition.age_range && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Age Range:</span>
                      <p>{audition.age_range}</p>
                    </div>
                  )}
                  {audition.gender && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Gender:</span>
                      <p>{formatCategory(audition.gender)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Posted:</span>
                    <p>{format(new Date(audition.created_at), 'PPP')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Application Dialog */}
      <AuditionApplicationDialog
        isOpen={showApplicationDialog}
        onClose={() => setShowApplicationDialog(false)}
        auditionId={audition.id}
        auditionTitle={audition.title}
        onSuccess={() => {
          setShowApplicationDialog(false);
          toast.success("Application submitted successfully!");
        }}
      />
    </div>
  );
};

export default AuditionDetails;
