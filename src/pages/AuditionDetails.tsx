
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DEFAULT_COVER } from '@/utils/auditionHelpers';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock, Users, DollarSign, User, ArrowLeft } from 'lucide-react';
import AuditionApplicationDialog from '@/components/auditions/AuditionApplicationDialog';
import { checkApplicationStatus, AuditionApplication } from '@/services/auditionApplicationService';
import { useAuth } from '@/contexts/AuthContext';

interface AuditionDetailsData {
  audition_date: string;
  compensation: string;
  created_at: string;
  creator_id: string;
  deadline: string;
  description: string;
  id: string;
  location: string;
  project_details: string;
  requirements: string;
  status: string;
  title: string;
  updated_at: string;
  creator: {
    full_name: string;
    profile_picture_url?: string;
  };
  cover_image_url?: string | null;
  tags?: string[] | null;
  category?: string | null;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
}

const AuditionDetails = () => {
  const { id: auditionId } = useParams<{ id: string }>();
  const [audition, setAudition] = useState<AuditionDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<AuditionApplication | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAuditionDetails = async () => {
      if (!auditionId) {
        toast.error("No audition ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching audition details for ID:", auditionId);
        
        const { data, error } = await supabase
          .from('auditions')
          .select(`
            *,
            profiles!auditions_creator_id_fkey (
              full_name,
              profile_picture_url
            )
          `)
          .eq('id', auditionId)
          .single();

        if (error) {
          console.error("Error fetching audition details:", error);
          toast.error("Failed to load audition details");
          setLoading(false);
          return;
        }

        if (data) {
          console.log("Audition data fetched:", data);
          setAudition({
            ...data,
            creator: data.profiles || { full_name: 'Unknown Creator' },
            cover_image_url: data.cover_image_url || null,
            tags: data.tags || [],
            category: data.category || null,
            age_range: data.age_range || null,
            gender: data.gender || null,
            experience_level: data.experience_level || null
          });

          // Check if user has already applied
          if (user) {
            const status = await checkApplicationStatus(auditionId);
            setApplicationStatus(status);
          }
        } else {
          toast.error("Audition not found");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Failed to load audition details");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditionDetails();
  }, [auditionId, user]);

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please sign in to apply for auditions");
      navigate('/sign-in');
      return;
    }
    setShowApplicationDialog(true);
  };

  const handleApplicationSubmitted = async () => {
    if (auditionId) {
      const status = await checkApplicationStatus(auditionId);
      setApplicationStatus(status);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-maasta-purple/5 to-maasta-orange/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!audition) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-maasta-purple/5 to-maasta-orange/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-1">Audition not found</h3>
            <p className="text-gray-500 mb-4">Please check the audition ID or try again later.</p>
            <Link to="/auditions">
              <Button className="bg-maasta-purple hover:bg-maasta-purple/90 text-white">
                Back to Auditions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isDeadlinePassed = audition.deadline && new Date(audition.deadline) < new Date();

  return (
    <section className="min-h-screen bg-gradient-to-br from-maasta-purple/5 to-maasta-orange/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link to="/auditions">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Auditions
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image and Title */}
            <Card className="mb-6 overflow-hidden shadow-lg">
              <div className="relative h-64 md:h-80">
                <img
                  src={audition.cover_image_url || DEFAULT_COVER}
                  alt={audition.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = DEFAULT_COVER;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{audition.title}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {audition.creator?.full_name || 'Unknown Creator'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {audition.location}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tags and Category */}
            {(audition.tags?.length || audition.category) && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {audition.category && (
                      <Badge variant="secondary" className="bg-maasta-purple/10 text-maasta-purple">
                        {audition.category}
                      </Badge>
                    )}
                    {audition.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Audition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{audition.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{audition.requirements}</p>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{audition.project_details}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Application Status */}
            {applicationStatus ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusBadgeColor(applicationStatus.status)}>
                    {applicationStatus.status.charAt(0).toUpperCase() + applicationStatus.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Applied on {new Date(applicationStatus.application_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ) : (
              /* Apply Button */
              <Card className="mb-6">
                <CardContent className="p-6">
                  <Button 
                    onClick={handleApplyClick}
                    disabled={isDeadlinePassed || audition.status !== 'open'}
                    className="w-full bg-maasta-orange hover:bg-maasta-orange/90 text-white text-lg py-3"
                  >
                    {isDeadlinePassed ? 'Application Deadline Passed' : 
                     audition.status !== 'open' ? 'Applications Closed' : 
                     'Apply for This Audition'}
                  </Button>
                  {isDeadlinePassed && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      The deadline for this audition has passed
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Key Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 text-maasta-purple mr-3" />
                  <div>
                    <p className="font-medium">Audition Date</p>
                    <p className="text-sm text-gray-600">
                      {audition.audition_date ? new Date(audition.audition_date).toLocaleDateString() : 'To be announced'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-maasta-purple mr-3" />
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-sm text-gray-600">
                      {audition.deadline ? new Date(audition.deadline).toLocaleDateString() : 'Open until filled'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-maasta-purple mr-3" />
                  <div>
                    <p className="font-medium">Compensation</p>
                    <p className="text-sm text-gray-600">{audition.compensation}</p>
                  </div>
                </div>

                {audition.age_range && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-maasta-purple mr-3" />
                    <div>
                      <p className="font-medium">Age Range</p>
                      <p className="text-sm text-gray-600">{audition.age_range}</p>
                    </div>
                  </div>
                )}

                {audition.gender && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-maasta-purple mr-3" />
                    <div>
                      <p className="font-medium">Gender</p>
                      <p className="text-sm text-gray-600">{audition.gender}</p>
                    </div>
                  </div>
                )}

                {audition.experience_level && (
                  <div className="border-t pt-4">
                    <p className="font-medium">Experience Level</p>
                    <p className="text-sm text-gray-600">{audition.experience_level}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <AuditionApplicationDialog
        isOpen={showApplicationDialog}
        onClose={() => setShowApplicationDialog(false)}
        auditionId={auditionId || ''}
        auditionTitle={audition.title}
        onApplicationSubmitted={handleApplicationSubmitted}
      />
    </section>
  );
};

export default AuditionDetails;
