
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign,
  User,
  Briefcase,
  FileText,
  Users,
  Calendar as CalendarIcon 
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Default cover image
const DEFAULT_COVER = "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=1200";

interface AuditionDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  compensation: string | null;
  requirements: string | null;
  project_details: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  deadline: string | null;
  audition_date: string | null;
  category: string | null;
  age_range: string | null;
  gender: string | null;
  experience_level: string | null;
  status: string;
  created_at: string;
  creator_id: string;
  creator: {
    id: string;
    full_name: string;
    profile_picture_url: string | null;
    email: string | null;
  } | null;
}

const AuditionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [audition, setAudition] = useState<AuditionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch audition details and check if user has applied
  useEffect(() => {
    const fetchAudition = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the audition with the creator profile info
        const { data: audition, error: auditionError } = await supabase
          .from('auditions')
          .select(`
            *,
            creator:profiles(id, full_name, profile_picture_url, email)
          `)
          .eq('id', id)
          .single();
          
        if (auditionError) {
          throw auditionError;
        }
        
        if (!audition) {
          throw new Error('Audition not found');
        }
        
        setAudition(audition);
        
        // Check if the current user has already applied
        if (user) {
          const { data: application, error: applicationError } = await supabase
            .from('audition_applications')
            .select('id')
            .eq('audition_id', id)
            .eq('artist_id', user.id)
            .single();
            
          if (application && !applicationError) {
            setHasApplied(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching audition:', error);
        setError(error.message || 'Failed to load audition details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAudition();
  }, [id, user, toast]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to apply for auditions",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    
    if (!audition) return;
    
    setIsApplying(true);
    
    try {
      const { data, error } = await supabase
        .from('audition_applications')
        .insert({
          audition_id: audition.id,
          artist_id: user.id,
          status: 'pending',
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your application has been received. Check your dashboard for updates.",
      });
      
      setHasApplied(true);
    } catch (error: any) {
      console.error('Error applying to audition:', error);
      toast({
        title: "Error submitting application",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "MMMM d, yyyy");
  };
  
  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 px-4 flex items-center justify-center">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Audition</h1>
            <p className="mb-6 text-gray-600">{error}</p>
            <Button onClick={() => navigate('/auditions')}>
              Return to Auditions
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate if the user is the creator of this audition
  const isCreator = user && audition && user.id === audition.creator_id;
  
  // Get deadline info
  const daysUntilDeadline = audition?.deadline ? getDaysUntilDeadline(audition.deadline) : null;
  const isDeadlinePassed = daysUntilDeadline !== null && daysUntilDeadline < 0;
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline > 0 && daysUntilDeadline <= 5;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {isLoading ? (
          // Loading state
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-64 mb-8" />
            <Skeleton className="h-64 w-full mb-8 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-36 mt-6 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div>
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ) : audition ? (
          <>
            {/* Cover photo and header */}
            <div 
              className="w-full h-64 bg-cover bg-center relative" 
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${audition.cover_image_url || DEFAULT_COVER})`
              }}
            >
              <div className="absolute inset-0 flex items-end">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
                  <Button
                    variant="outline"
                    className="mb-4 bg-white/80 hover:bg-white"
                    onClick={() => navigate(-1)}
                  >
                    ← Back
                  </Button>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{audition.title}</h1>
                  <div className="flex flex-wrap gap-2 items-center">
                    {audition.category && (
                      <Badge className="bg-maasta-orange text-white">{audition.category}</Badge>
                    )}
                    {isUrgent && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                    {audition.status !== 'open' && (
                      <Badge variant="secondary">{audition.status.charAt(0).toUpperCase() + audition.status.slice(1)}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column: Audition details */}
                <div className="lg:col-span-2">
                  {/* Description */}
                  <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Description</h2>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{audition.description}</p>
                    </div>
                  </section>
                  
                  {/* Requirements */}
                  {audition.requirements && (
                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{audition.requirements}</p>
                      </div>
                    </section>
                  )}
                  
                  {/* Project Details */}
                  {audition.project_details && (
                    <section className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{audition.project_details}</p>
                      </div>
                    </section>
                  )}
                  
                  {/* Tags */}
                  {audition.tags && audition.tags.length > 0 && (
                    <section className="mb-8">
                      <h2 className="text-lg font-semibold mb-3">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {audition.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
                
                {/* Right column: Application and info */}
                <div>
                  {/* Action card */}
                  <Card className="mb-6 sticky top-24">
                    <CardContent className="p-6">
                      {audition.status === 'open' && !isDeadlinePassed ? (
                        <>
                          <div className="mb-6">
                            {daysUntilDeadline !== null ? (
                              <div className="text-center p-3 bg-gray-50 rounded-md mb-4">
                                <p className="text-sm text-gray-500">Application deadline</p>
                                <p className={`text-lg font-semibold ${isUrgent ? 'text-red-500' : ''}`}>
                                  {isUrgent ? 'Closing soon' : formatDate(audition.deadline)}
                                </p>
                                <p className="text-sm font-medium mt-1">
                                  {daysUntilDeadline} {daysUntilDeadline === 1 ? 'day' : 'days'} remaining
                                </p>
                              </div>
                            ) : (
                              <div className="text-center p-3 bg-gray-50 rounded-md mb-4">
                                <p className="text-sm text-gray-500">Applications</p>
                                <p className="text-lg font-semibold">Open until filled</p>
                              </div>
                            )}
                          </div>
                          
                          {isCreator ? (
                            <Button 
                              className="w-full mb-3" 
                              variant="outline"
                              onClick={() => navigate(`/dashboard/auditions/${audition.id}`)}
                            >
                              Manage Audition
                            </Button>
                          ) : (
                            <Button 
                              className="w-full mb-3 bg-maasta-purple hover:bg-maasta-purple/90" 
                              onClick={handleApply}
                              disabled={isApplying || hasApplied}
                            >
                              {isApplying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
                          <p className="text-lg font-semibold text-gray-700">
                            {isDeadlinePassed ? "Application deadline has passed" : "This audition is closed"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {isDeadlinePassed 
                              ? `The deadline was ${formatDate(audition.deadline)}`
                              : "No longer accepting applications"
                            }
                          </p>
                        </div>
                      )}
                      
                      {/* Creator info */}
                      {audition.creator && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-3">Posted by</h3>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                              {audition.creator.profile_picture_url ? (
                                <img 
                                  src={audition.creator.profile_picture_url} 
                                  alt={audition.creator.full_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                  <User size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">{audition.creator.full_name}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Posted on {formatDate(audition.created_at)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Audition details */}
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-maasta-purple mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium">Location</h3>
                        <p className="text-gray-600">{audition.location}</p>
                      </div>
                    </div>
                    
                    {/* Audition date */}
                    {audition.audition_date && (
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-maasta-purple mr-3 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium">Audition Date</h3>
                          <p className="text-gray-600">{formatDate(audition.audition_date)}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Compensation */}
                    {audition.compensation && (
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-maasta-purple mr-3 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium">Compensation</h3>
                          <p className="text-gray-600">{audition.compensation}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Experience Level */}
                    {audition.experience_level && (
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 text-maasta-purple mr-3 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium">Experience Level</h3>
                          <p className="text-gray-600">{audition.experience_level}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Gender */}
                    {audition.gender && (
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-maasta-purple mr-3 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium">Gender</h3>
                          <p className="text-gray-600">{audition.gender}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Age Range */}
                    {audition.age_range && (
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-maasta-purple mr-3 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium">Age Range</h3>
                          <p className="text-gray-600">{audition.age_range}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 px-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Audition not found</h2>
            <p className="text-gray-600 mb-6">The audition you're looking for might have been removed or doesn't exist.</p>
            <Button onClick={() => navigate('/auditions')}>
              Browse All Auditions
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuditionDetails;
