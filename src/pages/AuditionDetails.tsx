
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  FileText,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { EnhancedAuditionApplicationDialog } from "@/components/auditions/EnhancedAuditionApplicationDialog";
import { AuditionPosterProfile } from "@/components/auditions/AuditionPosterProfile";

const AuditionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: audition, isLoading, error } = useQuery({
    queryKey: ['audition', id],
    queryFn: async () => {
      if (!id) throw new Error('No audition ID provided');
      
      const { data, error } = await supabase
        .from('auditions')
        .select(`
          *,
          profiles!auditions_creator_id_fkey (
            id,
            full_name,
            profile_picture_url,
            bio
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Audition not found');
      
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !audition) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Audition Not Found</h2>
            <p className="text-gray-600 mb-4">
              The audition you're looking for doesn't exist or has been removed.
            </p>
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  const isExpired = audition.deadline && new Date(audition.deadline) < new Date();

  // Create poster profile object with safe fallbacks
  const posterProfile = audition.profiles ? {
    id: audition.profiles.id,
    full_name: audition.profiles.full_name,
    profile_picture: audition.profiles.profile_picture_url,
    bio: audition.profiles.bio
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-white/80"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Auditions
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {audition.title}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        {audition.category && (
                          <Badge className="bg-maasta-purple text-white capitalize">
                            {audition.category}
                          </Badge>
                        )}
                        {audition.experience_level && (
                          <Badge variant="outline" className="capitalize">
                            {audition.experience_level} Level
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </div>
                    </div>
                    {!isExpired && (
                      <EnhancedAuditionApplicationDialog 
                        auditionId={audition.id}
                        auditionTitle={audition.title}
                      />
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Key Details */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audition.audition_date && (
                      <div className="flex items-start space-x-3">
                        <CalendarDays className="text-maasta-purple mt-1" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900">Audition Date</h4>
                          <p className="text-gray-600">{formatDate(audition.audition_date)}</p>
                        </div>
                      </div>
                    )}

                    {audition.deadline && (
                      <div className="flex items-start space-x-3">
                        <Clock className="text-maasta-orange mt-1" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900">Application Deadline</h4>
                          <p className="text-gray-600">{formatDate(audition.deadline)}</p>
                        </div>
                      </div>
                    )}

                    {audition.location && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-green-600 mt-1" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900">Location</h4>
                          <p className="text-gray-600">{audition.location}</p>
                        </div>
                      </div>
                    )}

                    {audition.compensation && (
                      <div className="flex items-start space-x-3">
                        <DollarSign className="text-yellow-600 mt-1" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900">Compensation</h4>
                          <p className="text-gray-600">{audition.compensation}</p>
                        </div>
                      </div>
                    )}

                    {audition.age_range && (
                      <div className="flex items-start space-x-3">
                        <Users className="text-blue-600 mt-1" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900">Age Range</h4>
                          <p className="text-gray-600">{audition.age_range}</p>
                        </div>
                      </div>
                    )}

                    {audition.gender && (
                      <div className="flex items-start space-x-3">
                        <Users className="text-purple-600 mt-1" size={20} />
                        <div>
                          <h4 className="font-semibold text-gray-900">Gender</h4>
                          <p className="text-gray-600 capitalize">{audition.gender}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {audition.description && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 text-maasta-purple" size={20} />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {audition.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Details */}
              {audition.project_details && (
                <Card className="shadow-lg">
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
                <Card className="shadow-lg">
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

              {/* Tags */}
              {audition.tags && audition.tags.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {audition.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Posted By */}
              {posterProfile && (
                <AuditionPosterProfile posterProfile={posterProfile} />
              )}

              {/* Quick Apply */}
              {!isExpired && (
                <Card className="shadow-lg bg-gradient-to-br from-maasta-purple to-maasta-orange text-white">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">Ready to Apply?</h3>
                    <p className="mb-4 text-white/90">
                      Don't miss this opportunity! Submit your application now.
                    </p>
                    <EnhancedAuditionApplicationDialog 
                      auditionId={audition.id}
                      auditionTitle={audition.title}
                      variant="secondary"
                      size="lg"
                      className="w-full bg-white text-maasta-purple hover:bg-gray-100"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Application Status */}
              {isExpired && (
                <Card className="shadow-lg border-red-200">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 text-red-500" size={40} />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">
                      Applications Closed
                    </h3>
                    <p className="text-red-600">
                      The deadline for this audition has passed.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuditionDetails;
